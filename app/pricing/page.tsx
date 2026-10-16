import type { Metadata } from "next";
import Link from "next/link";
import { PricingFAQ } from "@/components/PricingFAQ";
import { PricingPackageComparison } from "@/components/PricingPackageComparison";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Pricing Guide | Northstar Academic",
  description:
    "Explore indicative assignment price ranges in GBP or PKR, plus subject and deadline pricing rules.",
};

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page pricing-page">
        <section className="page-hero page-hero--pricing">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Pricing</span>
            </nav>
            <p className="eyebrow">Flexible support, clear conversations</p>
            <h1>Indicative Pricing<br /><span>for Your Project</span></h1>
            <p className="page-hero__description">
              Check an indicative word-count estimate in GBP or PKR. Estimates are not guaranteed quotes; some subjects require an individual quote.
            </p>
            <div className="pricing-hero__actions">
              <a className="button button--primary" href="#academic-pricing">View pricing rules <span aria-hidden="true">↓</span></a>
              <a className="button button--secondary" href="/#quote-form">Request a personalized quote</a>
            </div>
          </div>
        </section>

        <section className="content-section pricing-packages">
          <div className="container">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">Support packages</p>
              <h2>Choose a starting point.</h2>
              <p>Package prices are not configured. Use the estimator for indicative subject-based ranges; package scope and availability still require confirmation.</p>
            </div>
            <PricingPackageComparison />
            <p className="pricing-demo-note">
              Package pricing is not configured. No package-specific amount is implied by the indicative subject-based estimator.
            </p>
          </div>
        </section>

        <section className="content-section academic-pricing" id="academic-pricing">
          <div className="container">
            <div className="section-heading section-heading--row">
              <div>
                <p className="eyebrow">How estimates work</p>
                <h2>Clear pricing rules.</h2>
              </div>
              <p>Academic level does not change the indicative word-count calculation. Some subjects and project scopes need an individual quote.</p>
            </div>

            <div className="pricing-config-notice">
              <span aria-hidden="true">i</span>
              <p><strong>Indicative only.</strong> Eligible standard subjects use £20–£25 per 1,000 words. PKR estimates use the manually configured rate of £1 = PKR 360. These estimates are not guaranteed prices or offers.</p>
            </div>
            <div className="pricing-rules-grid">
              <article>
                <h3>Standard subject estimates</h3>
                <p>General assignments, business, nursing and healthcare, and AI and data science use a proportional £20–£25 per 1,000-word range.</p>
              </article>
              <article>
                <h3>Quote-required subjects</h3>
                <p>Programming and web development always require a quote. Other subjects require a quote unless explicitly marked eligible for standard pricing.</p>
              </article>
              <article>
                <h3>Research projects</h3>
                <p>A £300 starting reference applies only to comparable 10,000-word dissertation, thesis, and research projects. Other word counts require a quote.</p>
              </article>
              <article>
                <h3>Urgent deadlines</h3>
                <p>Deadlines shorter than three days add £10 or PKR 3,600 to eligible numeric estimates. Three days or longer have no urgent surcharge.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="content-section pricing-faq-section">
          <div className="container pricing-faq-layout">
            <div className="pricing-faq-intro">
              <p className="eyebrow">Pricing questions</p>
              <h2>Good to know before you ask.</h2>
              <p>Clear answers about estimates, deadlines, and the current demo pricing setup.</p>
              <Link href="/samples">Browse demonstration examples <span aria-hidden="true">↗</span></Link>
            </div>
            <PricingFAQ />
          </div>
        </section>

        <section className="pricing-cta">
          <div className="container pricing-cta__inner">
            <div>
              <p className="eyebrow eyebrow--light">Start with your requirements</p>
              <h2>Let’s clarify the scope first.</h2>
              <p>Submit the existing quote form to request a project review. The server reports success only if Resend accepts the email; provider acceptance does not confirm inbox delivery.</p>
            </div>
            <a className="button button--primary" href="/#quote-form">Request a quote <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
