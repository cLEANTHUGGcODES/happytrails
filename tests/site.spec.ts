import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicPages = [
  { path: "/", title: /Big skies\.\s*Full hearts\.\s*Happy trails\./i },
  { path: "/venue", title: /A place to gather\.\s*Room to make it yours\./i },
  { path: "/gallery", title: /Picture yourself here\./i },
  { path: "/vendors", title: /Your vision\.\s*A little local help\./i },
  { path: "/pricing", title: /Wedding pricing\s*& celebrations\./i },
  { path: "/our-story", title: /Some trails lead\s*back to each other\./i },
  { path: "/contact", title: /Let’s make\s*something memorable\./i },
  { path: "/news", title: /Around here\./i },
  { path: "/privacy", title: /A note on privacy\./i },
];

// Browser tests must remain safe when run against an environment with real keys.
// The server unit suite separately verifies the missing-configuration branch.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        message:
          "Your inquiry could not be sent right now. Please try again or email admin@happytrailsshindigs.com.",
      }),
    }),
  );
});

async function assertNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.viewport + 1,
  );
  expect(dimensions.body, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function assertAccessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze();
  expect(
    result.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
    })),
  ).toEqual([]);
}

test.describe("Public pages", () => {
  for (const { path, title } of publicPages) {
    test(`${path} renders its heading and real photographs`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.getByRole("main")).toBeVisible();

      // Force below-the-fold photos to load as well as those initially visible.
      await page.evaluate(() =>
        Array.from(document.images).forEach((image) => {
          image.loading = "eager";
        }),
      );
      await expect
        .poll(
          () =>
            page.evaluate(() =>
              Array.from(document.images)
                .filter((image) => !image.complete || image.naturalWidth === 0)
                .map((image) => image.alt || image.src),
            ),
          { timeout: 30_000 },
        )
        .toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }

  test("video files and tour poster are served with appropriate media types", async ({
    request,
  }) => {
    for (const path of [
      "/videos/property-tour.mp4",
      "/videos/full-property-tour.mp4",
      "/images/tour-poster.webp",
    ]) {
      const response = await request.head(path);
      expect(response.ok(), path).toBe(true);
      expect(response.headers()["content-type"], path).toContain(
        path.endsWith(".mp4") ? "video/mp4" : "image/webp",
      );
      expect(Number(response.headers()["content-length"]), path).toBeGreaterThan(0);
    }
  });
});

test.describe("Gallery and property tour", () => {
  test("filters photographs and opens only the selected collection, then restores focus", async ({
    page,
  }) => {
    await page.goto("/gallery");
    const photographs = page.getByRole("button", { name: /^Open photograph:/ });
    const allCount = await photographs.count();
    expect(allCount).toBeGreaterThan(1);
    await page.getByRole("button", { name: "The Barn", exact: true }).click();
    await expect(page.getByRole("button", { name: "The Barn", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const filteredCount = await photographs.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(allCount);
    await expect(page.locator('[aria-live="polite"]')).toHaveText(`${filteredCount} photographs`);
    await expect(
      page.locator("figure").filter({ has: photographs }).locator("figcaption"),
    ).toHaveCount(filteredCount);

    const firstPhoto = photographs.first();
    const secondPhotoName = await photographs.nth(1).getAttribute("aria-label");
    await firstPhoto.click();
    const slideshow = page.getByRole("region", { name: "Happy Trails photo slideshow" });
    await expect(slideshow).toBeVisible();
    const enlarge = slideshow.getByRole("button", { name: /^Enlarge photograph:/ });
    await enlarge.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Previous", exact: true })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: "Zoom in", exact: true })).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Enter Fullscreen", exact: true }),
    ).toBeVisible();
    await expect(dialog.getByRole("navigation", { name: "Thumbnails" })).toBeVisible();
    await expect(
      dialog.getByRole("group", { name: `1 of ${filteredCount}`, exact: true }),
    ).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("button", { name: "Previous", exact: true })).toBeEnabled();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(enlarge).toBeFocused();
    await expect(slideshow).toBeVisible();
    await expect(enlarge).toHaveAttribute(
      "aria-label",
      secondPhotoName!.replace("Open photograph:", "Enlarge photograph:"),
    );
    await page
      .getByRole("group", { name: "Gallery view" })
      .getByRole("button", { name: "Grid", exact: true })
      .click();
    await expect(page.getByRole("button", { name: secondPhotoName!, exact: true })).toBeFocused();
    await page.getByRole("button", { name: "All photos", exact: true }).click();
    await expect(photographs).toHaveCount(allCount);
  });

  test("never downloads video before the visitor requests playback", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (request) => {
      if (/\/videos\/.*\.mp4(?:\?|$)/.test(request.url())) videoRequests.push(request.url());
    });
    await page.goto("/gallery");
    const play = page.getByRole("button", {
      name: "Watch the full tour: play the Happy Trails property tour",
      exact: true,
    });
    await play.scrollIntoViewIfNeeded();
    await expect(play).toBeVisible();
    await expect(page.locator("video")).toHaveCount(0);
    expect(videoRequests).toEqual([]);
    await play.click();
    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("playsinline", "");
    await expect(video).toHaveAttribute("preload", "none");
    await expect
      .poll(() => videoRequests.some((url) => url.includes("/videos/full-property-tour.mp4")))
      .toBe(true);
    await video.evaluate((element: HTMLVideoElement) => element.pause());
  });
});

