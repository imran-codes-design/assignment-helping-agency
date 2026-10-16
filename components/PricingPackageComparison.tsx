import { PriceEstimatePanel } from "@/components/PriceEstimatePanel";
import { servicePackages } from "@/data/pricing";

export function PricingPackageComparison() {
  return (
    <>
      <div className="pricing-package-grid">
        {servicePackages.map((servicePackage) => (
          <article
            className={`pricing-package${servicePackage.highlighted ? " pricing-package--featured" : ""}`}
            key={servicePackage.id}
          >
            {servicePackage.highlighted && (
              <span className="pricing-package__badge">Suggested starting point</span>
            )}
            <p className="eyebrow">{servicePackage.name}</p>
            <h3>{servicePackage.description}</h3>
            <p className="pricing-package__positioning">
              {servicePackage.positioning}
            </p>
            <p className="pricing-package__price">Request a Quote</p>
            <ul>
              {servicePackage.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className={`button ${servicePackage.highlighted ? "button--primary" : "button--secondary"} button--wide`}
              href="/#quote-form"
            >
              {servicePackage.ctaLabel}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <div className="pricing-estimate-panel">
        <PriceEstimatePanel idPrefix="pricing-estimate" />
      </div>
    </>
  );
}
