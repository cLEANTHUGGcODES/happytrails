import { expect, test } from "@playwright/test";

const origin = "https://www.happytrailsshindigs.com";
const pages = ["/", "/venue", "/gallery", "/vendors", "/pricing", "/our-story", "/contact", "/privacy"];

test("public pages expose unique metadata and consistent canonical and sharing URLs in server HTML", async ({ request, page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of pages) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["x-robots-tag"] ?? "", path).not.toContain("noindex");
    const metadata = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const content = (selector: string) => doc.querySelector(selector)?.getAttribute("content");
      return {
        title: doc.title,
        description: content('meta[name="description"]'),
        canonicals: Array.from(doc.querySelectorAll('link[rel="canonical"]'), (link) => link.getAttribute("href")),
        robots: Array.from(doc.querySelectorAll('meta[name="robots"]'), (meta) => meta.getAttribute("content")),
        ogUrl: content('meta[property="og:url"]'),
        ogTitle: content('meta[property="og:title"]'),
        ogDescription: content('meta[property="og:description"]'),
        ogImage: content('meta[property="og:image"]'),
        twitterTitle: content('meta[name="twitter:title"]'),
        twitterDescription: content('meta[name="twitter:description"]'),
        twitterImage: content('meta[name="twitter:image"]'),
        headings: doc.querySelectorAll("h1").length,
      };
    }, await response.text());
    // Next.js omits the optional trailing slash on a root-origin metadata URL.
    expect(metadata.canonicals.map((url) => new URL(url!).href), path).toEqual([`${origin}${path}`]);
    expect(new URL(metadata.ogUrl!).href, path).toBe(`${origin}${path}`);
    expect(metadata.title, path).toContain("Happy Trails");
    expect(metadata.description?.length, path).toBeGreaterThan(40);
    expect(metadata.ogTitle, path).toBe(metadata.title);
    expect(metadata.twitterTitle, path).toBe(metadata.title);
    expect(metadata.ogDescription, path).toBe(metadata.description);
    expect(metadata.twitterDescription, path).toBe(metadata.description);
    expect(metadata.ogImage, path).toMatch(/^https:\/\/www\.happytrailsshindigs\.com\/images\//);
    expect(metadata.twitterImage, path).toBe(metadata.ogImage);
    expect(metadata.robots.join(","), path).not.toContain("noindex");
    expect(metadata.headings, path).toBe(1);
    titles.add(metadata.title);
    descriptions.add(metadata.description!);
  }
  expect(titles.size).toBe(pages.length);
  expect(descriptions.size).toBe(pages.length);
});

test("business identity is readable without JavaScript and agrees with visible contact details", async ({ request, page }) => {
  const response = await request.get("/");
  const graph = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent!)["@graph"];
  }, await response.text());
  const business = graph.find((node: { "@id": string }) => node["@id"] === `${origin}/#venue`);
  const website = graph.find((node: { "@type": string }) => node["@type"] === "WebSite");
  expect(business["@type"]).toEqual(["LocalBusiness", "EventVenue"]);
  expect(business.url).toBe(`${origin}/`);
  expect(website.url).toBe(`${origin}/`);
  expect(website.publisher["@id"]).toBe(business["@id"]);
  await page.goto("/contact");
  const contact = page.getByRole("complementary", { name: "Venue contact details" });
  await expect(contact).toContainText(business.address.streetAddress);
  await expect(contact).toContainText(business.email);
  await expect(contact).toContainText("Monday–Saturday, 10 a.m.–10 p.m.");
  for (const profile of business.sameAs) {
    await expect(contact.locator(`a[href="${profile}"]`)).toHaveCount(1);
  }
});

test("crawler controls omit empty and private pages, expose photos, and do not fabricate modification dates", async ({ request, page }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const rules = await robots.text();
  expect(rules).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(rules).toContain("Disallow: /api/");
  expect(rules).toContain("Disallow: /admin/");
  expect(rules).not.toContain("Disallow: /preview");
  expect(rules).not.toContain("Disallow: /news");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const entries = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return {
      errors: doc.querySelectorAll("parsererror").length,
      urls: Array.from(doc.getElementsByTagName("url"), (entry) => entry.getElementsByTagName("loc")[0].textContent),
      images: Array.from(doc.getElementsByTagNameNS("http://www.google.com/schemas/sitemap-image/1.1", "loc"), (entry) => entry.textContent),
      modified: doc.getElementsByTagName("lastmod").length,
    };
  }, await sitemap.text());
  expect(entries.errors).toBe(0);
  expect(entries.urls.sort()).toEqual(pages.map((path) => `${origin}${path}`).sort());
  expect(entries.images.length).toBe(21);
  expect(new Set(entries.images).size).toBe(entries.images.length);
  expect(entries.images.every((url) => url?.startsWith(`${origin}/images/`))).toBe(true);
  expect(entries.modified).toBe(0);
  for (const path of ["/news", "/preview/horse", "/not-a-real-page", "/news/not-a-real-update"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(path.includes("not-a-real") ? 404 : 200);
    const indexing = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return Array.from(doc.querySelectorAll('meta[name="robots"]'), (meta) => meta.getAttribute("content")).join(",");
    }, await response.text());
    expect(indexing, path).toContain("noindex");
  }
});

test("Vercel aliases are excluded from indexing while the public domain remains indexable", async ({ request }) => {
  for (const host of ["happytrails-tau.vercel.app", "happytrails-preview-example.vercel.app"]) {
    const response = await request.get("/", { headers: { host } });
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  }
  const production = await request.get("/", { headers: { host: "www.happytrailsshindigs.com" } });
  expect(production.status()).toBe(200);
  expect(production.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
});
