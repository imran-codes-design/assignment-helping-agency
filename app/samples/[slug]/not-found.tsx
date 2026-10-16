import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function SampleNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="content-page not-found-page">
        <div className="container content-empty">
          <span className="content-empty__icon" aria-hidden="true">?</span>
          <p className="eyebrow">Example unavailable</p>
          <h1>We couldn't find that project.</h1>
          <p>The link may be outdated, or the example may not be part of this demonstration collection.</p>
          <Link className="button button--primary" href="/samples">Browse all examples</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