test.describe("Responsive layout", () => {
  for (const width of [360, 390, 430, 768, 1440, 1920]) {
    test(`homepage fits a ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await assertNoOverflow(page);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page
          .getByRole("link", { name: "Request a Tour", exact: true })
          .filter({ visible: true })
          .first(),
      ).toBeVisible();
    });
  }

  for (const path of ["/gallery", "/contact"]) {
    test(`${path} fits the narrowest phone viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await assertNoOverflow(page);
    });
  }

  test("mobile navigation supports keyboard navigation, closes with Escape, and restores the opener", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const opener = page.getByRole("button", { name: "Open navigation" });
    await opener.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Find your happy place" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    for (let index = 0; index < 12; index++) {
      await page.keyboard.press("Tab");
      // Native dialogs permit browser-chrome navigation, but background page
      // links and form controls must never become a keyboard focus target.
      expect(
        await dialog.evaluate(
          (element) =>
            element.contains(document.activeElement) || document.activeElement === document.body,
        ),
      ).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  });
});

test.describe("Inquiry experience", () => {
  test("without JavaScript, inquiry details cannot be submitted into the URL", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/contact");
    const form = page.getByRole("form", { name: "Celebration inquiry" });
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute("action", "/api/inquiries");
    await expect(page.getByLabel("Your name")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Send your inquiry" })).toBeDisabled();
    await expect(page.locator("noscript p")).toBeVisible();
    await expect(page.locator("noscript p")).toContainText("Please enable JavaScript to use this form");
    await expect(page.getByRole("link", { name: "admin@happytrailsshindigs.com" }).first()).toHaveAttribute("href", "mailto:admin@happytrailsshindigs.com");
    await context.close();
  });

  test("invalid fields are labelled and preserved without requesting delivery", async ({
    page,
  }) => {
    let deliveries = 0;
    page.on("request", (request) => {
      if (request.url().includes("/api/inquiries")) deliveries++;
    });
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Avery Example");
    await page.getByLabel("Email address").fill("incorrect");
    await page.getByLabel("A little about your plans").fill("We would love to visit the barn.");
    await page.getByRole("button", { name: "Send your inquiry" }).click();
    await expect(
      page.getByRole("form", { name: "Celebration inquiry" }).getByRole("alert"),
    ).toContainText("A few details need your attention");
    await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("What are you celebrating?")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(page.getByLabel("Your name")).toHaveValue("Avery Example");
    await expect(page.getByLabel("Email address")).toHaveValue("incorrect");
    await expect(page.getByLabel("A little about your plans")).toHaveValue(
      "We would love to visit the barn.",
    );
    await expect(
      page.getByRole("form", { name: "Celebration inquiry" }).getByRole("alert"),
    ).toBeFocused();
    expect(deliveries).toBe(0);
  });

  test("an unavailable delivery service never reports success and retains the inquiry", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Avery Example");
    await page.getByLabel("Email address").fill("avery@example.com");
    await page.getByLabel("What are you celebrating?").selectOption("Wedding");
    const response = page.waitForResponse("**/api/inquiries");
    await page.getByRole("button", { name: "Send your inquiry" }).click();
    expect((await response).status()).toBe(503);
    await expect(
      page.getByRole("form", { name: "Celebration inquiry" }).getByRole("alert"),
    ).toContainText("could not be sent");
    await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);
    await expect(page.getByLabel("Your name")).toHaveValue("Avery Example");
    await expect(page.getByLabel("Email address")).toHaveValue("avery@example.com");
    await expect(page.getByLabel("What are you celebrating?")).toHaveValue("Wedding");
    await expect(page.getByRole("button", { name: "Send your inquiry" })).toBeEnabled();
  });
});

test.describe("Automated accessibility", () => {
  for (const path of ["/", "/venue", "/gallery", "/vendors", "/pricing", "/contact"]) {
    test(`${path} meets the checked WCAG A/AA rules`, async ({ page }) => {
      await page.goto(path);
      await assertAccessible(page);
    });
  }

  test("an open photo gallery meets the checked WCAG A/AA rules", async ({ page }) => {
    await page.goto("/gallery");
    await page
      .getByRole("button", { name: /^Open photograph:/ })
      .first()
      .click();
    await page.getByRole("button", { name: /^Enlarge photograph:/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await assertAccessible(page);
  });

  test("the mobile navigation meets the checked WCAG A/AA rules", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog", { name: "Find your happy place" })).toBeVisible();
    await assertAccessible(page);
  });
});

test("visitors can find vendors and use the owner-confirmed coordinates for directions", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Vendors", exact: true }).click();
  await expect(page).toHaveURL(/\/vendors$/);
  await page.getByRole("link", { name: "Ask About Local Vendors" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("link", { name: "View Map & Directions" }).click();
  const map = page.getByRole("region", { name: "All roads lead to a good time." });
  await expect(map).toBeVisible();
  await expect(map.getByRole("img")).toBeVisible();
  const google = new URL((await map.getByRole("link", { name: /Google Maps/ }).getAttribute("href"))!);
  expect(google.searchParams.get("destination")).toBe("32.068833597034164,-96.69761704124728");
  const apple = new URL((await map.getByRole("link", { name: /Apple Maps/ }).getAttribute("href"))!);
  expect(apple.searchParams.get("daddr")).toBe("32.068833597034164,-96.69761704124728");
  const waze = new URL((await map.getByRole("link", { name: /Waze/ }).getAttribute("href"))!);
  expect(waze.searchParams.get("ll")).toBe("32.068833597034164,-96.69761704124728");
  expect(waze.searchParams.get("navigate")).toBe("yes");
  const download = map.getByRole("link", { name: "Save the map" });
  await expect(download).toHaveAttribute("download", "Happy-Trails-Location-Map.png");
  const image = await request.get((await download.getAttribute("href"))!);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  await page.setViewportSize({ width: 360, height: 800 });
  await assertNoOverflow(page);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Vendors", exact: false }).click();
  await expect(page).toHaveURL(/\/vendors$/);
  await assertNoOverflow(page);
});
