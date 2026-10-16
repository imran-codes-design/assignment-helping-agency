import { PriceEstimatePanel } from "@/components/PriceEstimatePanel";
import { servicePackages } from "@/data/pricing";

export function PricingCalculator() {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">Pricing guide</p>
          <h2>Explore support packages.</h2>
          <p>
            Get an indicative range for eligible subjects or request a quote
            for a project that needs individual review.
          </p>
        </div>
        <div className="pricing-layout">
          <div className="plan-grid">
            {servicePackages.map((servicePackage) => (
              <article
                className={`plan-card${servicePackage.highlighted ? " plan-card--featured" : ""}`}
                key={servicePackage.id}
              >
                {servicePackage.highlighted && (
                  <span className="plan-card__flag">Package option</span>
                )}
                <h3>{servicePackage.name}</h3>
                <p>{servicePackage.description}</p>
                <p className="plan-card__price">Request a Quote</p>
                <ul>
                  {servicePackage.features.slice(0, 3).map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a className="plan-card__select" href="#quote-form">
                  {servicePackage.ctaLabel}
                </a>
              </article>
            ))}
          </div>
          <PriceEstimatePanel idPrefix="home-estimate" />
        </div>
      </div>
    </section>
  );
}
