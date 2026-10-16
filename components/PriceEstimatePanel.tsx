"use client";

import { useState } from "react";
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

interface PriceEstimatePanelProps {
  idPrefix: string;
}

export function PriceEstimatePanel({ idPrefix }: PriceEstimatePanelProps) {
  const [subjectCategory, setSubjectCategory] =
    useState<SubjectCategoryId>("general-assignments-essays");
  const [wordCount, setWordCount] = useState<WordCount>(1000);
  const [deadline, setDeadline] = useState<DeadlineId>("7-days");
  const [currency, setCurrency] = useState<CurrencyCode>(
    pricingCurrency.defaultCode,
  );

  const estimate = getQuotePriceEstimate({
    subjectCategory,
    wordCount,
    deadline,
    currency,
  });

  return (
    <aside className="estimate-card" aria-label="Indicative price estimator">
      <p className="eyebrow eyebrow--light">Indicative estimate</p>
      <h3>Estimate your project range</h3>
      <label htmlFor={`${idPrefix}-subject`}>Subject category</label>
      <select
        id={`${idPrefix}-subject`}
        value={subjectCategory}
        onChange={(event) => {
          if (isSubjectCategoryId(event.target.value)) {
            setSubjectCategory(event.target.value);
          }
        }}
      >
        {subjectCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <label htmlFor={`${idPrefix}-word-count`}>Word count</label>
      <select
        id={`${idPrefix}-word-count`}
        value={wordCount}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (isWordCount(value)) setWordCount(value);
        }}
      >
        {wordCountOptions.map((count) => (
          <option key={count} value={count}>
            {count.toLocaleString("en-GB")} words
          </option>
        ))}
      </select>

      <label htmlFor={`${idPrefix}-deadline`}>Required deadline</label>
      <select
        id={`${idPrefix}-deadline`}
        value={deadline}
        onChange={(event) => {
          if (isDeadlineId(event.target.value)) setDeadline(event.target.value);
        }}
      >
        {deadlineOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor={`${idPrefix}-currency`}>Preferred currency</label>
      <select
        id={`${idPrefix}-currency`}
        value={currency}
        onChange={(event) => {
          if (isCurrencyCode(event.target.value)) setCurrency(event.target.value);
        }}
      >
        <option value="GBP">GBP (£)</option>
        <option value="PKR">PKR</option>
      </select>

      <div className="estimate-card__total" aria-live="polite">
        <span>
          {estimate.kind === "quote"
            ? "Indicative price"
            : estimate.kind === "starting-reference"
              ? "Starting reference"
              : "Indicative range"}
        </span>
        <strong>{estimate.display}</strong>
      </div>
      {estimate.surchargeDisplay && (
        <p className="estimate-card__surcharge">{estimate.surchargeDisplay}</p>
      )}
      <p className="estimate-card__disclaimer">
        Indicative only, not a guaranteed quote. Programming projects and
        unpriced subject categories require a quote. Dissertation references
        apply only to comparable 10,000-word projects.
        {currency === "PKR" &&
          ` PKR conversion uses the configured rate of £1 = PKR ${pricingCurrency.exchangeRateGbpToPkr}.`}
      </p>
    </aside>
  );
}
