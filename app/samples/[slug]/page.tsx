import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { sampleProjects } from "@/data/samples";

interface SampleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return sampleProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: SampleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = sampleProjects.find((item) => item.slug === slug);
  if (!project) return { title: "Example not found | Northstar Academic" };
  return {
    title: `${project.title} | Demonstration Project`,
    description: project.summary,
  };
}

export default async function SampleDetailPage({ params }: SampleDetailPageProps) {
  const { slug } = await params;
  const project = sampleProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero page-hero--detail">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/samples">Examples</Link><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span>
            </nav>
            <p className="eyebrow">{project.category} · {project.subject}</p>
            <h1>{project.title}</h1>
            <p className="page-hero__description">{project.summary}</p>
          </div>
        </section>
        <article className="content-section sample-detail">
          <div className="container sample-detail__layout">
            <div className="sample-detail__main">
              <div className="demo-notice">
                <span className="demo-notice__icon" aria-hidden="true">i</span>
                <p><strong>Demonstration content.</strong> This fictional example is provided to support discussion and learning. It is not client work, a verified portfolio item, or a submission-ready assignment.</p>
              </div>
              <section className="detail-block">
                <p className="eyebrow">About this example</p>
                <h2>Purpose and context</h2>
                <p>{project.overview}</p>
              </section>
              <section className="detail-block">
                <p className="eyebrow">Learning goals</p>
                <h2>Ideas to explore</h2>
                <ul className="detail-list">
                  {project.learningFocus.map((point) => <li key={point}><span aria-hidden="true">✦</span>{point}</li>)}
                </ul>
              </section>
              <section className="detail-block">
                <p className="eyebrow">Reflection prompts</p>
                <h2>Questions for discussion</h2>
                <ol className="detail-questions">
                  {project.discussionQuestions.map((question) => <li key={question}>{question}</li>)}
                </ol>
              </section>
              <Link className="button button--secondary" href="/samples">← Back to all examples</Link>
            </div>
            <aside className="sample-detail__aside">
              <span className="detail-art__symbol" aria-hidden="true">{project.category === "Computing" ? "⌘" : project.category === "Writing" ? "¶" : "✦"}</span>
              <p className="eyebrow">Example project</p>
              <h2>{project.subject}</h2>
              <p>Original demonstration material. No real student, client, institution, or business is depicted.</p>
              <a href="/#quote-form">Discuss a learning question <span aria-hidden="true">↗</span></a>
            </aside>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
