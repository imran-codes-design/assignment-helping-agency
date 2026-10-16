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
        href="https://wa.me/923154890603"
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
