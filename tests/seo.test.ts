import assert from "node:assert/strict";
import test from "node:test";
import { site, type NewsPost } from "../src/lib/content";
import {
  createPageMetadata,
  defaultSocialImage,
  getArticleStructuredData,
  getBusinessStructuredData,
  getSiteStructuredData,
  serializeJsonLd,
} from "../src/lib/seo";
import { absoluteUrl, SITE_URL } from "../src/lib/site-url";

const publicOrigin = "https://www.happytrailsshindigs.com";
const post: NewsPost = {
  id: "test-update",
  slug: "test-update",
  title: "A test venue update",
  summary: "A fixture used only to verify article metadata.",
  publishedAt: "2026-09-27T12:00:00Z",
  coverImage: null,
  body: ["First test paragraph.", "Second test paragraph."],
};

test("public URLs consistently use the HTTPS www domain", () => {
  assert.equal(SITE_URL, publicOrigin);
  assert.equal(site.url, publicOrigin);
  assert.equal(absoluteUrl(), `${publicOrigin}/`);
  assert.equal(absoluteUrl("/venue"), `${publicOrigin}/venue`);
  assert.equal(absoluteUrl("news/test-update#article"), `${publicOrigin}/news/test-update#article`);
  assert.equal(
    absoluteUrl("https://images.example.com/venue.webp"),
    "https://images.example.com/venue.webp",
  );
});

test("each page carries its own canonical and complete nested sharing metadata", () => {
  const description = "Explore the barn and grounds in Blooming Grove, Texas.";
  const metadata = createPageMetadata({ title: "The Venue", description, path: "/venue" });
  const image = {
    url: `${publicOrigin}${defaultSocialImage.src}`,
    width: defaultSocialImage.width,
    height: defaultSocialImage.height,
    alt: defaultSocialImage.alt,
  };

  assert.deepEqual(metadata.title, { absolute: "The Venue | Happy Trails" });
  assert.equal(metadata.description, description);
  assert.deepEqual(metadata.alternates, { canonical: `${publicOrigin}/venue` });
  assert.deepEqual(metadata.openGraph, {
    title: "The Venue | Happy Trails",
    description,
    url: `${publicOrigin}/venue`,
    siteName: "Happy Trails Shindigs & Events",
    locale: "en_US",
    type: "website",
    images: [image],
  });
  assert.deepEqual(metadata.twitter, {
    card: "summary_large_image",
    title: "The Venue | Happy Trails",
    description,
    images: [image],
  });
});

test("article sharing cards use the supplied image and publication date", () => {
  const image = {
    src: "https://images.example.com/celebration.webp",
    width: 1600,
    height: 900,
    alt: "Test celebration photograph",
  };
  const metadata = createPageMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    image,
  });
  const socialImage = { url: image.src, width: 1600, height: 900, alt: image.alt };

  assert.deepEqual(metadata.alternates, { canonical: `${publicOrigin}/news/test-update` });
  assert.deepEqual(metadata.openGraph, {
    title: `${post.title} | Happy Trails`,
    description: post.summary,
    url: `${publicOrigin}/news/test-update`,
    siteName: site.name,
    locale: "en_US",
    type: "article",
    images: [socialImage],
    publishedTime: post.publishedAt,
  });
  assert.deepEqual(metadata.twitter?.images, [socialImage]);
});

test("missing article image and date use a sharing image without inventing a date", () => {
  const metadata = createPageMetadata({
    title: post.title,
    description: post.summary,
    path: `/news/${post.slug}`,
    type: "article",
  });
  assert.ok(metadata.openGraph);
  assert.equal("publishedTime" in metadata.openGraph, false);
  assert.deepEqual(metadata.openGraph.images, metadata.twitter?.images);
  assert.deepEqual(metadata.openGraph.images, [{
    url: `${publicOrigin}${defaultSocialImage.src}`,
    width: defaultSocialImage.width,
    height: defaultSocialImage.height,
    alt: defaultSocialImage.alt,
  }]);
});

