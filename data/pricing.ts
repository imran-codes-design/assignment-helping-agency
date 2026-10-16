export type CurrencyCode = "GBP" | "PKR";

export interface CurrencyConfiguration {
  defaultCode: CurrencyCode;
  locale: string;
  exchangeRateGbpToPkr: number;
  urgentSurchargeGbp: number;
  urgentSurchargePkr: number;
}

export const pricingCurrency: CurrencyConfiguration = {
  defaultCode: "GBP",
  locale: "en-GB",
  exchangeRateGbpToPkr: 360,
  urgentSurchargeGbp: 10,
  urgentSurchargePkr: 3600,
};

export const deadlineOptions = [
  { id: "15-days", label: "15 days", minutes: 15 * 24 * 60 },
  { id: "10-days", label: "10 days", minutes: 10 * 24 * 60 },
  { id: "7-days", label: "7 days", minutes: 7 * 24 * 60 },
  { id: "5-days", label: "5 days", minutes: 5 * 24 * 60 },
  { id: "3-days", label: "3 days", minutes: 3 * 24 * 60 },
  { id: "48-hours", label: "48 hours", minutes: 48 * 60 },
  { id: "24-hours", label: "24 hours", minutes: 24 * 60 },
  { id: "12-hours", label: "12 hours", minutes: 12 * 60 },
  { id: "6-hours", label: "6 hours", minutes: 6 * 60 },
] as const;

export type DeadlineId = (typeof deadlineOptions)[number]["id"];
export type DeadlineOption = (typeof deadlineOptions)[number];
export type PriceStatus = "unconfigured" | "illustrative" | "confirmed";
export const wordCountOptions = [
  500, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000,
] as const;
export type WordCount = (typeof wordCountOptions)[number];

export type SubjectCategoryId =
  | "general-assignments-essays"
  | "business-management"
  | "nursing-healthcare"
  | "programming-web-development"
  | "ai-data-science"
  | "dissertation-thesis-research"
  | "other-subjects";

export interface SubjectCategory {
  id: SubjectCategoryId;
  label: string;
  pricingModel: "standard" | "research-reference" | "quote";
  standardPricingEligible?: boolean;
}

export const subjectCategories: readonly SubjectCategory[] = [
  {
    id: "general-assignments-essays",
    label: "General Assignments & Essays",
    pricingModel: "standard",
  },
  {
    id: "business-management",
    label: "Business & Management",
    pricingModel: "standard",
  },
  {
    id: "nursing-healthcare",
    label: "Nursing & Healthcare",
    pricingModel: "standard",
  },
  {
    id: "programming-web-development",
    label: "Programming & Web Development",
    pricingModel: "quote",
  },
  {
    id: "ai-data-science",
    label: "AI & Data Science",
    pricingModel: "standard",
  },
  {
    id: "dissertation-thesis-research",
    label: "Dissertation, Thesis & Research",
    pricingModel: "research-reference",
  },
  {
    id: "other-subjects",
    label: "Other Subjects",
    pricingModel: "quote",
    standardPricingEligible: false,
  },
];

export const standardPricing = {
  minimumGbpPerThousandWords: 20,
  maximumGbpPerThousandWords: 25,
  researchReferenceWordCount: 10000 as WordCount,
  researchReferenceGbp: 300,
} as const;

export type PkrPriceOverride =
  | { kind: "range"; minimum: number; maximum: number }
  | { kind: "starting-reference"; amount: number };

export const pkrPriceOverrides: Partial<
  Record<SubjectCategoryId, Partial<Record<WordCount, PkrPriceOverride>>>
> = {};

export interface QuotePricingInput {
  subjectCategory: SubjectCategoryId;
  wordCount: WordCount;
  deadline: DeadlineId;
  currency: CurrencyCode;
}

export interface QuotePriceEstimate {
  kind: "range" | "starting-reference" | "quote";
  currency: CurrencyCode;
  display: string;
  surcharge: number;
  surchargeDisplay: string | null;
}

const urgentDeadlineMinutes = 3 * 24 * 60;

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const numberFormat = new Intl.NumberFormat(pricingCurrency.locale, {
    style: "currency",
    currency,
    currencyDisplay: currency === "PKR" ? "code" : "symbol",
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  });
  const rounded = currency === "PKR" ? Math.round(amount) : amount;
  return numberFormat.format(rounded);
}

export function isSubjectCategoryId(value: unknown): value is SubjectCategoryId {
  return subjectCategories.some((category) => category.id === value);
}

export function isDeadlineId(value: unknown): value is DeadlineId {
  return deadlineOptions.some((deadline) => deadline.id === value);
}

export function isWordCount(value: unknown): value is WordCount {
  return (
    typeof value === "number" &&
    wordCountOptions.some((wordCount) => wordCount === value)
  );
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return value === "GBP" || value === "PKR";
}

