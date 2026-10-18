import { site } from "./content";
import { absoluteUrl } from "./site-url";

/** The published wedding starting price applies to this service, not every event. */
export function getWeddingPricingStructuredData() {
  const serviceId = absoluteUrl("/pricing#wedding-venue-hire");
  const offerId = absoluteUrl("/pricing#wedding-starting-price");
  const venueId = absoluteUrl("/#venue");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": serviceId,
        name: `Wedding venue hire at ${site.shortName}`,
        serviceType: "Wedding venue hire",
        description:
          "Weddings at Happy Trails in Blooming Grove, Texas, start at $3,000. Contact Jennifer and Randy to discuss your plans and receive pricing for your celebration.",
        url: absoluteUrl("/pricing"),
        mainEntityOfPage: { "@id": absoluteUrl("/pricing#webpage") },
        provider: { "@id": venueId },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: absoluteUrl("/contact"),
        },
        offers: { "@id": offerId },
      },
      {
        "@type": "Offer",
        "@id": offerId,
        name: "Wedding venue starting price",
        description:
          "Wedding venue pricing starts at $3,000. Contact Jennifer and Randy for a quote for your celebration.",
        url: absoluteUrl("/pricing"),
        seller: { "@id": venueId },
        itemOffered: { "@id": serviceId },
        // Only the lower bound is supplied. No fixed package price, per-person
        // rate, upper bound, availability, tax treatment, or inclusions are known.
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 3000,
          priceCurrency: "USD",
        },
      },
    ],
  } as const;
}
