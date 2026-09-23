import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

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

// Radix portals mount onto document.body; without an explicit cleanup, content
// from one test stays in the DOM and the next getByRole matches two nodes.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
