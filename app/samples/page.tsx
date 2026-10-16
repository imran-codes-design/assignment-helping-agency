import type { Metadata } from "next";
import { SampleBrowser } from "@/components/SampleBrowser";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Demonstration Projects | Northstar Academic",
  description: "Browse original demonstration content for academic planning and study discussions.",
};

export default function SamplesPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero page-hero--samples">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Examples</span>
            </nav>
            <p className="eyebrow">Illustrative learning resources</p>
            <h1>Explore the thinking<br /><span>behind the work.</span></h1>
            <p className="page-hero__description">
              Browse original demonstration examples for research planning, writing, and study conversations.
            </p>
          </div>
        </section>
        <section className="content-section">
          <div className="container">
            <div className="demo-notice">
              <span className="demo-notice__icon" aria-hidden="true">i</span>
              <p><strong>Demonstration content only.</strong> These examples are fictional learning resources, not verified client work or finished assignments. No client identities, credentials, or outcomes are represented.</p>
            </div>
            <SampleBrowser />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
