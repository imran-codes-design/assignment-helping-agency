import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SamplesLoading() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero page-hero--samples">
          <div className="container">
            <p className="eyebrow">Illustrative learning resources</p>
            <h1>Loading examples…</h1>
          </div>
        </section>
        <section className="content-section" aria-label="Loading sample projects">
          <div className="container loading-grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => <div className="loading-card" key={index} />)}
          </div>
          <p className="visually-hidden" role="status">Loading demonstration projects.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
