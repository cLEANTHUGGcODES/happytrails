import { expect, test, type Page, type Route } from "@playwright/test";

const deliveryFailure = {
  ok: false,
  message: "Your inquiry could not be sent right now. Please try again or email us directly.",
};
const deliverySuccess = {
  ok: true,
  message: "Your inquiry has been sent. We look forward to hearing more about your celebration.",
};

// Every inquiry is intercepted, including retries after a failed assertion.
// These browser checks must never send an actual email.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/inquiries", (route) =>
    route.fulfill({ status: 503, json: deliveryFailure }),
  );
});

async function fillInquiry(page: Page) {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Avery Example");
  await page.getByLabel("Email address").fill("avery@example.com");
  await page.getByLabel("What are you celebrating?").selectOption("Wedding");
  await page.getByLabel("A little about your plans").fill("We would love to visit the barn.");
}

async function freezeTimers(page: Page) {
  const now = new Date("2026-09-27T12:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(new Date(now.getTime() + 1_000));
  await page.clock.runFor(1_000);
}

async function holdDelivery(page: Page) {
  let resolveRequest!: (route: Route) => void;
  let requests = 0;
  const requested = new Promise<Route>((resolve) => {
    resolveRequest = resolve;
  });
  await page.route("**/api/inquiries", (route) => {
    requests += 1;
    resolveRequest(route);
  });
  return { requested, count: () => requests };
}

async function settleDelivery(page: Page, route: Route, ok = true) {
  const response = page.waitForResponse("**/api/inquiries");
  await route.fulfill({
    status: ok ? 200 : 503,
    json: ok ? deliverySuccess : deliveryFailure,
  });
  await (await response).finished();
}

async function expectSuccess(page: Page) {
  const heading = page.getByRole("heading", { name: "We’re glad you found us." });
  await expect(heading).toBeVisible();
  await expect(page.getByRole("status").filter({ has: heading })).toBeFocused();
  await expect(page.getByTestId("inquiry-sending")).toHaveCount(0);
}

for (const viewport of [
  { width: 1440, height: 1000, label: "desktop" },
  { width: 360, height: 800, label: "mobile" },
]) {
  test(`${viewport.label}: the illustrated pending state remains until delivery finishes`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const delivery = await holdDelivery(page);
    await fillInquiry(page);
    await freezeTimers(page);
    await page.getByRole("button", { name: "Send your inquiry" }).click();
    const route = await delivery.requested;
    const pending = page.getByTestId("inquiry-sending");

    await expect(pending).toBeVisible();
    await expect(pending).toHaveAttribute("role", "status");
    await expect(pending).toContainText("Sending your note…");
    await expect(pending.locator("svg").first()).toBeVisible();
    await expect(pending.locator("svg").first()).toHaveAttribute("aria-hidden", "true");
    await expect(page.getByLabel("Your name")).toBeDisabled();
    await expect(page.getByLabel("Email address")).toBeDisabled();
    await expect(page.getByLabel("What are you celebrating?")).toBeDisabled();
    await expect(page.getByLabel("A little about your plans")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Sending your note…" })).toBeDisabled();

    // A programmatic second submit also cannot bypass the in-flight guard.
    await page.getByRole("form", { name: "Celebration inquiry" }).dispatchEvent("submit");
    await page.clock.runFor(3_000);
    await expect(pending).toBeVisible();
    await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);
    expect(delivery.count()).toBe(1);

    const width = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(width.document).toBeLessThanOrEqual(width.viewport + 1);
    expect(width.body).toBeLessThanOrEqual(width.viewport + 1);
    await testInfo.attach(`inquiry-pending-${viewport.label}`, {
      body: await pending.screenshot(),
      contentType: "image/png",
    });

    await settleDelivery(page, route);
    // The illustration has already had time to play: a slow request adds no new wait.
    await expectSuccess(page);
  });
}

test("a fast successful response gives the illustration a short moment before focusing confirmation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const delivery = await holdDelivery(page);
  await fillInquiry(page);
  await freezeTimers(page);
  await page.getByRole("button", { name: "Send your inquiry" }).click();
  await settleDelivery(page, await delivery.requested);

  await page.clock.runFor(500);
  await expect(page.getByTestId("inquiry-sending")).toBeVisible();
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);
  await page.clock.runFor(1_500);
  await expectSuccess(page);
  expect(delivery.count()).toBe(1);
});