export function getQuotePriceEstimate({
  subjectCategory,
  wordCount,
  deadline,
  currency,
}: QuotePricingInput): QuotePriceEstimate {
  const category = subjectCategories.find(
    (subject) => subject.id === subjectCategory,
  );
  const deadlineOption = deadlineOptions.find(
    (option) => option.id === deadline,
  );

  if (!category || !deadlineOption || !isWordCount(wordCount)) {
    return {
      kind: "quote",
      currency,
      display: "Request a Quote",
      surcharge: 0,
      surchargeDisplay: null,
    };
  }

  const override = pkrPriceOverrides[subjectCategory]?.[wordCount];
  const estimateCurrency = currency;
  const standardEligible =
    category.pricingModel === "standard" ||
    (category.pricingModel === "quote" &&
      category.standardPricingEligible === true);
  const hasValidPkrOverride =
    !override ||
    (category.pricingModel === "research-reference"
      ? override.kind === "starting-reference" &&
        Number.isFinite(override.amount) &&
        override.amount > 0
      : standardEligible &&
        override.kind === "range" &&
        Number.isFinite(override.minimum) &&
        Number.isFinite(override.maximum) &&
        override.minimum > 0 &&
        override.maximum >= override.minimum);

  if (currency === "PKR" && !hasValidPkrOverride) {
    return {
      kind: "quote",
      currency: estimateCurrency,
      display: "Request a Quote",
      surcharge: 0,
      surchargeDisplay: null,
    };
  }

  const isUrgent = deadlineOption.minutes < urgentDeadlineMinutes;
  const surcharge =
    isUrgent && (standardEligible || category.pricingModel === "research-reference")
      ? currency === "GBP"
        ? pricingCurrency.urgentSurchargeGbp
        : pricingCurrency.urgentSurchargePkr
      : 0;

  if (
    category.pricingModel === "quote" &&
    (!("standardPricingEligible" in category) ||
      category.standardPricingEligible !== true)
  ) {
    return {
      kind: "quote",
      currency: estimateCurrency,
      display: "Request a Quote",
      surcharge: 0,
      surchargeDisplay: null,
    };
  }

  const toCurrency = (gbp: number) =>
    estimateCurrency === "GBP"
      ? gbp
      : gbp * pricingCurrency.exchangeRateGbpToPkr;

  if (category.pricingModel === "research-reference") {
    if (wordCount !== standardPricing.researchReferenceWordCount) {
      return {
        kind: "quote",
        currency: estimateCurrency,
        display: "Request a Quote",
        surcharge: 0,
        surchargeDisplay: null,
      };
    }

    const amount =
      estimateCurrency === "PKR" && override?.kind === "starting-reference"
        ? override.amount
        : toCurrency(standardPricing.researchReferenceGbp);
    const finalAmount = amount + surcharge;
    return {
      kind: "starting-reference",
      currency: estimateCurrency,
      display: `From ${formatPrice(finalAmount, estimateCurrency)}`,
      surcharge,
      surchargeDisplay: surcharge
        ? `Includes urgent surcharge of ${formatPrice(surcharge, estimateCurrency)}`
        : null,
    };
  }

  let minimum =
    estimateCurrency === "PKR" && override?.kind === "range"
      ? override.minimum
      : toCurrency(
          (wordCount / 1000) * standardPricing.minimumGbpPerThousandWords,
        );
  let maximum =
    estimateCurrency === "PKR" && override?.kind === "range"
      ? override.maximum
      : toCurrency(
          (wordCount / 1000) * standardPricing.maximumGbpPerThousandWords,
        );

  minimum += surcharge;
  maximum += surcharge;

  return {
    kind: "range",
    currency: estimateCurrency,
    display: `${formatPrice(minimum, estimateCurrency)}–${formatPrice(maximum, estimateCurrency)}`,
    surcharge,
    surchargeDisplay: surcharge
      ? `Includes urgent surcharge of ${formatPrice(surcharge, estimateCurrency)}`
      : null,
  };
}

export const academicLevels = [
  {
    id: "a-level-college",
    name: "A-Level / College",
    description: "For introductory and pre-university study levels.",
  },
  {
    id: "undergraduate-diploma",
    name: "Undergraduate / Diploma",
    description: "For diploma and undergraduate-level projects.",
  },
  {
    id: "masters",
    name: "Master’s",
    description: "For postgraduate taught-level study and research.",
  },
  {
    id: "phd",
    name: "PhD",
    description: "For doctoral-level project discussions and research support.",
  },
] as const;

export type AcademicLevelId = (typeof academicLevels)[number]["id"];
export type ServicePackageId = "starter" | "professional" | "premium-express";