test("business structured data preserves the owner-confirmed address, coordinates and profiles", () => {
  const business = getBusinessStructuredData();
  assert.deepEqual(business["@type"], ["LocalBusiness", "EventVenue"]);
  assert.equal(business["@id"], `${publicOrigin}/#venue`);
  assert.equal(business.url, `${publicOrigin}/`);
  assert.equal(business.name, "Happy Trails Shindigs & Events");
  assert.equal(business.telephone, "+19035524248");
  assert.equal(business.email, "admin@happytrailsshindigs.com");
  assert.deepEqual(business.address, {
    "@type": "PostalAddress",
    streetAddress: "5281 FM 55",
    addressLocality: "Blooming Grove",
    addressRegion: "TX",
    postalCode: "76626",
    addressCountry: "US",
  });
  assert.deepEqual(business.geo, {
    "@type": "GeoCoordinates",
    latitude: 32.068833597034164,
    longitude: -96.69761704124728,
  });
  assert.equal(
    new URL(business.hasMap).searchParams.get("query"),
    "32.068833597034164,-96.69761704124728",
  );
  assert.deepEqual(business.sameAs, [
    "https://share.google/9rQF96KgYlFHWrYcA",
    "https://www.yelp.com/biz/happy-trails-shindigs-and-events-blooming-grove",
    "https://www.partyslate.com/venues/happy-trails-shindigs-events",
  ]);
  assert.deepEqual(business.sameAs, Object.values(site.profiles));
});

test("business facts do not invent Sunday hours, a hard guest maximum or reviews", () => {
  const business = getBusinessStructuredData();
  assert.deepEqual(business.openingHoursSpecification, [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "22:00",
  }]);
  assert.match(business.description, /approximately 75 guests/);
  for (const unsupportedField of ["maximumAttendeeCapacity", "aggregateRating", "review", "reviews"]) {
    assert.equal(unsupportedField in business, false);
  }
});

test("the website graph references the same business identity", () => {
  const data = getSiteStructuredData();
  assert.equal(data["@context"], "https://schema.org");
  const business = data["@graph"].find((entry) => entry["@id"] === `${publicOrigin}/#venue`);
  const website = data["@graph"].find((entry) => entry["@type"] === "WebSite");
  assert.deepEqual(business, getBusinessStructuredData());
  assert.ok(website);
  assert.equal(website.url, `${publicOrigin}/`);
  assert.equal(website["@id"], `${publicOrigin}/#website`);
  assert.ok("publisher" in website);
  assert.deepEqual(website.publisher, { "@id": business?.["@id"] });
});

test("article structured data preserves actual publication details and falls back to the venue image", () => {
  const article = getArticleStructuredData(post);
  assert.equal(article["@type"], "BlogPosting");
  assert.equal(article["@id"], `${publicOrigin}/news/test-update#article`);
  assert.equal(article.url, `${publicOrigin}/news/test-update`);
  assert.equal(article.mainEntityOfPage, article.url);
  assert.equal(article.headline, post.title);
  assert.equal(article.description, post.summary);
  assert.equal(article.datePublished, post.publishedAt);
  assert.equal(article.articleBody, "First test paragraph.\n\nSecond test paragraph.");
  assert.equal(article.image, `${publicOrigin}${defaultSocialImage.src}`);
  assert.equal(article.publisher["@id"], `${publicOrigin}/#venue`);
  assert.equal(article.publisher.name, site.name);
  assert.equal("author" in article, false);
  assert.equal("dateModified" in article, false);

  const withCover = getArticleStructuredData({
    ...post,
    coverImage: {
      id: "test-cover",
      src: "/images/barn-wide.webp",
      width: 1920,
      height: 1280,
      alt: "The barn",
      caption: "Test cover",
      category: "The Barn",
    },
  });
  assert.equal(withCover.image, `${publicOrigin}/images/barn-wide.webp`);
});

test("JSON-LD serialization cannot close a script tag and preserves untrusted text", () => {
  const data = getArticleStructuredData({
    ...post,
    title: "</script><script>alert('test')</script>",
    summary: "<img src=x onerror=alert('test')>",
    body: ["</ScRiPt><p>Guest-provided text & special characters.</p>"],
  });
  const serialized = serializeJsonLd(data);
  assert.equal(serialized.includes("<"), false);
  assert.ok(serialized.includes("\\u003c/script>"));
  assert.deepEqual(JSON.parse(serialized), data);
});
