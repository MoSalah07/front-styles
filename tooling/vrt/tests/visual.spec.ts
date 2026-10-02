import { expect, test, type Page } from "@playwright/test";

/**
 * Whole-page screenshots of the docs site.
 *
 * What these are for, and what they are not: a unit test asserts that a
 * component renders and that its accessible name is right, which is what
 * `packages/ui` already does. Neither of those notices that a token change
 * dropped the contrast of every muted label, or that an RTL mirror broke one
 * component's padding. That is what a pixel diff is good at, so these cover
 * the axes the unit tests cannot — theme, brand, language and density — rather
 * than re-photographing every component in one state.
 */

/**
 * Theme, brand and density live on `<html>` and are read from localStorage by
 * a pre-paint script, so they are set before the first navigation rather than
 * clicked afterwards. Clicking would photograph the transition.
 */
async function preset(
  page: Page,
  options: { theme?: string; brand?: string; density?: string } = {},
) {
  await page.addInitScript((opts) => {
    const set = (key: string, value?: string) => {
      if (value) window.localStorage.setItem(key, value);
    };
    set("design-eg:theme", opts.theme);
    set("design-eg:brand", opts.brand);
    set("design-eg:density", opts.density);
  }, options);
}

/** Waits for fonts and lazy images, so a shot is never of a half-painted page. */
async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // The marquee and the skeleton shimmer never stop on their own.
  await page.emulateMedia({ reducedMotion: "reduce" });
}

test.describe("home page", () => {
  for (const theme of ["dark", "light"]) {
    test(`renders in ${theme}`, async ({ page }) => {
      await preset(page, { theme });
      await page.goto("/en");
      await settle(page);
      await expect(page).toHaveScreenshot(`home-en-${theme}.png`, { fullPage: true });
    });
  }

  /**
   * The four languages are the real regression surface of this release: each
   * one changes the font stack, and Arabic changes the direction of every
   * logical property in the library at once.
   */
  for (const locale of ["en", "ar", "fr", "hi"]) {
    test(`renders in ${locale}`, async ({ page }) => {
      await preset(page, { theme: "dark" });
      await page.goto(`/${locale}`);
      await settle(page);
      await expect(page).toHaveScreenshot(`home-${locale}.png`, { fullPage: true });
    });
  }
});

test.describe("component page", () => {
  // One primitive, one block, one whole-page template: enough shapes that a
  // layout regression in any tier shows up.
  for (const item of ["button", "data-table", "login-split"]) {
    for (const locale of ["en", "ar"]) {
      test(`${item} in ${locale}`, async ({ page }) => {
        await preset(page, { theme: "dark" });
        await page.goto(`/${locale}/docs/${item}`);
        await settle(page);
        await expect(page).toHaveScreenshot(`docs-${item}-${locale}.png`, { fullPage: true });
      });
    }
  }
});

test.describe("token layer", () => {
  /**
   * Every brand through the same page. A change to the compiler that shifts a
   * ramp shows up here and nowhere else, since the contrast audit only proves
   * the pairs pass, not that they still look like the brand.
   */
  for (const brand of [
    "crimson",
    "ocean",
    "ember",
    "forest",
    "slate",
    "iris",
    "violet",
    "jade",
    "coral",
    "neutral",
  ]) {
    test(`swatches in ${brand}`, async ({ page }) => {
      await preset(page, { theme: "dark", brand });
      await page.goto("/en#tokens");
      await settle(page);
      const swatches = page.locator("#tokens");
      await expect(swatches).toHaveScreenshot(`tokens-${brand}.png`);
    });
  }

  for (const density of ["compact", "comfortable", "spacious"]) {
    test(`controls at ${density} density`, async ({ page }) => {
      await preset(page, { theme: "dark", density });
      await page.goto("/en#input");
      await settle(page);
      await expect(page.locator("#input")).toHaveScreenshot(`density-${density}.png`);
    });
  }
});
