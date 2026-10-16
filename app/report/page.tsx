import type { Metadata } from "next";
import Link from "next/link";
import { ReportRequestForm } from "@/components/ReportRequestForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Report Request | Northstar Academic",
  description: "A demonstration form for report-related questions and requests.",
};

const processSteps = [
  ["01", "Choose a request type", "Tell us what kind of report-related question you have."],
  ["02", "Add useful context", "Include a reference number if available and a brief description."],
  ["03", "Review the next step", "A live service would explain how a request is handled. This demo does not submit requests."],
];

export default function ReportPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page report-page">
        <section className="page-hero page-hero--report">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Report request</span>
            </nav>
            <p className="eyebrow">Report request support</p>
            <h1>Let’s make your<br /><span>next step clear.</span></h1>
            <p className="page-hero__description">
              Use this demonstration form to outline a report-related question. No report service or submission handling is connected.
            </p>
          </div>
        </section>

        <section className="content-section report-content">
          <div className="container report-layout">
            <div className="report-main">
              <div className="demo-notice" role="note">
                <span className="demo-notice__icon" aria-hidden="true">i</span>
                <p id="report-demo-notice-top">
                  <strong>Frontend demo only.</strong> Form entries are checked in your browser and are not sent, emailed, or stored. Do not enter sensitive information.
                </p>
              </div>
              <ReportRequestForm />
            </div>

            <aside className="report-sidebar">
              <section className="report-info-card">
                <p className="eyebrow">What happens next?</p>
                <h2>A simple request path.</h2>
                <ol className="report-process">
                  {processSteps.map(([number, title, description]) => (
                    <li key={number}>
                      <span className="report-process__number">{number}</span>
                      <div><h3>{title}</h3><p>{description}</p></div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="report-info-card report-info-card--privacy">
                <span className="report-privacy-icon" aria-hidden="true">◇</span>
                <p className="eyebrow">Privacy & confidentiality</p>
                <h2>Share only what’s needed.</h2>
                <p>This prototype does not transmit form entries to a server or store them for later access. In a live service, a privacy notice should explain who receives request details, why they are needed, and how long they are retained.</p>
                <p className="report-security-note">No attachment field is provided. Browser-only validation is not a substitute for secure server-side handling.</p>
              </section>

              <section className="report-contact-card">
                <p className="eyebrow eyebrow--light">Need help?</p>
                <h2>Contact details aren’t configured.</h2>
                <p>This demo does not have a support inbox or live contact channel. Connect and verify a contact method before launch.</p>
                <Link href="/#quote-form">Return to quote request form <span aria-hidden="true">↗</span></Link>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
