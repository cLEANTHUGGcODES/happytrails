import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slideshowName = "Happy Trails photo slideshow";
const danceDescription =
  "A bride and a man in a vest dancing on the checkered floor, with wedding guests nearby"; // Owner-requested IMG_6465.jpeg.
const bunkhouseDescription =
  "The Western-inspired bunkhouse and its covered porch, with two people seated outside";
const bridalSuiteDescription =
  "The grain-bin bridal suite with corrugated metal walls, vintage furnishings, and a decorative folding screen";

function modeButton(page: Page, name: "Grid" | "Slideshow") {
  return page
    .getByRole("group", { name: "Gallery view" })
    .getByRole("button", { name, exact: true });
}

function slideshow(page: Page) {
  return page.getByRole("region", { name: slideshowName });
}

function enlargeButton(page: Page) {
  return slideshow(page).getByRole("button", { name: /^Enlarge photograph:/ });
}

async function expectSettled(page: Page) {
  await expect(page.locator("[data-gallery-transition]")).toHaveCount(0);
}

async function expectSelected(page: Page, position: number, description?: string) {
  const selected = slideshow(page).getByRole("button", {
    name: new RegExp(`^Show photograph ${position}:`),
  });
  await expect(selected).toHaveAttribute("aria-current", "true");
  await expect(slideshow(page).locator('button[aria-current="true"]')).toHaveCount(1);
  if (description) {
    await expect(enlargeButton(page)).toHaveAccessibleName(`Enlarge photograph: ${description}`);
  }
}

async function expectNoOverflow(page: Page) {
  expect(
    await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.documentElement.clientWidth,
    })),
  ).toEqual({ document: 0, body: 0 });
}

async function touchGesture(stage: Locator, dx: number, dy: number) {
  await stage.dispatchEvent("pointerdown", {
    pointerType: "touch",
    pointerId: 1,
    isPrimary: true,
    clientX: 190,
    clientY: 250,
    button: 0,
  });
  await stage.dispatchEvent("pointermove", {
    pointerType: "touch",
    pointerId: 1,
    isPrimary: true,
    clientX: 190 + dx,
    clientY: 250 + dy,
    buttons: 1,
  });
  await stage.dispatchEvent("pointerup", {
    pointerType: "touch",
    pointerId: 1,
    isPrimary: true,
    clientX: 190 + dx,
    clientY: 250 + dy,
    button: 0,
  });
}

test("grid and slideshow preserve the requested dance photograph and restore focus", async ({
  page,
}) => {
  await page.goto("/gallery");
  const photographs = page.getByRole("button", { name: /^Open photograph:/ });
  await expect(photographs).toHaveCount(21);
  await expect(modeButton(page, "Grid")).toHaveAttribute("aria-pressed", "true");

  const dance = page.getByRole("button", { name: `Open photograph: ${danceDescription}` });
  await dance.click();
  await expect(modeButton(page, "Slideshow")).toHaveAttribute("aria-pressed", "true");
  await expect(slideshow(page)).toBeVisible();
  await expectSelected(page, 6, danceDescription);
  await expect(enlargeButton(page).locator("img")).toHaveAttribute("src", /wedding-dance-floor/);
  await expect(enlargeButton(page)).toBeFocused();
  await expectSettled(page);

  await modeButton(page, "Grid").click();
  await expect(photographs).toHaveCount(21);
  await expect(dance).toBeFocused();
  await expectSettled(page);
  await modeButton(page, "Slideshow").click();
  await expectSelected(page, 6, danceDescription);
  await enlargeButton(page).focus();
  await page.keyboard.press("Escape");
  await expect(modeButton(page, "Grid")).toHaveAttribute("aria-pressed", "true");
  await expect(dance).toBeFocused();
  await expectSettled(page);
});

test("slideshow controls and local keyboard navigation expose one selected photograph", async ({
  page,
}) => {
  await page.goto("/gallery");
  await modeButton(page, "Slideshow").click();
  await expectSelected(page, 1);
  await expect(slideshow(page).getByRole("button", { name: /^Show photograph \d+:/ })).toHaveCount(
    21,
  );
  await slideshow(page).getByRole("button", { name: "Next photograph", exact: true }).click();
  await expectSelected(page, 2);
  await slideshow(page).getByRole("button", { name: "Previous photograph", exact: true }).click();
  await expectSelected(page, 1);

  await slideshow(page)
    .getByRole("button", { name: /^Show photograph 6:/ })
    .click();
  await expectSelected(page, 6, danceDescription);
  await enlargeButton(page).focus();
  await page.keyboard.press("ArrowRight");
  await expectSelected(page, 7);
  await page.keyboard.press("ArrowLeft");
  await expectSelected(page, 6, danceDescription);
  await expectSettled(page);

  // Arrow keys elsewhere on the page must not silently change the collection.
  await modeButton(page, "Slideshow").focus();
  await page.keyboard.press("ArrowRight");
  await expectSelected(page, 6, danceDescription);

  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze();
  expect(
    accessibility.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map(({ target }) => target),
    })),
  ).toEqual([]);
});

