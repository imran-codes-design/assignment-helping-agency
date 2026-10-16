import { NextRequest, NextResponse } from "next/server";
import {
  deadlineOptions,
  getQuotePriceEstimate,
  isCurrencyCode,
  isDeadlineId,
  isSubjectCategoryId,
  isWordCount,
  subjectCategories,
} from "@/data/pricing";

export const runtime = "nodejs";

const DEFAULT_NOTIFICATION_EMAIL = "drimran.global@gmail.com";
const MAX_REQUEST_BYTES = 12_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitByIp = new Map<string, { count: number; windowStartedAt: number }>();
const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "gmx.com",
  "mail.com",
]);

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizedText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const sanitized = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  return sanitized.length <= maxLength ? sanitized : null;
}

function sanitizedLine(value: unknown, maxLength: number): string | null {
  const text = sanitizedText(value, maxLength);
  return text === null ? null : text.replace(/\s+/g, " ");
}

function isValidEmail(value: string): boolean {
  return (
    value.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)
  );
}

function isAllowedSenderAddress(value: string): boolean {
  if (!isValidEmail(value)) return false;
  const domain = value.slice(value.lastIndexOf("@") + 1).toLowerCase();
  return (
    !PUBLIC_EMAIL_DOMAINS.has(domain) &&
    !domain.endsWith(".example") &&
    domain !== "example.com" &&
    domain.includes(".")
  );
}

function takeRateLimit(ip: string, now: number): boolean {
  for (const [key, entry] of rateLimitByIp) {
    if (now - entry.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      rateLimitByIp.delete(key);
    }
  }

  const current = rateLimitByIp.get(ip);
  if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    rateLimitByIp.set(ip, { count: 1, windowStartedAt: now });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

function getRequestIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();
  return (
    request.headers.get("x-real-ip")?.trim() ||
    firstForwarded ||
    "unknown"
  ).slice(0, 80);
}

function getEmailConfiguration():
  | { apiKey: string; recipient: string; sender: string }
  | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient =
    process.env.QUOTE_NOTIFICATION_EMAIL?.trim() ||
    DEFAULT_NOTIFICATION_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL?.trim();

  if (
    !apiKey ||
    !sender ||
    !isValidEmail(recipient) ||
    !isAllowedSenderAddress(sender)
  ) {
    return null;
  }

  return { apiKey, recipient, sender };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return jsonError("Request origin is not allowed.", 403);
      }
    } catch {
      return jsonError("Request origin is not allowed.", 403);
    }
  }

  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return jsonError("Send the quote request as JSON.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonError("The request is too large.", 413);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_REQUEST_BYTES) {
    return jsonError("The request is too large.", 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("The request body is invalid.", 400);
  }
  if (!isRecord(body)) return jsonError("The request body is invalid.", 400);

  const fullName = sanitizedLine(body.fullName, 100);
  const email = sanitizedLine(body.email, 254);
  const whatsapp = sanitizedLine(body.whatsapp ?? "", 30);
  const instructions = sanitizedText(body.instructions, 4000);
  const honeypot = sanitizedText(body.website ?? "", 200);
  const wordCount = body.wordCount;

  if (
    !fullName ||
    fullName.length < 2 ||
    !email ||
    !isValidEmail(email) ||
    whatsapp === null ||
    (whatsapp !== "" && !/^[+\d()\s.-]{7,30}$/.test(whatsapp)) ||
    !isSubjectCategoryId(body.subjectCategory) ||
    typeof wordCount !== "number" ||
    !isWordCount(wordCount) ||
    !isDeadlineId(body.deadline) ||
    !isCurrencyCode(body.currency) ||
    !instructions ||
    instructions.length < 12
  ) {
    return jsonError("Check the required fields and selected options.", 400);
  }

  if (honeypot) return jsonError("The request could not be processed.", 400);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim() ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
    return jsonError("The request could not be processed. Please retry.", 400);
  }

  if (!takeRateLimit(getRequestIp(request), Date.now())) {
    return jsonError("Too many requests. Please wait before trying again.", 429);
  }

  const emailConfiguration = getEmailConfiguration();
  if (!emailConfiguration) {
    return jsonError(
      "Quote email submission is unavailable until Resend credentials and an authorized sender domain are configured.",
      503,
    );
  }

  const category = subjectCategories.find(
    (subject) => subject.id === body.subjectCategory,
  );
  const deadlineOption = deadlineOptions.find(
    (option) => option.id === body.deadline,
  );
  if (!category || !deadlineOption) {
    return jsonError("Check the selected subject and deadline.", 400);
  }

  const estimate = getQuotePriceEstimate({
    subjectCategory: category.id,
    wordCount,
    deadline: deadlineOption.id,
    currency: body.currency,
  });
  const submittedAt = new Date().toISOString();
  const emailText = [
    "New quote request",
    "",
    `Full name: ${fullName}`,
    `Customer email: ${email}`,
    `WhatsApp number: ${whatsapp || "Not provided"}`,
    `Subject category: ${category.label}`,
    `Word count: ${wordCount.toLocaleString("en-GB")}`,
    `Required deadline: ${deadlineOption.label}`,
    `Preferred currency: ${body.currency}`,
    `Server-calculated estimate: ${estimate.display}`,
    estimate.surchargeDisplay
      ? `Surcharge: ${estimate.surchargeDisplay}`
      : "Surcharge: None",
    "Estimate terms: Indicative only, not a guaranteed quote.",
    `Project instructions:\n${instructions}`,
    "",
    `Submitted at: ${submittedAt}`,
  ].join("\n");

  let providerResponse: Response;
  try {
    providerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailConfiguration.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: emailConfiguration.sender,
        to: [emailConfiguration.recipient],
        reply_to: email,
        subject: "New quote request",
        text: emailText,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("Resend quote notification request failed.");
    return jsonError(
      "The email provider could not be reached. Your form details are still available; please retry later.",
      502,
    );
  }

  if (!providerResponse.ok) {
    console.error(
      `Resend did not accept a quote notification (HTTP ${providerResponse.status}).`,
    );
    return jsonError(
      "The email provider did not accept the request. Your form details are still available; please retry later.",
      502,
    );
  }

  let providerResult: unknown;
  try {
    providerResult = await providerResponse.json();
  } catch {
    console.error("Resend quote notification returned an unreadable response.");
    return jsonError(
      "The provider response could not be confirmed. Please retry later.",
      502,
    );
  }
  if (!isRecord(providerResult) || typeof providerResult.id !== "string") {
    console.error("Resend quote notification returned no acceptance reference.");
    return jsonError(
      "The provider response could not be confirmed. Please retry later.",
      502,
    );
  }

  return NextResponse.json({
    status: "accepted",
    message:
      "Resend accepted the notification for processing. This does not confirm delivery to the recipient's inbox.",
  });
}
