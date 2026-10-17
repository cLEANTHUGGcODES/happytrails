import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const guides = ["small-wedding-layout-checklist", "wedding-day-timeline", "outdoor-ceremony-weather-plan", "vendor-coordination-checklist"];

for (const width of [390, 1440]) {
  test(`new planning resources and tour work at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of [...guides.map((slug) => `/planning/${slug}`), "/tour"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBe(0);
      const audit = await new AxeBuilder({ page }).analyze();
      expect(audit.violations.map(({ id }) => id), path).toEqual([]);
      if (path.startsWith("/planning/")) {
        await page.locator("input").first().fill("Planning test note");
        await page.emulateMedia({ media: "print" });
        await expect(page.locator("input").first()).toHaveValue("Planning test note");
        await expect(page.locator("input").first()).toBeVisible();
        await page.emulateMedia({ media: "screen" });
      } else {
        await expect(page.locator("video")).toHaveCount(2);
        expect(await page.locator("video").evaluateAll((nodes) => nodes.every((node) => node instanceof HTMLVideoElement && !node.autoplay && node.preload === "none"))).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("FAQ citations open on arrival and repeated clicks", async ({ page }) => {
  await page.goto("/pricing#faq-guest-count");
  const answer = page.locator("#faq-guest-count");
  await expect(answer).toHaveAttribute("open", "");
  await answer.locator("summary").click();
  await expect(answer).not.toHaveAttribute("open", "");
  await page.getByRole("navigation", { name: "Find a venue answer" }).getByRole("link", { name: "How many guests can Happy Trails accommodate?" }).click();
  await expect(answer).toHaveAttribute("open", "");
});

test("referral snippets have a usable clipboard fallback", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("blocked"); } } }));
  await page.goto("/venue-info#link-to-happy-trails");
  await page.getByRole("button", { name: /^Copy html link$/i }).click();
  const field = page.getByLabel("HTML link", { exact: true });
  await expect(field).toBeFocused();
  await expect(field).toHaveValue('<a href="https://www.happytrailsshindigs.com/">Happy Trails Shindigs &amp; Events</a> — a wedding and event venue in Blooming Grove, Texas.');
  await expect(page.getByText("Text selected. Copy it using your device’s copy command.")).toBeVisible();
});

test("planning downloads and source facts return correct files, unknown names fail", async ({ request }) => {
  for (const file of ["wedding-budget.csv", "vendor-contacts.csv", "event-timeline.csv"]) {
    const response = await request.get(`/downloads/planning/${file}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/csv");
    expect(response.headers()["content-disposition"]).toContain(file);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(await response.text()).toContain("https://www.happytrailsshindigs.com/planning");
  }
  const reference = await request.get("/downloads/venue-reference.json");
  expect(reference.status()).toBe(200);
  const data = await reference.json();
  expect(data.email).toBe("admin@happytrailsshindigs.com");
  expect(data.address.streetAddress).toBe("5281 FM 55");
  expect(data.maximumAttendeeCapacity).toBeUndefined();
  expect((await request.get("/downloads/planning/missing.csv")).status()).toBe(404);
  expect((await request.get("/planning/missing-guide")).status()).toBe(404);
});

test("video sitemap and server HTML describe the actual available files", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml.match(/<video:video>/g)).toHaveLength(2);
  expect(xml).toContain("/videos/full-property-tour.mp4</video:content_loc>");
  const html = await (await request.get("/tour", { headers: { "User-Agent": "OAI-SearchBot" } })).text();
  expect(html).toContain('"@type":"VideoObject"');
  expect(html).toContain('"duration":"PT1M22.57S"');
  expect(html).toContain('/videos/full-property-tour.mp4');
});
