import { FAQ } from "@/components/FAQ";
import { HomeSections } from "@/components/HomeSections";
import { PricingCalculator } from "@/components/PricingCalculator";
import { QuoteForm } from "@/components/QuoteForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeSections />
        <PricingCalculator />
        <FAQ />
        <QuoteForm />
      </main>
      <SiteFooter />
      <a
        className="whatsapp-float"
        href="https://wa.me/923154890603?text=Assalam-o-Alaikum%21%20Thank%20you%20for%20contacting%20us.%0A%0APlease%20share%20the%20following%20details%3A%0A1-%20Type%20of%20assistance%20you%20need%0A2-%20Related%20material%0A3-%20Pattern%20and%20duration%0A%0APlease%20send%20all%20details%20and%20inquiries%20you%20have.%20We%20will%20respond%20as%20soon%20as%20possible.%0A%0AYour%20success%20is%20our%20success%20%F0%9F%A4%9D%0AThanks%20%F0%9F%A5%B0"
        target="_blank"
        rel="noreferrer"
        aria-label="Open WhatsApp and choose a contact"
      >
        <span aria-hidden="true">↗</span>
        <span className="whatsapp-float__label">WhatsApp</span>
      </a>
    </>
  );
}
