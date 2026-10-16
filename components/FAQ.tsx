"use client";

import { useState } from "react";

const questions = [
  {
    question: "What kind of support can I ask about?",
    answer: "You can ask about planning, understanding a topic, research methods, writing clarity, editing, and study skills. Any support should align with your institution's academic-integrity rules.",
  },
  {
    question: "Will someone complete assessed work for me?",
    answer: "No. This experience is designed around learning and guidance. It should not replace your own work or breach your course or institution's rules.",
  },
  {
    question: "How does a quote request work?",
    answer: "The server validates the request and recalculates any estimate. If Resend is configured with an authorized sender, the form reports success only after the provider accepts the notification; this does not confirm delivery to an inbox.",
  },
  {
    question: "Are the displayed estimates guaranteed prices?",
    answer: "No. The standard ranges and research starting reference are indicative only, not guaranteed quotes. Programming projects, other unclassified subjects, and dissertation projects outside the specified reference word count require a quote.",
  },
  {
    question: "What information should I include in a request?",
    answer: "Choose a subject category, word-count preset, required deadline, and preferred currency, then add a brief project description. Academic level is not required. Avoid sharing passwords or unnecessary sensitive information.",
  },
];

export function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <section className="section faq-section section--white" id="faq">
      <div className="container faq-layout">
        <div className="faq-intro">
          <p className="eyebrow">Good questions, clear answers</p>
          <h2>Before you begin.</h2>
          <p>Some helpful context about the support approach and this demo website.</p>
          <a href="#quote-form">Still have a question? <span aria-hidden="true">↗</span></a>
        </div>
        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = openQuestion === index;
            const answerId = `faq-answer-${index}`;
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
      </div>
    </section>
  );
}
