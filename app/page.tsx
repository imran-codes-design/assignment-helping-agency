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
        href="https://wa.me/?text=Hello%2C%20I%27d%20like%20to%20learn%20more."
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