test("provider and network failures stop the pending state immediately and preserve the inquiry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await fillInquiry(page);
  await freezeTimers(page);

  for (const failure of ["provider", "network"] as const) {
    await test.step(failure, async () => {
      const delivery = await holdDelivery(page);
      await page.getByRole("button", { name: "Send your inquiry" }).click();
      const route = await delivery.requested;
      await expect(page.getByTestId("inquiry-sending")).toBeVisible();
      if (failure === "provider") await settleDelivery(page, route, false);
      else await route.abort("failed");

      // Browser time has not advanced: errors must not wait for decorative animation.
      const alert = page.getByRole("form", { name: "Celebration inquiry" }).getByRole("alert");
      await expect(alert).toContainText(
        failure === "provider" ? "could not be sent" : "couldn’t confirm",
      );
      await expect(alert).toBeFocused();
      await expect(page.getByTestId("inquiry-sending")).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);
      await expect(page.getByLabel("Your name")).toHaveValue("Avery Example");
      await expect(page.getByLabel("Email address")).toHaveValue("avery@example.com");
      await expect(page.getByLabel("What are you celebrating?")).toHaveValue("Wedding");
      await expect(page.getByLabel("A little about your plans")).toHaveValue(
        "We would love to visit the barn.",
      );
      await expect(page.getByRole("button", { name: "Send your inquiry" })).toBeEnabled();
      expect(delivery.count()).toBe(1);
    });
  }
});

test("a request that reaches the 30-second timeout restores the form without reporting success", async ({
  page,
}) => {
  const delivery = await holdDelivery(page);
  await fillInquiry(page);
  await freezeTimers(page);
  await page.getByRole("button", { name: "Send your inquiry" }).click();
  await delivery.requested;

  await page.clock.fastForward(29_000);
  await expect(page.getByTestId("inquiry-sending")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sending your note…" })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);

  await page.clock.fastForward(1_000);
  const alert = page.getByRole("form", { name: "Celebration inquiry" }).getByRole("alert");
  await expect(alert).toContainText("couldn’t confirm your inquiry was sent");
  await expect(alert).toBeFocused();
  await expect(page.getByTestId("inquiry-sending")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "We’re glad you found us." })).toHaveCount(0);
  await expect(page.getByLabel("Your name")).toHaveValue("Avery Example");
  await expect(page.getByLabel("Email address")).toHaveValue("avery@example.com");
  await expect(page.getByLabel("What are you celebrating?")).toHaveValue("Wedding");
  await expect(page.getByLabel("A little about your plans")).toHaveValue(
    "We would love to visit the barn.",
  );
  await expect(page.getByRole("button", { name: "Send your inquiry" })).toBeEnabled();
  expect(delivery.count()).toBe(1);
});

for (const reduceInitially of [true, false]) {
  const scenario = reduceInitially ? "at arrival" : "while awaiting confirmation";
  test(`reduced motion ${scenario} skips the decorative display delay`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: reduceInitially ? "reduce" : "no-preference" });
    const delivery = await holdDelivery(page);
    await fillInquiry(page);
    await freezeTimers(page);
    await page.getByRole("button", { name: "Send your inquiry" }).click();
    const route = await delivery.requested;
    const pending = page.getByTestId("inquiry-sending");
    await expect(pending).toBeVisible();

    if (reduceInitially) {
      const svg = pending.locator("svg").first();
      await expect(svg).toBeVisible();
      expect(await svg.evaluate((element) =>
        [element, ...element.querySelectorAll("*")]
          .map((node) => getComputedStyle(node).animationName)
          .filter((name) => name !== "none"),
      )).toEqual([]);
      expect(await svg.evaluate((element) =>
        element.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === "running").length,
      )).toBe(0);
    }

    await settleDelivery(page, route);
    if (!reduceInitially) {
      await expect(pending).toBeVisible();
      // Changing the OS preference must also end an already-started decorative wait.
      await page.emulateMedia({ reducedMotion: "reduce" });
    }
    // No timer advancement: delivery can be acknowledged as soon as it is confirmed.
    await expectSuccess(page);
    expect(delivery.count()).toBe(1);
  });
}
