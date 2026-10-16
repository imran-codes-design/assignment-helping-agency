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
              href="https://wa.me/923154890603?text=Thank%20you%20for%20your%20response.%20Please%20share%20the%20following%20details%3A%0A%0A1-%20Type%20of%20assistance%20you%20need%0A2-%20Related%20material%0A3-%20Required%20format%20and%20deadline%0A%0APlease%20send%20all%20details%20and%20inquiries%20you%20have%20and%20we%20will%20respond%20as%20soon%20as%20possible.%0A%0AYour%20success%20is%20our%20success%20%F0%9F%A4%9D%0A%0AThanks%20%F0%9F%A5%B0"
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
