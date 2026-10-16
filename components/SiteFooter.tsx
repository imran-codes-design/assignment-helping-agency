import Link from "next/link";

const footerLinks = [
  ["Support areas", "/#services"],
  ["How it works", "/#how-it-works"],
  ["Example projects", "/samples"],
  ["Articles", "/blog"],
  ["Report request", "/report"],
  ["Pricing", "/pricing"],
  ["Homepage pricing example", "/#pricing"],
  ["FAQs", "/#faq"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link className="brand brand--footer" href="/">
              <span className="brand__mark" aria-hidden="true">N</span>
              <span className="brand__name"><strong>Northstar</strong><span>Academic</span></span>
            </Link>
            <p>A demo identity for a learning-first academic support experience.</p>
          </div>
          <div className="site-footer__links">
            <h2>Explore</h2>
            {footerLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </div>
          <div className="site-footer__links">
            <h2>Get in touch</h2>
            <a href="/#quote-form">Quote request form</a>
            <a
              href="https://wa.me/447455670954"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us on WhatsApp
            </a>

          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Northstar Academic · Demo project</span>
          <span>Placeholder brand; no live services are connected.</span>
        </div>
      </div>
    </footer>
  );
}
