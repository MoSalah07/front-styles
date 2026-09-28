import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression for the docs site.
 *
 * The site is the only place every component is rendered together, in every
 * theme, brand, language and density, so it is what gets photographed rather
 * than a separate story file. That also means these snapshots fail when a
 * *token* changes, not only when a component does — which is the point: the
 * token layer is the part with no unit tests.
 *
 * One browser. A screenshot diff catches layout and colour regressions, and
 * running the same diff in three engines mostly catches font rasterisation.
 */
const PORT = Number(process.env.VRT_PORT ?? 4321);
const BASE_URL = process.env.VRT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",

  // A visual diff that only fails on CI is a visual diff nobody fixes, so the
  // tolerance is the same in both places.
  expect: {
    toHaveScreenshot: {
      // Antialiasing differs between machines; a whole-page shot has enough
      // pixels that a handful of them moving is noise rather than a change.
      maxDiffPixelRatio: 0.01,
      animations: "disabled",
      caret: "hide",
    },
  },

  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: BASE_URL,
    // A fixed viewport, because the snapshots are of layout.
    viewport: { width: 1280, height: 900 },
    // Device pixel ratio 1 keeps the files small and the diffs readable.
    deviceScaleFactor: 1,
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  /**
   * Serves the already-built site. `reuseExistingServer` means a developer who
   * is already running `pnpm --filter docs start` does not get a second one.
   */
  webServer: process.env.VRT_BASE_URL
    ? undefined
    : {
        command: `pnpm --filter docs start --port ${PORT}`,
        url: BASE_URL,
        cwd: "../..",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
