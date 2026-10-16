import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { blogArticles } from "@/data/blog-articles";

export const metadata: Metadata = {
  title: "Study Notes & Articles | Northstar Academic",
  description: "Learning resources and articles from Northstar Academic.",
};

const publishedArticles = blogArticles.filter((article) => article.status === "published");

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero page-hero--blog">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Articles</span>
            </nav>
            <p className="eyebrow">Notes for curious learners</p>
            <h1>Ideas worth<br /><span>spending time with.</span></h1>
            <p className="page-hero__description">A growing home for practical study guidance, research reflections, and learning resources.</p>
          </div>
        </section>
        <section className="content-section">
          <div className="container">
            {publishedArticles.length > 0 ? (
              <div className="article-grid">
                {publishedArticles.map((article) => (
                  <article className="article-card" key={article.slug}>
                    <span className="article-card__category">{article.category}</span>
                    <h2>{article.title}</h2>
                    <p>{article.excerpt}</p>
                    <div className="article-card__meta">
                      <time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString("en", { dateStyle: "long" })}</time>
                      <span>{article.readingMinutes} min read</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="content-empty blog-empty">
                <span className="content-empty__icon" aria-hidden="true">✎</span>
                <p className="eyebrow">The journal is getting ready</p>
                <h2>No articles published yet</h2>
                <p>There are no published articles to read just yet. We’ll add genuine, reviewed learning resources here when they’re ready.</p>
                <a className="button button--secondary" href="/samples">Explore demonstration projects</a>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
