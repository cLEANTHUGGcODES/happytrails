import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { faqs } from "../src/lib/content";
import { getWeddingPricingStructuredData } from "../src/lib/pricing-seo";
import { getBusinessStructuredData } from "../src/lib/seo";
import { absoluteUrl } from "../src/lib/site-url";

test("wedding price lower bound agrees with the visible pricing card and FAQ", () => {
  const page = readFileSync(new URL("../src/app/pricing/page.tsx", import.meta.url), "utf8");
  const visibleAmount = page.match(/<small>Starting at<\/small>\$([\d,]+)/)?.[1];
  const faq = faqs.find(({ id }) => id === "wedding-price");
  const faqAmount = faq?.answer.match(/start at \$([\d,]+)/)?.[1];
  assert.ok(visibleAmount, "The pricing card must still publish its starting price");
  assert.ok(faqAmount, "The FAQ must still describe a starting price");

  const offer = getWeddingPricingStructuredData()["@graph"].find((node) => node["@type"] === "Offer");
  assert.ok(offer);
  assert.equal(offer.priceSpecification.minPrice, Number(visibleAmount.replaceAll(",", "")));
  assert.equal(offer.priceSpecification.minPrice, Number(faqAmount.replaceAll(",", "")));
  assert.equal(offer.priceSpecification.priceCurrency, "USD");
});

test("the starting price belongs to wedding hire and references the existing venue and inquiry channel", () => {
  const graph = getWeddingPricingStructuredData()["@graph"];
  const service = graph.find((node) => node["@type"] === "Service");
  const offer = graph.find((node) => node["@type"] === "Offer");
  assert.ok(service);
  assert.ok(offer);
  assert.match(service.serviceType, /^Wedding venue hire$/);
  assert.equal(service.provider["@id"], getBusinessStructuredData()["@id"]);
  assert.equal(offer.seller["@id"], service.provider["@id"]);
  assert.equal(service.offers["@id"], offer["@id"]);
  assert.equal(offer.itemOffered["@id"], service["@id"]);
  assert.equal(service.url, absoluteUrl("/pricing"));
  assert.equal(offer.url, absoluteUrl("/pricing"));
  assert.equal(service.availableChannel.serviceUrl, absoluteUrl("/contact"));
});

test("pricing markup does not invent a fixed rate, package terms, or a business-wide range", () => {
  const data = getWeddingPricingStructuredData();
  const unsupportedProperties = new Set([
    "price", "maxPrice", "lowPrice", "highPrice", "priceRange", "unitCode", "unitText",
    "eligibleQuantity", "availability", "priceValidUntil", "validFrom", "validThrough",
    "valueAddedTaxIncluded", "includesObject", "aggregateRating", "review", "maximumAttendeeCapacity",
  ]);
  const unsupportedTypes = new Set(["Product", "AggregateOffer", "UnitPriceSpecification"]);

  function inspect(value: unknown) {
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      assert.equal(unsupportedProperties.has(key), false, `Unsupported pricing claim: ${key}`);
      if (key === "@type") assert.equal(unsupportedTypes.has(String(child)), false);
      inspect(child);
    }
  }

  inspect(data);
  assert.equal("priceRange" in getBusinessStructuredData(), false);
  assert.equal(data["@graph"].filter((node) => node["@type"] === "Offer").length, 1);
});