test("changing to a shorter collection keeps slideshow mode and a valid selection", async ({
  page,
}) => {
  await page.goto("/gallery");
  await page
    .getByRole("button", { name: /^Open photograph:/ })
    .last()
    .click();
  await expectSelected(
    page,
    21,
    "An aerial view of the gravel parking area beside the barn and grain-bin suite",
  );
  await page.getByRole("button", { name: "Getting Ready", exact: true }).click();
  await expect(modeButton(page, "Slideshow")).toHaveAttribute("aria-pressed", "true");
  await expect(slideshow(page).getByRole("button", { name: /^Show photograph \d+:/ })).toHaveCount(
    2,
  );
  await expectSelected(page, 1, bunkhouseDescription);
  await slideshow(page).getByRole("button", { name: "Next photograph", exact: true }).click();
  await expectSelected(page, 2, bridalSuiteDescription);
  await page.getByRole("button", { name: "All photos", exact: true }).click();
  await expectSelected(page, 11, bridalSuiteDescription);
  await modeButton(page, "Grid").click();
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(21);
  await expect(
    page.getByRole("button", {
      name: `Open photograph: ${bridalSuiteDescription}`,
    }),
  ).toBeFocused();
  await expectSettled(page);
});

test("phone slideshow accepts horizontal swipes and leaves vertical page scrolling available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/gallery");
  await page
    .getByRole("button", { name: /^Open photograph:/ })
    .first()
    .click();
  await expectSelected(page, 1);
  await expectSettled(page);
  const stage = page.locator("[data-gallery-stage]");
  await touchGesture(stage, -120, 5);
  await expectSelected(page, 2);
  await touchGesture(stage, 120, 5);
  await expectSelected(page, 1);
  await touchGesture(stage, -15, -150);
  await expectSelected(page, 1);
  await expectNoOverflow(page);

  expect(
    await page.evaluate(() => [
      getComputedStyle(document.documentElement).overflowY,
      getComputedStyle(document.body).overflowY,
    ]),
  ).not.toContain("hidden");
  await page.locator("#property-tour").scrollIntoViewIfNeeded();
  await expect(page.locator("#property-tour")).toBeInViewport();
  await expect(modeButton(page, "Slideshow")).toHaveAttribute("aria-pressed", "true");
  await expectSelected(page, 1);
  await expectSettled(page);
});

test("reduced motion skips gallery transitions at load and clears an animation when changed live", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery");
  await page.getByRole("button", { name: `Open photograph: ${danceDescription}` }).click();
  await expectSelected(page, 6, danceDescription);
  expect(await page.locator("[data-gallery-transition]").count()).toBe(0);
  await modeButton(page, "Grid").click();
  expect(await page.locator("[data-gallery-transition]").count()).toBe(0);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: `Open photograph: ${danceDescription}` }).click();
  await expect(slideshow(page)).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectSettled(page);
  await expectSelected(page, 6, danceDescription);
  await slideshow(page).getByRole("button", { name: "Next photograph", exact: true }).click();
  await expectSelected(page, 7);
  await expectSettled(page);
  await modeButton(page, "Grid").click();
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(21);
  await expectSettled(page);
});

test("rapid view changes, resize, and browser history leave an operable gallery", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/gallery");
  await page.getByRole("button", { name: `Open photograph: ${danceDescription}` }).click();
  for (let attempt = 0; attempt < 3; attempt++) {
    await modeButton(page, "Grid").click();
    await modeButton(page, "Slideshow").click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expectSettled(page);
  await expectSelected(page, 6, danceDescription);
  await expectNoOverflow(page);
  await modeButton(page, "Grid").click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expectSettled(page);
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(21);

  await page.getByRole("link", { name: "Let’s Plan a Visit", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expectSettled(page);
  await page.goBack();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.getByRole("button", { name: /^Open photograph:/ })).toHaveCount(21);
  await modeButton(page, "Slideshow").click();
  await expect(slideshow(page)).toBeVisible();
  await expect(enlargeButton(page)).toBeVisible();
  await expectSettled(page);
  expect(errors).toEqual([]);
});

test("scrolling during a grid-to-slideshow transition restores the real photograph immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gallery");
  await page.evaluate(() => document.fonts.ready);
  const dance = page.getByRole("button", { name: `Open photograph: ${danceDescription}` });
  await expect(dance).toBeEnabled();
  await dance.scrollIntoViewIfNeeded();
  await dance.locator("img").evaluate((image: HTMLImageElement) => image.decode());
  await expect(dance).toBeInViewport();

  // Keep the click, animation-start evidence, and scroll in one browser task.
  // Waiting for ordinary Playwright assertions between them could let the
  // transition finish and accidentally pass without exercising interruption.
  const transition = await dance.evaluate(async (button: HTMLButtonElement) => {
    button.click();
    const image = button.querySelector("img")!;
    const started = Boolean(document.querySelector("[data-gallery-transition]"));
    const initialVisibility = getComputedStyle(image).visibility;
    const initialScroll = window.scrollY;
    window.scrollBy({ top: 120, behavior: "instant" });

    // Native scroll events run before animation-frame callbacks. Allow the next
    // two frames for cleanup, rather than waiting for the animation's duration.
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    return {
      started,
      initialVisibility,
      scrolled: window.scrollY !== initialScroll,
      layerRemains: Boolean(document.querySelector("[data-gallery-transition]")),
      finalVisibility: getComputedStyle(image).visibility,
    };
  });

  expect(transition).toEqual({
    started: true,
    initialVisibility: "hidden",
    scrolled: true,
    layerRemains: false,
    finalVisibility: "visible",
  });
  await expectSelected(page, 6, danceDescription);
  await expect(enlargeButton(page)).toBeVisible();
});
