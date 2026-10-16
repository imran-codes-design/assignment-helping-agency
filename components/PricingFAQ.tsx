"use client";

import { useState } from "react";

const questions = [
  {
    question: "How is the final price calculated?",
    answer:
      "Eligible standard subjects use an indicative range of £20–£25 per 1,000 words. The estimate changes with word count, subject category, deadline, and selected currency. It is not a final or guaranteed quote.",
  },
  {
    question: "Does academic level change the estimate?",
    answer:
      "No. Academic level is not used in the current word-count estimate. The project scope may still need individual review before a quote can be confirmed.",
  },
  {
    question: "Do deadlines affect the price?",
    answer:
      "Deadlines shorter than three days add an indicative £10 surcharge, or PKR 3,600 when PKR is selected, to eligible numeric estimates. Three days or longer do not have this surcharge.",
  },
  {
    question: "Can I ask about a complex technical project?",
    answer:
      "Yes. Programming and web development projects always show “Request a Quote” rather than a numeric estimate. Other project scope and availability must also be reviewed.",
  },
  {
    question: "Are express services always available?",
    answer:
      "No availability is being promised here. Express support would need to be checked and explicitly agreed before any commitment.",
  },
  {
    question: "How can I request a personalized quote?",
    answer:
      "Use the quote request form on the homepage. The server recalculates any estimate and attempts notification through Resend when valid server configuration is available. Success means only that Resend accepted the notification, not that it reached an inbox.",
  },
  {
    question: "Are the displayed prices final?",
    answer:
      "No. The standard ranges and the 10,000-word research starting reference are indicative only. Package prices and quote-only subjects require an individual quote.",
  },
  {
    question: "How are PKR estimates calculated?",
    answer:
      "If a specific PKR amount is configured, it takes priority. Otherwise, GBP amounts are converted at the manually configured rate of £1 = PKR 360 and rounded to whole rupees. No live exchange-rate service is used.",
  },
];

export function PricingFAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <div className="pricing-faq-list">
      {questions.map((item, index) => {
        const isOpen = openQuestion === index;
        const answerId = `pricing-faq-answer-${index}`;

        return (
          <article className={`faq-item${isOpen ? " faq-item--open" : ""}`} key={item.question}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenQuestion(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="faq-item__toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div className="faq-item__answer" id={answerId} hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
