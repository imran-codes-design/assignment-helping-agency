import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function BlogLoading() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero page-hero--blog">
          <div className="container"><p className="eyebrow">Notes for curious learners</p><h1>Loading articles…</h1></div>
        </section>
        <section className="content-section" aria-label="Loading articles">
          <div className="container loading-grid" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => <div className="loading-card" key={index} />)}
          </div>
          <p className="visually-hidden" role="status">Loading published articles.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
