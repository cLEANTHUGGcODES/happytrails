import { expect, test, type Locator, type Page } from "@playwright/test";

async function protectDelivery(page: Page) {
  let requests = 0;
  await page.route((url) => url.pathname === "/api/inquiries", (route) => {
    requests += 1;
    return route.abort("blockedbyclient");
  });
  return () => expect(requests, "The animation preview must never submit an inquiry").toBe(0);
}

function runningAnimations(svg: Locator) {
  return svg.evaluate((element) =>
    element.getAnimations({ subtree: true })
      .filter((animation) => animation.playState === "running").length,
  );
}

test("the direct preview loops, supports every control, and cannot send an inquiry", async ({
  page,
  request,
}) => {
  const expectNoDelivery = await protectDelivery(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/horse");

  await expect(page.getByRole("heading", { name: "A little walk down the trail." })).toBeVisible();
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("/preview/horse");
  await expect(page.locator("form")).toHaveCount(0);

  const pending = page.getByTestId("inquiry-sending");
  const svg = pending.locator("svg").first();
  await expect(pending).toBeVisible();
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => runningAnimations(svg)).toBeGreaterThan(0);
  expect(await svg.evaluate((element) =>
    element.getAnimations({ subtree: true }).some((animation) =>
      animation.effect?.getTiming().iterations === Infinity,
    ),
  )).toBe(true);

  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
  await expect.poll(() => runningAnimations(svg)).toBe(0);
  await page.getByRole("button", { name: "Play animation", exact: true }).click();
  await expect.poll(() => runningAnimations(svg)).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  await page.getByRole("button", { name: "Restart animation", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause animation", exact: true })).toBeVisible();
  await expect.poll(() => runningAnimations(svg)).toBeGreaterThan(0);

  const stage = page.getByTestId("inquiry-preview-stage");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.getByRole("button", { name: "Mobile", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Desktop", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => Math.round((await stage.boundingBox())!.width)).toBe(360);
  await page.getByRole("button", { name: "Desktop", exact: true }).click();
  await expect(page.getByRole("button", { name: "Desktop", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => (await stage.boundingBox())!.width).toBeGreaterThan(360);

  await page.getByRole("button", { name: "Show success", exact: true }).click();
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toBeVisible();
  await expect(pending).toHaveCount(0);
  await page.getByRole("button", { name: "Show animation", exact: true }).click();
  await expect(pending).toBeVisible();
  await expect.poll(() => runningAnimations(svg)).toBeGreaterThan(0);
  await expect(page.locator("form")).toHaveCount(0);
  expectNoDelivery();
});

test("the preview controls work from the keyboard and fit a small phone", async ({ page }) => {
  const expectNoDelivery = await protectDelivery(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/horse");

  const pause = page.getByRole("button", { name: "Pause animation", exact: true });
  await pause.focus();
  await expect(pause).toBeFocused();
  await pause.press("Space");
  const play = page.getByRole("button", { name: "Play animation", exact: true });
  await expect(play).toBeFocused();
  await play.press("Enter");
  await expect(pause).toBeFocused();

  const mobile = page.getByRole("button", { name: "Mobile", exact: true });
  await mobile.focus();
  await mobile.press("Enter");
  await expect(mobile).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("inquiry-sending")).toBeVisible();
  const stage = (await page.getByTestId("inquiry-preview-stage").boundingBox())!;
  expect(stage.x).toBeGreaterThanOrEqual(0);
  expect(stage.x + stage.width).toBeLessThanOrEqual(361);

  const showSuccess = page.getByRole("button", { name: "Show success", exact: true });
  await showSuccess.focus();
  await showSuccess.press("Space");
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toBeVisible();
  const showAnimation = page.getByRole("button", { name: "Show animation", exact: true });
  await expect(showAnimation).toBeFocused();
  await showAnimation.press("Enter");
  await expect(page.getByTestId("inquiry-sending")).toBeVisible();

  const width = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(width.document).toBeLessThanOrEqual(width.viewport + 1);
  expect(width.body).toBeLessThanOrEqual(width.viewport + 1);
  expectNoDelivery();
});

test("reduced motion keeps the preview illustration still, including after restart", async ({ page }) => {
  const expectNoDelivery = await protectDelivery(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/horse");
  const svg = page.getByTestId("inquiry-sending").locator("svg").first();
  await expect(svg).toBeVisible();
  expect(await runningAnimations(svg)).toBe(0);
  expect(await svg.evaluate((element) =>
    [element, ...element.querySelectorAll("*")]
      .map((node) => getComputedStyle(node).animationName)
      .filter((name) => name !== "none"),
  )).toEqual([]);

  await page.getByRole("button", { name: "Restart animation", exact: true }).click();
  await expect(svg).toBeVisible();
  expect(await runningAnimations(svg)).toBe(0);
  await page.getByRole("button", { name: "Show success", exact: true }).click();
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toBeVisible();
  await page.getByRole("button", { name: "Show animation", exact: true }).click();
  await expect(svg).toBeVisible();
  expect(await runningAnimations(svg)).toBe(0);
  expectNoDelivery();
});
