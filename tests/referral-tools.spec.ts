import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("a shared photo opens directly and sharing preserves the selected photo", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("Clipboard blocked"); } }, configurable: true });
  });
  await page.goto("/gallery#photo-bunkhouse");
  await expect(page.getByRole("region", { name: "Happy Trails photo slideshow" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Enlarge photograph:/ })).toHaveAccessibleName(/Western-inspired bunkhouse/);
  await expect(page.getByRole("button", { name: /^Enlarge photograph:/ })).toBeInViewport();
  await page.getByRole("button", { name: "Share this photograph" }).click();
  await expect(page.getByLabel("Share link", { exact: true })).toHaveValue("https://www.happytrailsshindigs.com/gallery#photo-bunkhouse");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("button", { name: /^Enlarge photograph:/ })).toHaveAccessibleName(/Western-inspired bunkhouse/);
  await expect(page.getByRole("button", { name: /^Enlarge photograph:/ })).toBeInViewport();
  await page.goto("/gallery#photo-not-real");
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(21);
});

test("contact-card download contains the verified contact and exact map coordinates", async ({ request }) => {
  const response = await request.get("/downloads/happy-trails.vcf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/vcard");
  expect(response.headers()["content-disposition"]).toContain("attachment");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  const rawVcard = await response.text();
  expect(rawVcard.split("\r\n").every((line) => Buffer.byteLength(line) <= 75)).toBe(true);
  const vcard = rawVcard.replace(/\r\n[ \t]/g, "");
  expect(vcard).toContain("BEGIN:VCARD\r\nVERSION:3.0");
  expect(vcard).toContain("TEL;TYPE=WORK,VOICE:+19035524248");
  expect(vcard).toContain("EMAIL;TYPE=WORK:admin@happytrailsshindigs.com");
  expect(vcard).toContain("GEO:32.068833597034164;-96.69761704124728");
  expect(vcard).toContain("ADR;TYPE=WORK:;;5281 FM 55;Blooming Grove;TX;76626;United States");
});

for (const width of [390, 1440]) {
  test(`planning and referral resources are accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/planning", "/venue-info", "/guest-guide"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Breadcrumb", exact: true })).toBeVisible();
      const audit = await new AxeBuilder({ page }).analyze();
      expect(audit.violations.map(({ id }) => id), path).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), path).toBe(0);
    }
  });
}

test("inquiry referral answer is optional and sent through the existing form request", async ({ page }) => {
  let body: Record<string, unknown> | undefined;
  await page.route("**/api/inquiries", async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true, message: "Test request received" } });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Referral Test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.locator('[name="eventType"]').selectOption("Wedding");
  await page.getByLabel("How did you hear about us?").selectOption("Wedding or event directory");
  await page.getByRole("button", { name: "Send your inquiry" }).click();
  await expect.poll(() => body?.referralSource).toBe("Wedding or event directory");
});
