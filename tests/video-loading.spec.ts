import { expect, test } from "@playwright/test";

test.describe("Property tour image loading", () => {
  for (const width of [390, 1024, 1440]) {
    test(`uses one responsive preview per tour at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/gallery", "/tour"]) {
        await page.goto(path);
        const previews = page.locator('button img[alt="A preview of the Happy Trails property tour"]');
        for (const preview of await previews.all()) {
          await preview.scrollIntoViewIfNeeded();
          await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
          const size = await preview.evaluate((image: HTMLImageElement) => {
            let sourceSize = "";
            for (const candidate of image.sizes.split(",")) {
              const conditional = candidate.trim().match(/^\(([^)]+)\)\s+(.+)$/);
              if (!conditional || window.matchMedia(`(${conditional[1]})`).matches) {
                sourceSize = conditional?.[2] ?? candidate.trim();
                break;
              }
            }
            const probe = document.createElement("div");
            probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;height:0;padding:0;border:0;";
            probe.style.width = sourceSize;
            document.body.append(probe);
            const hintedWidth = probe.getBoundingClientRect().width;
            probe.remove();
            return {
              selectedWidth: Number(new URL(image.currentSrc).searchParams.get("w")),
              displayedWidth: image.getBoundingClientRect().width,
              hintedWidth,
              largestSharedWidth: Math.max(...Array.from(document.images)
                .filter((other) => other.currentSrc === image.currentSrc)
                .map((other) => other.getBoundingClientRect().width)),
            };
          });
          // Check the advertised layout independently of browser cache choices.
          expect(Math.abs(size.hintedWidth - size.displayedWidth)).toBeLessThan(2);
          expect(size.selectedWidth).toBeGreaterThanOrEqual(Math.floor(size.displayedWidth));
          // On a 1x display the old 90vw hint fetched 1920px for a 709px image.
          // Allow normal candidate rounding without fetching a full-width image
          // for a small column. Mobile has a wider gap between Next candidates.
          // The smaller /tour preview can reuse the larger preview's already
          // downloaded candidate. Bound that shared resource by the largest
          // actual image using it, while every image's sizes hint stays accurate.
          expect(size.selectedWidth).toBeLessThanOrEqual(size.largestSharedWidth * (width > 760 ? 1.5 : 2));
        }
        const nativePosterRequests = await page.evaluate(() => performance.getEntriesByType("resource")
          .filter((entry) => entry instanceof PerformanceResourceTiming && entry.initiatorType === "video" && entry.name.includes("tour-poster"))
          .map((entry) => entry.name));
        expect(nativePosterRequests).toEqual([]);
        await expect(page.locator("video[poster]")).toHaveCount(0);
      }
    });
  }

  test("keeps the selected preview and native controls through play, pause, and end", async ({ page }) => {
    await page.goto("/tour");
    const section = page.locator("#short-tour");
    const play = section.getByRole("button", { name: "Take a little look around: play the Happy Trails property tour" });
    await play.scrollIntoViewIfNeeded();
    const preview = play.locator("img");
    await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const previewUrl = await preview.evaluate((image: HTMLImageElement) => image.currentSrc);
    await play.click();
    const video = section.locator("video");
    await expect(video).toHaveAttribute("poster", previewUrl);
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("aria-hidden", "false");
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
    await video.evaluate((element: HTMLVideoElement) => element.pause());
    await expect(video).toHaveAttribute("controls", "");
    await expect(play).toHaveCount(0);
    await video.evaluate(async (element: HTMLVideoElement) => {
      element.currentTime = element.duration - 0.1;
      await element.play();
    });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.ended)).toBe(true);
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("poster", previewUrl);
    await expect(play).toHaveCount(0);
  });
});

test.describe("Property tour without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("retains the rendered preview, direct video links, and crawler source", async ({ page }) => {
    const response = await page.goto("/tour");
    const html = await response!.text();
    expect(html).toContain('src="/videos/full-property-tour.mp4"');
    expect(html).toContain('src="/videos/property-tour.mp4"');
    expect(html).toContain('"thumbnailUrl":"https://www.happytrailsshindigs.com/images/tour-poster.webp"');
    for (const preview of await page.locator('button img[alt="A preview of the Happy Trails property tour"]').all()) {
      await preview.scrollIntoViewIfNeeded();
      await expect(preview).toBeVisible();
      await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    await expect(page.getByRole("link", { name: "Open the full video" })).toHaveAttribute("href", "/videos/full-property-tour.mp4");
    await expect(page.getByRole("link", { name: "Open the short video" })).toHaveAttribute("href", "/videos/property-tour.mp4");
  });
});
