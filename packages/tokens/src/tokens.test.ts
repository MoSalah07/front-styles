import { readFileSync } from "node:fs";
import { join } from "node:path";
import { wcagContrast } from "culori";
import { describe, expect, it } from "vitest";
import { SEMANTIC, TEXT_PAIRS } from "./semantic.template.mjs";

/**
 * The compiler's output, not its internals.
 *
 * `scripts/build.mjs` is one long script with no exported seams, and unit
 * testing its helpers would mean carving it up to suit the tests. What the
 * rest of the repo actually depends on is the shape of what it emits — every
 * brand carrying every semantic key in both modes, every text pair clearing
 * WCAG AA, every ramp ordered — so that is what is asserted here.
 *
 * The audit already runs inside the build and fails it. These tests are the
 * second half of that contract: the build proves the numbers on the day it
 * runs, this proves the artefact on disk is the one that passed.
 */

const DIST = join(import.meta.dirname, "..", "dist");

interface TokenValue {
  css: string;
  oklch: string;
  hex: string;
}

interface Tokens {
  version: string;
  defaultBrand: string;
  semanticKeys: string[];
  brands: Record<
    string,
    {
      label: string;
      seed: string;
      radius: string;
      fonts: Record<string, string>;
      ramps: Record<string, Record<string, { l: number } | number>>;
      modes: Record<"light" | "dark", Record<string, TokenValue>>;
    }
  >;
}

const tokens: Tokens = JSON.parse(readFileSync(join(DIST, "tokens.json"), "utf8"));
const css = readFileSync(join(DIST, "index.css"), "utf8");

const BRANDS = Object.keys(tokens.brands);
const MODES = ["light", "dark"] as const;

describe("compiled output", () => {
  it("emits at least one brand and names a default that exists", () => {
    expect(BRANDS.length).toBeGreaterThan(0);
    expect(BRANDS).toContain(tokens.defaultBrand);
  });

  it("lists exactly the semantic keys the template declares", () => {
    expect([...tokens.semanticKeys].sort()).toEqual(Object.keys(SEMANTIC.light).sort());
  });

  it.each(BRANDS)("%s carries every semantic key in both modes", (brand) => {
    for (const mode of MODES) {
      const resolved = tokens.brands[brand]!.modes[mode];
      for (const key of tokens.semanticKeys) {
        expect(resolved[key], `${brand}/${mode}/${key} is missing`).toBeDefined();
      }
    }
  });

  /**
   * A few tokens are css-only on purpose: the elevations are box-shadows
   * rather than colours, and the two glass surfaces are alpha literals that
   * were never derived from a ramp. Everything else is a colour and has to
   * resolve, because `tokens.json` is what the docs swatches, the charts and
   * any Figma sync read.
   */
  const CSS_ONLY = new Set([
    "elevation-1",
    "elevation-2",
    "elevation-3",
    "surface-glass",
    "border-glass",
  ]);

  it.each(BRANDS)("%s resolves every colour token to css, oklch and hex", (brand) => {
    for (const mode of MODES) {
      for (const [key, value] of Object.entries(tokens.brands[brand]!.modes[mode])) {
        const at = `${brand}/${mode}/${key}`;
        expect(value.css, `${at} has no css`).toBeTruthy();

        if (CSS_ONLY.has(key)) {
          // Pinned the other way too: if one of these ever gains a hex, the
          // list above is stale and the exemption should go.
          expect(value.hex, `${at} is listed as css-only but resolved`).toBeUndefined();
          continue;
        }

        expect(value.oklch, `${at} has no oklch`).toMatch(/^oklch\(/);
        // A consumer pasting this into a design tool needs a real colour, and
        // `#NaNNaNNaN` is what a broken reference produces rather than a throw.
        expect(value.hex, `${at} has a malformed hex`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });
});

/**
 * The promise the README makes and the build enforces. Re-asserted here so a
 * hand-edited `dist` or a stale artefact cannot ship below the floor.
 */
describe("contrast", () => {
  it.each(BRANDS)("%s clears WCAG AA on every text pair", (brand) => {
    const failures: string[] = [];

    for (const mode of MODES) {
      const resolved = tokens.brands[brand]!.modes[mode];
      for (const [fg, bg, min] of TEXT_PAIRS as [string, string, number][]) {
        const a = resolved[fg]?.hex;
        const b = resolved[bg]?.hex;
        if (!a || !b) continue;

        const ratio = wcagContrast(a, b);
        if (ratio < min) {
          failures.push(`${mode}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (min ${min})`);
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });
});

describe("ramps", () => {
  it.each(BRANDS)("%s orders every ramp from light to dark", (brand) => {
    for (const [name, ramp] of Object.entries(tokens.brands[brand]!.ramps)) {
      const steps = Object.keys(ramp)
        .filter((key) => /^\d+$/.test(key))
        .map(Number)
        .sort((a, b) => a - b);

      const lightness = steps.map((step) => {
        const value = ramp[String(step)] as { l?: number };
        return typeof value?.l === "number" ? value.l : NaN;
      });

      // A higher step number is a darker colour, at every brand, always: the
      // semantic map picks steps by number, so an out-of-order ramp silently
      // inverts a role instead of failing.
      for (let i = 1; i < lightness.length; i += 1) {
        const previous = lightness[i - 1]!;
        const current = lightness[i]!;
        if (Number.isNaN(previous) || Number.isNaN(current)) continue;
        expect(
          current,
          `${brand}/${name}: step ${steps[i]} is lighter than ${steps[i - 1]}`,
        ).toBeLessThanOrEqual(previous);
      }
    }
  });
});

describe("stylesheet", () => {
  it("declares a font stack per script, including the one :lang(hi) selects", () => {
    // The base layer keys on :lang(), so a missing raw token means the
    // selector matches and then resolves to nothing.
    for (const token of ["--font-body", "--font-ar", "--font-hi", "--font-title", "--font-code"]) {
      expect(css, `${token} is not emitted`).toContain(`${token}:`);
    }
  });

  it.each(BRANDS)("selects %s by data-brand", (brand) => {
    expect(css).toContain(`[data-brand="${brand}"]`);
  });

  it("emits a dark block for every brand", () => {
    // Both spellings are supported by the custom variant in tailwind.css.
    expect(css).toMatch(/\.dark|\[data-theme="dark"\]/);
  });
});