export interface ConfiguredRate {
  pricePerPage: number | null;
  minimumProjectPrice?: number | null;
  expressSurcharge?: number | null;
  status: PriceStatus;
}

export interface AcademicLevelPricing {
  id: AcademicLevelId;
  name: string;
  description: string;
  pricePerPage: number | null;
  minimumProjectPrice?: number | null;
  status: PriceStatus;
  deadlinePricing: Record<DeadlineId, ConfiguredRate>;
}

export interface ServicePackage {
  id: ServicePackageId;
  name: string;
  description: string;
  positioning: string;
  highlighted?: boolean;
  ctaLabel: string;
  features: readonly string[];
  pricingByLevel?: Partial<
    Record<AcademicLevelId, Partial<Record<DeadlineId, ConfiguredRate>>>
  >;
}

const unconfiguredDeadlinePricing: Record<DeadlineId, ConfiguredRate> = {
  "15-days": { pricePerPage: null, status: "unconfigured" },
  "10-days": { pricePerPage: null, status: "unconfigured" },
  "7-days": { pricePerPage: null, status: "unconfigured" },
  "5-days": { pricePerPage: null, status: "unconfigured" },
  "3-days": { pricePerPage: null, status: "unconfigured" },
  "48-hours": { pricePerPage: null, status: "unconfigured" },
  "24-hours": { pricePerPage: null, status: "unconfigured" },
  "12-hours": { pricePerPage: null, status: "unconfigured" },
  "6-hours": { pricePerPage: null, status: "unconfigured" },
};

export const academicLevelPricing: readonly AcademicLevelPricing[] =
  academicLevels.map((level) => ({
    ...level,
    pricePerPage: null,
    status: "unconfigured",
    deadlinePricing: { ...unconfiguredDeadlinePricing },
  }));

const packageDefinitions: ServicePackage[] = [
  {
    id: "starter",
    name: "Starter",
    description: "A straightforward project with a flexible timeline.",
    positioning: "Begin with a focused conversation about your requirements.",
    ctaLabel: "Request a Quote",
    features: [
      "Initial project consultation",
      "Agree a clear project scope",
      "Discuss standard timing options",
      "Revision approach agreed in advance",
      "Referencing and formatting guidance, where applicable",
      "Communication expectations agreed together",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For more detailed research, technical topics, or complex reports.",
    positioning: "Explore structured planning and guidance matched to the project scope.",
    highlighted: true,
    ctaLabel: "Request a Quote",
    features: [
      "Detailed project consultation",
      "Structured project planning",
      "Communication options discussed",
      "Advanced formatting guidance, where applicable",
      "Revision approach agreed in advance",
      "Additional research guidance, where appropriate",
    ],
  },
  {
    id: "premium-express",
    name: "Premium Express",
    description: "For time-sensitive requests that need an availability check.",
    positioning: "Expedited support is subject to availability and agreed scope.",
    ctaLabel: "Discuss an Urgent Project",
    features: [
      "Express availability checked before agreement",
      "Priority consultation, if available",
      "Delivery expectations agreed in writing",
      "Project scope confirmed in advance",
      "Expedited communication, if available",
      "Any applicable charges explained before agreement",
    ],
  },
];

export const servicePackages: readonly ServicePackage[] =
  packageDefinitions.map((servicePackage) => ({
    ...servicePackage,
    pricingByLevel: {},
  }));

export function formatConfiguredPrice(amount: number): string {
  return formatPrice(amount, "GBP");
}

export function getConfiguredPriceLabel(rate: ConfiguredRate | undefined): string {
  if (
    rate &&
    rate.status === "confirmed" &&
    typeof rate.pricePerPage === "number" &&
    Number.isFinite(rate.pricePerPage) &&
    rate.pricePerPage > 0
  ) {
    return `${formatConfiguredPrice(rate.pricePerPage)} / page`;
  }
  return "Request a Quote";
}

export function getDeadlinePriceLabel(rate: ConfiguredRate | undefined): string {
  return getConfiguredPriceLabel(rate);
}

export function getAcademicLevelBasePriceLabel(level: AcademicLevelPricing): string {
  if (
    level.status === "confirmed" &&
    typeof level.pricePerPage === "number" &&
    Number.isFinite(level.pricePerPage) &&
    level.pricePerPage > 0
  ) {
    return `${formatConfiguredPrice(level.pricePerPage)} / page`;
  }
  return "Request a Quote";
}

export function getPackagePriceLabel(
  servicePackage: ServicePackage,
  levelId: AcademicLevelId,
  deadlineId: DeadlineId,
): string {
  return getConfiguredPriceLabel(
    servicePackage.pricingByLevel?.[levelId]?.[deadlineId],
  );
}
