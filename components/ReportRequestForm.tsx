"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type FormField = "fullName" | "email" | "requestType" | "reference" | "description";
type FieldErrors = Partial<Record<FormField, string>>;
type FormStatus = "idle" | "processing" | "success";

function validateForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const requestType = String(formData.get("requestType") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (fullName.length < 2) errors.fullName = "Enter your full name (at least 2 characters).";
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter an email address in the format name@example.com.";
  }
  if (!["report-access", "correction", "status", "other"].includes(requestType)) {
    errors.requestType = "Choose the type of request.";
  }
  if (description.length < 12) {
    errors.description = "Add a short description (at least 12 characters).";
  }

  return errors;
}

export function ReportRequestForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const processingTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (processingTimer.current !== null) window.clearTimeout(processingTimer.current);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateForm(new FormData(form));
    setErrors(nextErrors);

    const firstInvalidField = Object.keys(nextErrors)[0] as FormField | undefined;
    if (firstInvalidField) {
      document.getElementById(`report-${firstInvalidField}`)?.focus();
      return;
    }

    setStatus("processing");
    processingTimer.current = window.setTimeout(() => {
      setStatus("success");
      processingTimer.current = null;
    }, 450);
  }

  function handleReset() {
    if (processingTimer.current !== null) {
      window.clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
    setErrors({});
    setStatus("idle");
  }

  function handleFieldChange(field: FormField) {
    if (processingTimer.current !== null) {
      window.clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (status !== "idle") setStatus("idle");
  }

  function fieldProps(field: FormField) {
    const errorId = `report-${field}-error`;
    return {
      id: `report-${field}`,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? errorId : undefined,
      onChange: () => handleFieldChange(field),
    };
  }

  return (
    <form
      className="report-form"
      onSubmit={handleSubmit}
      onReset={handleReset}
      noValidate
      aria-describedby="report-demo-notice"
    >
      <div className="report-form__heading">
        <p className="eyebrow">Request details</p>
        <h2>How can we help?</h2>
        <p>Fields marked with <span aria-hidden="true">*</span> are required.</p>
      </div>

      <div className="report-fields">
        <label className="report-field report-field--wide" htmlFor="report-fullName">
          Full name <span aria-hidden="true">*</span>
          <input
            {...fieldProps("fullName")}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
          />
          {errors.fullName && <span className="report-field__error" id="report-fullName-error">{errors.fullName}</span>}
        </label>

        <label className="report-field" htmlFor="report-email">
          Email address <span aria-hidden="true">*</span>
          <input
            {...fieldProps("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
          {errors.email && <span className="report-field__error" id="report-email-error">{errors.email}</span>}
        </label>

        <label className="report-field" htmlFor="report-requestType">
          Request type <span aria-hidden="true">*</span>
          <select {...fieldProps("requestType")} name="requestType" required defaultValue="">
            <option value="" disabled>Select a request type</option>
            <option value="report-access">Question about report access</option>
            <option value="correction">Request a correction</option>
            <option value="status">Ask about request status</option>
            <option value="other">Other report-related question</option>
          </select>
          {errors.requestType && <span className="report-field__error" id="report-requestType-error">{errors.requestType}</span>}
        </label>

        <label className="report-field report-field--wide" htmlFor="report-reference">
          Reference or order number <span className="report-field__optional">(optional)</span>
          <input
            {...fieldProps("reference")}
            name="reference"
            type="text"
            autoComplete="off"
            maxLength={80}
            placeholder="If you have one"
          />
        </label>

        <label className="report-field report-field--wide" htmlFor="report-description">
          Description <span aria-hidden="true">*</span>
          <textarea
            {...fieldProps("description")}
            name="description"
            required
            minLength={12}
            maxLength={1500}
            rows={6}
            placeholder="Describe the report-related question or issue. Please avoid sharing sensitive personal or academic information."
          />
          {errors.description && <span className="report-field__error" id="report-description-error">{errors.description}</span>}
        </label>
      </div>

      <p className="report-form__notice" id="report-demo-notice">
        Demo form only. No report, email, or request is submitted, sent, or saved. Backend submission has not been configured.
      </p>
      <div className="report-form__actions">
        <button className="button button--primary" type="submit" disabled={status === "processing"}>
          {status === "processing" ? "Preparing demo confirmation…" : "Show demo confirmation"}
        </button>
        <button className="report-form__reset" type="reset">Reset form</button>
      </div>
      {status === "success" && (
        <p className="report-success" role="status" aria-live="polite">
          Demo complete: the form passed browser-side validation. Nothing was sent or stored. Contact handling requires a configured backend.
        </p>
      )}
    </form>
  );
}
