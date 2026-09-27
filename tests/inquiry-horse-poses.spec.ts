import { expect, test, type Locator, type Page } from "@playwright/test";

async function protectDelivery(page: Page) {
  let requests = 0;
  await page.route((url) => url.pathname === "/api/inquiries", (route) => {
    requests += 1;
    return route.abort("blockedbyclient");
  });
  return () => expect(requests, "The horse preview must never submit an inquiry").toBe(0);
}

function readPoseState(svg: Locator) {
  return svg.evaluate((element) => {
    const viewport = element.querySelector<SVGSVGElement>("[data-horse-viewport]");
    if (!viewport) throw new Error("The horse must have a clipped sprite viewport.");
    // A nested SVG's bounding rect includes its overflowing descendants. Its
    // actual clip is the viewBox projected into screen coordinates instead.
    const matrix = viewport.getScreenCTM();
    if (!matrix) throw new Error("The horse viewport must have a screen transform.");
    const box = viewport.viewBox.baseVal;
    const corners = [
      new DOMPoint(box.x, box.y),
      new DOMPoint(box.x + box.width, box.y),
      new DOMPoint(box.x, box.y + box.height),
      new DOMPoint(box.x + box.width, box.y + box.height),
    ].map((point) => point.matrixTransform(matrix));
    const bounds = {
      left: Math.min(...corners.map((point) => point.x)),
      right: Math.max(...corners.map((point) => point.x)),
      top: Math.min(...corners.map((point) => point.y)),
      bottom: Math.max(...corners.map((point) => point.y)),
    };
    return {
      visible: [...viewport.querySelectorAll("[data-horse-pose]")]
        .filter((pose) => {
          const rect = pose.getBoundingClientRect();
          const width = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left);
          const height = Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top);
          return width > 0.5 && height > 0.5;
        })
        .map((pose) => pose.getAttribute("data-horse-pose")),
      animations: element.getAnimations({ subtree: true }).map((animation) => ({
        playState: animation.playState,
        currentTime: animation.currentTime,
      })),
    };
  });
}

test("the horse shows one pose throughout its walk and the preview can freeze it", async ({ page }) => {
  const expectNoDelivery = await protectDelivery(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/preview/horse");
  const svg = page.getByTestId("inquiry-sending").locator("svg").first();
  await expect(svg).toBeVisible();
  await expect.poll(() => svg.locator("[data-horse-pose]").count()).toBeGreaterThan(1);

  // CSS animations use the document timeline, independently of mocked JS timers.
  // Seek the real sprite strip to sample both frame boundaries and
  // the spaces between them without relying on machine speed or wall-clock luck.
  const samples = await svg.evaluate((element) => {
    const viewport = element.querySelector<SVGSVGElement>("[data-horse-viewport]");
    if (!viewport) throw new Error("The horse must have a clipped sprite viewport.");
    const poses = [...viewport.querySelectorAll("[data-horse-pose]")];
    const animation = viewport.getAnimations({ subtree: true })[0];
    const duration = Number(animation?.effect?.getTiming().duration);
    if (!animation || !Number.isFinite(duration) || duration <= 0) {
      throw new Error("The horse must have a finite, positive walk cycle.");
    }
    animation.pause();
    const steps = poses.length * 8;
    return Array.from({ length: steps + 1 }, (_, step) => {
      const time = duration * step / steps;
      animation.currentTime = time;
      const matrix = viewport.getScreenCTM();
      if (!matrix) throw new Error("The horse viewport must have a screen transform.");
      const box = viewport.viewBox.baseVal;
      const corners = [
        new DOMPoint(box.x, box.y),
        new DOMPoint(box.x + box.width, box.y),
        new DOMPoint(box.x, box.y + box.height),
        new DOMPoint(box.x + box.width, box.y + box.height),
      ].map((point) => point.matrixTransform(matrix));
      const bounds = {
        left: Math.min(...corners.map((point) => point.x)),
        right: Math.max(...corners.map((point) => point.x)),
        top: Math.min(...corners.map((point) => point.y)),
        bottom: Math.max(...corners.map((point) => point.y)),
      };
      return {
        time,
        visible: poses
          .filter((pose) => {
            const rect = pose.getBoundingClientRect();
            const width = Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left);
            const height = Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top);
            return width > 0.5 && height > 0.5;
          })
          .map((pose) => pose.getAttribute("data-horse-pose")),
      };
    });
  });
  for (const sample of samples) {
    expect(sample.visible, `Visible horse poses at ${sample.time} ms`).toHaveLength(1);
  }
  expect(new Set(samples.flatMap((sample) => sample.visible)).size).toBeGreaterThan(1);

  // Remount to remove the imperative seeking above before checking the actual
  // preview controls and their CSS pause behavior.
  await page.getByRole("button", { name: "Restart animation", exact: true }).click();
  await expect.poll(async () => (await readPoseState(svg)).animations
    .filter((animation) => animation.playState === "running").length).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pause animation", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play animation", exact: true })).toBeVisible();
  await expect.poll(async () => (await readPoseState(svg)).animations
    .filter((animation) => animation.playState === "running").length).toBe(0);
  const paused = await readPoseState(svg);
  expect(paused.visible).toHaveLength(1);
  await page.waitForTimeout(160);
  expect(await readPoseState(svg)).toEqual(paused);
  expectNoDelivery();
});

test("reduced motion leaves one complete horse visible without running SVG animations", async ({ page }) => {
  const expectNoDelivery = await protectDelivery(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/preview/horse");
  const svg = page.getByTestId("inquiry-sending").locator("svg").first();
  await expect(svg).toBeVisible();
  await expect.poll(() => svg.locator("[data-horse-pose]").count()).toBeGreaterThan(1);

  for (const restart of [false, true]) {
    if (restart) {
      await page.getByRole("button", { name: "Restart animation", exact: true }).click();
    }
    const state = await readPoseState(svg);
    expect(state.visible).toHaveLength(1);
    expect(state.animations.filter((animation) => animation.playState === "running")).toEqual([]);
  }
  expectNoDelivery();
});
