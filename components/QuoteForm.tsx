"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  deadlineOptions,
  getQuotePriceEstimate,
  isCurrencyCode,
  isDeadlineId,
  isSubjectCategoryId,
  isWordCount,
  pricingCurrency,
  subjectCategories,
  wordCountOptions,
  type CurrencyCode,
  type DeadlineId,
  type SubjectCategoryId,
  type WordCount,
} from "@/data/pricing";

type QuoteField =
  | "fullName"
  | "email"
  | "whatsapp"
  | "subjectCategory"
  | "wordCount"
  | "deadline"
  | "currency"
  | "instructions";
type FieldErrors = Partial<Record<QuoteField, string>>;
type FormStatus = "idle" | "submitting" | "accepted" | "error";

function createIdempotencyKey(): string | null {
  try {
    const secureCrypto = globalThis.crypto;
    if (typeof secureCrypto.randomUUID === "function") {
      try {
        return secureCrypto.randomUUID();
      } catch {
        if (typeof secureCrypto.getRandomValues !== "function") return null;
      }
    }
    if (typeof secureCrypto.getRandomValues !== "function") return null;

    const bytes = secureCrypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join("-");
  } catch {
    return null;
  }
}

function validateQuoteForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const subjectCategory = String(formData.get("subjectCategory") ?? "");
  const wordCount = Number(formData.get("wordCount"));
  const deadline = String(formData.get("deadline") ?? "");
  const currency = String(formData.get("currency") ?? "");
  const instructions = String(formData.get("instructions") ?? "").trim();

  if (fullName.length < 2 || fullName.length > 100) {
    errors.fullName = "Enter your name (2 to 100 characters).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }
  if (whatsapp && !/^[+\d()\s.-]{7,30}$/.test(whatsapp)) {
    errors.whatsapp = "Enter a valid WhatsApp number or leave this optional field blank.";
  }
  if (!isSubjectCategoryId(subjectCategory)) {
    errors.subjectCategory = "Choose a subject category.";
  }
  if (!isWordCount(wordCount)) {
    errors.wordCount = "Choose one of the listed word-count options.";
  }
  if (!isDeadlineId(deadline)) errors.deadline = "Choose a required deadline.";
  if (!isCurrencyCode(currency)) errors.currency = "Choose GBP or PKR.";
  if (instructions.length < 12 || instructions.length > 4000) {
    errors.instructions = "Describe your project in 12 to 4,000 characters.";
  }
  return errors;
}

