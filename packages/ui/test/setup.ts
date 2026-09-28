import "@testing-library/jest-dom/vitest";
import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import axe, { type AxeResults, type Result, type RunOptions } from "axe-core";

/**
 * jsdom implements only part of the browser API that Radix relies on. Without
 * these shims, components that measure or observe their own layout throw at
 * render time rather than failing a real assertion:
 *
 *   ResizeObserver        Slider, ScrollArea, Toast
 *   IntersectionObserver  anything that lazy-reveals on scroll
 *   matchMedia            reduced-motion and responsive checks
 *   Pointer capture       Select and Slider drag handling
 *   scrollIntoView        Select keyboard navigation
 */

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
}

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = MockObserver as unknown as typeof IntersectionObserver;
}

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// input-otp polls document.elementFromPoint on a timer to position its fake
// caret. jsdom has no layout, so the call is missing entirely, and because it
// fires after the test body finishes it surfaces as an unhandled rejection that
// fails the run even when every assertion passed.
if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

// Radix portals mount onto document.body; without an explicit cleanup, content
// from one test stays in the DOM and the next getByRole matches two nodes.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* ---------------------------------------------------------------- a11y ----
 * axe-core wrapper plus a `toHaveNoViolations` matcher, so any test can assert
 * a tree is clean. Two rules are off by design:
 *
 *   color-contrast   needs a layout engine and real computed colours; under
 *                    jsdom it can only ever report "incomplete", never a pass.
 *   region           requires every node to sit inside a landmark, which is a
 *                    page-level concern, not a component one.
 * -------------------------------------------------------------------------- */

const BASE_AXE_OPTIONS: RunOptions = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
  },
};

/**
 * Nodes excluded from every scan. Radix's focus trap brackets its content with
 * two `data-radix-focus-guard` spans that are both `aria-hidden` and
 * `tabindex="0"`, which axe reports as aria-hidden-focus. They are internal to
 * the primitive, invisible, and only reachable for the instant the trap uses to
 * bounce focus back — excluding them keeps the rule live for our own markup.
 */
const AXE_EXCLUDE = [["[data-radix-focus-guard]"]];

/** Runs axe over `element` (defaults to document.body, so portals are included). */
export async function runAxe(element?: Element, options: RunOptions = {}): Promise<AxeResults> {
  return axe.run(
    { include: [element ?? document.body], exclude: AXE_EXCLUDE },
    {
      ...BASE_AXE_OPTIONS,
      ...options,
      rules: { ...BASE_AXE_OPTIONS.rules, ...options.rules },
    },
  );
}

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => {
      const nodes = v.nodes
        .map((n) => `      ${n.html}\n        ${n.failureSummary?.replace(/\n/g, "\n        ")}`)
        .join("\n");
      return `  [${v.impact ?? "unknown"}] ${v.id}: ${v.help}\n    ${v.helpUrl}\n${nodes}`;
    })
    .join("\n\n");
}

expect.extend({
  toHaveNoViolations(received: AxeResults) {
    const violations = received?.violations ?? [];
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? "expected accessibility violations, found none"
          : `expected no accessibility violations, found ${violations.length}:\n\n${formatViolations(violations)}`,
    };
  },
});

// The type parameters must be spelled exactly as vitest declares them, or the
// merge fails with TS2428 ("all declarations must have identical type
// parameters") rather than adding the matcher.
declare module "vitest" {
  // T is unused here and has to be: the merge is rejected outright unless the
  // parameters are repeated exactly as vitest declares them.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> {
    toHaveNoViolations: () => R;
  }
}
