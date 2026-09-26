import { expect, test, type Locator, type Page } from "@playwright/test";

async function waitForMotion(page: Page, mode: "ready" | "reduced" = "ready") {
  await expect(page.getByRole("main")).toHaveAttribute("data-scroll-animations", mode);
}

// Visibility assertions alone do not catch an opaque element hidden by a clip,
// or text left transparent after a route change. Inspect the painted state of
// the opted-in content without depending on GSAP's internal timeline objects.
async function expectMotionComplete(scope: Locator) {
  await expect
    .poll(() =>
      scope.evaluate((root) => {
        const selector = '[data-motion], [data-motion="image"] img';
        const targets = [
          ...(root.matches(selector) ? [root] : []),
          ...root.querySelectorAll(selector),
        ];
        return targets.flatMap((element) => {
          const style = getComputedStyle(element);
          const clipIsClear =
            style.clipPath === "none" || /^inset\((?:0(?:px|%)?\s*){1,4}\)$/.test(style.clipPath);
          const transformIsClear =
            style.transform === "none" || new DOMMatrixReadOnly(style.transform).isIdentity;
          return Number(style.opacity) >= 0.999 &&
            style.visibility === "visible" &&
            clipIsClear &&
            transformIsClear
            ? []
            : [
                {
                  element: `${element.tagName}.${element.className}`,
                  opacity: style.opacity,
                  clipPath: style.clipPath,
                  transform: style.transform,
                },
              ];
        });
      }),
    )
    .toEqual([]);
}

async function scrollTo(locator: Locator) {
  await locator.evaluate((element) =>
    element.scrollIntoView({ behavior: "instant", block: "center" }),
  );
  await expect(locator).toBeInViewport();
}

test("a below-the-fold photograph reveals on native scroll and stays revealed", async ({
  page,
}) => {
  await page.goto("/venue");
  await waitForMotion(page);
  const photograph = page.locator('#the-bunkhouse [data-motion="image"]');
  await expect(photograph).not.toBeInViewport();
  await expect
    .poll(() => photograph.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toBe("none");

  await scrollTo(photograph);
  await expectMotionComplete(photograph);
  await expect
    .poll(() => photograph.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(photograph).not.toBeInViewport();
  await expectMotionComplete(photograph);
});

test("reduced motion works at load and clears pending animation when changed live", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/venue");
  await waitForMotion(page, "reduced");
  await expectMotionComplete(page.getByRole("main"));

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await waitForMotion(page);
  const photograph = page.locator('#the-bunkhouse [data-motion="image"]');
  await expect(photograph).not.toBeInViewport();
  await expect
    .poll(() => photograph.evaluate((element) => getComputedStyle(element).clipPath))
    .not.toBe("none");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await waitForMotion(page, "reduced");
  await expectMotionComplete(page.getByRole("main"));
  await scrollTo(photograph);
  await expectMotionComplete(page.getByRole("main"));
});

test("venue content stays readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/venue`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectMotionComplete(page.getByRole("main"));
    await page.getByRole("link", { name: "The Bunkhouse", exact: true }).click();
    const section = page.locator("#the-bunkhouse");
    await expect(section.getByRole("heading")).toBeInViewport();
    await expect(section).toContainText("Mini kitchen");
    await expectMotionComplete(section);
  } finally {
    await context.close();
  }
});

test("keyboard focus reveals a pending venue card before activating it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForMotion(page);
  const cards = page.locator(".space-card");
  const nextCard = cards.nth(1);
  await expect(nextCard).not.toBeInViewport();

  // Start in the preceding link, then use an actual keyboard navigation event
  // to reach a card whose image has not entered the scrolling viewport yet.
  await cards.first().evaluate((element: HTMLElement) => element.focus({ preventScroll: true }));
  await page.keyboard.press("Tab");
  await expect(nextCard).toBeFocused();
  await expect(nextCard).toBeInViewport();
  await expectMotionComplete(nextCard);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/venue#the-grounds$/);
  await expect(page.locator("#the-grounds h2")).toBeInViewport();
});

test("direct and client-side venue hash arrivals show the destination content", async ({
  page,
}) => {
  await page.goto("/venue#getting-ready");
  await waitForMotion(page);
  const destination = page.locator("#getting-ready");
  await expect(destination.getByRole("heading")).toBeInViewport();
  await expectMotionComplete(destination);

  await page.goto("/");
  await waitForMotion(page);
  await page.locator('.space-card[href="/venue#getting-ready"]').click();
  await expect(page).toHaveURL(/\/venue#getting-ready$/);
  await waitForMotion(page);
  await expect(destination.getByRole("heading")).toBeInViewport();
  await expectMotionComplete(destination);
});

test("gallery filtering and route history leave later content visible on scroll", async ({
  page,
}) => {
  await page.goto("/gallery");
  await waitForMotion(page);
  await page.getByRole("button", { name: "The Barn", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(4);
  const tour = page.locator("#property-tour");
  await scrollTo(tour);
  await expectMotionComplete(tour);

  await page.getByRole("link", { name: "Let’s Plan a Visit", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await waitForMotion(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/gallery$/);
  await waitForMotion(page);
  await scrollTo(tour);
  await expectMotionComplete(tour);
  await page.getByRole("button", { name: "All photos", exact: true }).click();
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(15);
  await scrollTo(tour);
  await expectMotionComplete(tour);
});

test("expanding FAQs does not strand the later tour invitation behind an animation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pricing");
  await waitForMotion(page);
  const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.locator("summary").filter({ hasText: "Where is Happy Trails?" }).click();
  await page.locator("summary").filter({ hasText: "What amenities are available?" }).click();
  await expect(page.locator("details[open]")).toHaveCount(2);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollHeight))
    .toBeGreaterThan(initialHeight);

  const invitation = page.locator(".contact-cta");
  await scrollTo(invitation);
  await expectMotionComplete(invitation);
  await expect(
    invitation.getByRole("link", { name: "Let’s Plan a Visit", exact: true }),
  ).toBeVisible();
});