export function QuoteForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [subjectCategory, setSubjectCategory] =
    useState<SubjectCategoryId | "">("");
  const [wordCount, setWordCount] = useState<WordCount | "">("");
  const [deadline, setDeadline] = useState<DeadlineId | "">("");
  const [currency, setCurrency] = useState<CurrencyCode>(
    pricingCurrency.defaultCode,
  );
  const idempotencyKey = useRef<string | null>(null);

  const estimate =
    subjectCategory && wordCount && deadline
      ? getQuotePriceEstimate({ subjectCategory, wordCount, deadline, currency })
      : null;

  function clearServerError() {
    if (status === "error" || status === "accepted") {
      setStatus("idle");
      setStatusMessage("");
    }
    idempotencyKey.current = null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || status === "accepted") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validateQuoteForm(formData);
    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0] as QuoteField | undefined;
    if (firstInvalidField) {
      document.getElementById(`quote-${firstInvalidField}`)?.focus();
      return;
    }

    if (!subjectCategory || !wordCount || !deadline || !estimate) {
      setStatus("error");
      setStatusMessage("Select the required pricing options and try again.");
      return;
    }

    const requestBody = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      subjectCategory,
      wordCount,
      deadline,
      currency,
      estimate: estimate.display,
      instructions: String(formData.get("instructions") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    setStatus("submitting");
    setStatusMessage("");
    if (!idempotencyKey.current) {
      idempotencyKey.current = createIdempotencyKey();
    }
    if (!idempotencyKey.current) {
      setStatus("error");
      setStatusMessage(
        "A secure request identifier could not be created in this browser. Enable secure browser cryptography and try again.",
      );
      return;
    }

    void fetch("/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey.current,
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        const result = (await response.json().catch(() => null)) as
          | { status?: unknown; message?: unknown; error?: unknown }
          | null;
        if (
          !response.ok ||
          result?.status !== "accepted" ||
          typeof result.message !== "string"
        ) {
          const message =
            result && typeof result.error === "string"
              ? result.error
              : "The request could not be submitted. Your details are still here; please retry later.";
          throw new Error(message);
        }
        setStatus("accepted");
        setStatusMessage(result.message);
      })
      .catch((error: unknown) => {
        setStatus("error");
        setStatusMessage(
          error instanceof Error
            ? error.message
            : "The request could not be submitted. Your details are still here; please retry later.",
        );
      });
  }

  function resetForm() {
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
    setSubjectCategory("");
    setWordCount("");
    setDeadline("");
    setCurrency(pricingCurrency.defaultCode);
    idempotencyKey.current = null;
    document.getElementById("quote-fullName")?.closest("form")?.reset();
  }

  function fieldProps(field: QuoteField) {
    const errorId = `quote-${field}-error`;
    return {
      id: `quote-${field}`,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? errorId : undefined,
      onChange: () => {
        clearServerError();
        if (errors[field]) {
          setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
          });
        }
      },
    };
  }

  return (
    <section className="quote-section" id="quote-form">
      <div className="container quote-layout">
        <div className="quote-copy">
          <p className="eyebrow eyebrow--light">Start with a conversation</p>
          <h2>Tell us where<br />you&apos;d like to go.</h2>
          <p>
            Describe your project and preferred timing. The estimate is
            indicative and never a guaranteed quote.
          </p>
          <div className="quote-callout">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>Your work stays yours.</strong><br />
              Share only the information needed to discuss your request.
            </p>
          </div>
        </div>
        <form className="quote-form" onSubmit={handleSubmit} noValidate>
          <div className="quote-form__heading">
            <h3>Request a quote</h3>
            <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
          </div>
          <fieldset
            className="quote-form__fieldset"
            disabled={status === "submitting"}
          >
          <legend className="visually-hidden">Quote request details</legend>
          <div className="form-grid">
            <label className="form-grid__full" htmlFor="quote-fullName">
              Full name *
              <input
                {...fieldProps("fullName")}
                name="fullName"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
              />
              {errors.fullName && <span className="quote-field__error" id="quote-fullName-error">{errors.fullName}</span>}
            </label>
            <label htmlFor="quote-email">
              Email address *
              <input
                {...fieldProps("email")}
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
              {errors.email && <span className="quote-field__error" id="quote-email-error">{errors.email}</span>}
            </label>
            <label htmlFor="quote-whatsapp">
              WhatsApp number <span className="quote-field__optional">(optional)</span>
              <input
                {...fieldProps("whatsapp")}
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                maxLength={30}
                placeholder="+44 0000 000000"
              />
              {errors.whatsapp && <span className="quote-field__error" id="quote-whatsapp-error">{errors.whatsapp}</span>}
            </label>
            <label htmlFor="quote-subjectCategory">
              Subject category *
              <select
                {...fieldProps("subjectCategory")}
                name="subjectCategory"
                required
                value={subjectCategory}
                onChange={(event) => {
                  fieldProps("subjectCategory").onChange();
                  if (isSubjectCategoryId(event.target.value)) {
                    setSubjectCategory(event.target.value);
                  } else {
                    setSubjectCategory("");
                  }
                }}
              >
                <option value="" disabled>Select a subject</option>
                {subjectCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
              {errors.subjectCategory && <span className="quote-field__error" id="quote-subjectCategory-error">{errors.subjectCategory}</span>}
            </label>
            <label htmlFor="quote-wordCount">
              Word count *
              <select
                {...fieldProps("wordCount")}
                name="wordCount"
                required
                value={wordCount}
                onChange={(event) => {
                  fieldProps("wordCount").onChange();
                  const value = Number(event.target.value);
                  setWordCount(isWordCount(value) ? value : "");
                }}
              >
                <option value="" disabled>Select word count</option>
                {wordCountOptions.map((count) => (
                  <option key={count} value={count}>
                    {count.toLocaleString("en-GB")} words
                  </option>
                ))}
              </select>
              {errors.wordCount && <span className="quote-field__error" id="quote-wordCount-error">{errors.wordCount}</span>}
            </label>
            <label htmlFor="quote-deadline">
              Required deadline *
              <select
                {...fieldProps("deadline")}
                name="deadline"
                required
                value={deadline}
                onChange={(event) => {
                  fieldProps("deadline").onChange();
                  setDeadline(isDeadlineId(event.target.value) ? event.target.value : "");
                }}
              >
                <option value="" disabled>Select deadline</option>
                {deadlineOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              {errors.deadline && <span className="quote-field__error" id="quote-deadline-error">{errors.deadline}</span>}
            </label>
            <label htmlFor="quote-currency">
              Preferred currency *
              <select
                {...fieldProps("currency")}
                name="currency"
                required
                value={currency}
                onChange={(event) => {
                  fieldProps("currency").onChange();
                  if (isCurrencyCode(event.target.value)) {
                    setCurrency(event.target.value);
                  }
                }}
              >
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR</option>
              </select>
              {errors.currency && <span className="quote-field__error" id="quote-currency-error">{errors.currency}</span>}
            </label>
            <label className="form-grid__full" htmlFor="quote-instructions">
              Project instructions / description *
              <textarea
                {...fieldProps("instructions")}
                name="instructions"
                required
                minLength={12}
                maxLength={4000}
                rows={4}
                placeholder="Describe the project and what support you are looking for. Please do not include passwords or unnecessary sensitive information."
              />
              {errors.instructions && <span className="quote-field__error" id="quote-instructions-error">{errors.instructions}</span>}
            </label>
            <div className="quote-honeypot" aria-hidden="true">
              <label htmlFor="quote-website">Leave this field empty</label>
              <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
          </div>

          <div className="quote-estimate" aria-live="polite">
            <span>Indicative estimate</span>
            <strong>{estimate?.display ?? "Choose a subject, word count, and deadline."}</strong>
            {estimate?.surchargeDisplay && <small>{estimate.surchargeDisplay}</small>}
            {estimate?.kind === "starting-reference" && (
              <small>Indicative reference for comparable 10,000-word projects only.</small>
            )}
            <small>
              Estimates are not guaranteed quotes.
              {currency === "PKR" &&
                ` Conversion uses £1 = PKR ${pricingCurrency.exchangeRateGbpToPkr}.`}
            </small>
          </div>
          </fieldset>

          <p className="quote-form__notice">
            Email submission is not yet operational: configure Resend
            credentials and an authorized sender domain first. A success message
            appears only after the server confirms that Resend accepted the
            notification; this does not confirm delivery to the recipient&apos;s inbox.
          </p>
          <div className="quote-form__actions">
            <button
              className="button button--primary button--wide"
              type="submit"
              disabled={status === "submitting" || status === "accepted"}
            >
              {status === "submitting"
                ? "Submitting securely…"
                : status === "accepted"
                  ? "Accepted by email provider"
                  : "Submit quote request"}
              {status === "idle" && <span aria-hidden="true">↗</span>}
            </button>
            <button
              className="quote-form__reset"
              type="button"
              onClick={resetForm}
              disabled={status === "submitting"}
            >
              Reset form
            </button>
          </div>
          {statusMessage && (
            <p
              className={status === "accepted" ? "form-success" : "form-error"}
              role={status === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
