#!/usr/bin/env node
/**
 * design-eg token compiler
 *
 *   brands/*.brand.json  ──►  dist/index.css     (primitives + semantic, all brands, light + dark)
 *                              dist/tailwind.css  (Tailwind v4 @theme bridge)
 *                              dist/tokens.json   (resolved values for docs, charts, Figma sync)
 *                              dist/index.js/.d.ts
 *
 * Usage:  node scripts/build.mjs [--watch]
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, watch } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { converter, parse, formatHex, clampChroma, wcagContrast } from "culori";
import { SEMANTIC, TEXT_PAIRS } from "../src/semantic.template.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const brandsDir = join(root, "brands");
const srcDir = join(root, "src");
const distDir = join(root, "dist");

const toOklch = converter("oklch");
const toRgb = converter("rgb");

/* ────────────────────────────── scales ────────────────────────────── */

const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMP_L = {
  50: 0.975,
  100: 0.94,
  200: 0.885,
  300: 0.81,
  400: 0.72,
  500: 0.63,
  600: 0.55,
  700: 0.47,
  800: 0.39,
  900: 0.31,
  950: 0.23,
};
const NEUTRAL_STEPS = [
  0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000,
];
const NEUTRAL_L = {
  0: 1,
  50: 0.985,
  100: 0.965,
  200: 0.93,
  300: 0.87,
  400: 0.78,
  500: 0.66,
  600: 0.56,
  700: 0.45,
  800: 0.36,
  850: 0.31,
  900: 0.26,
  925: 0.23,
  950: 0.2,
  975: 0.16,
  1000: 0,
};
const RAMP_NAMES = ["brand", "success", "warning", "danger", "info"];
const DEFAULT_STATUS = {
  success: "#12B76A",
  warning: "#F79009",
  danger: "#D92D20",
  info: "#2E90FA",
};

/* ────────────────────────────── colour helpers ────────────────────────────── */

const round = (n, d) => Number(n.toFixed(d));

function oklchOf(hex) {
  const c = toOklch(parse(hex));
  if (!c) throw new Error(`Invalid colour: ${hex}`);
  return { mode: "oklch", l: c.l, c: c.c ?? 0, h: c.h ?? 0 };
}

function inGamut(color) {
  return clampChroma({ ...color, mode: "oklch" }, "oklch");
}

function cssOf(color, alpha) {
  const l = round(color.l, 4);
  const c = round(color.c, 4);
  const h = round(color.h ?? 0, 2);
  return alpha == null ? `oklch(${l} ${c} ${h})` : `oklch(${l} ${c} ${h} / ${alpha})`;
}

function hexOf(color) {
  return formatHex(toRgb(color));
}

/** Build an 11-step ramp around a seed. The seed is placed verbatim at its nearest step. */
function buildRamp(seedHex) {
  const seed = oklchOf(seedHex);
  const seedStep = RAMP_STEPS.reduce((a, b) =>
    Math.abs(RAMP_L[b] - seed.l) < Math.abs(RAMP_L[a] - seed.l) ? b : a,
  );
  const steps = {};
  for (const s of RAMP_STEPS) {
    if (s === seedStep) {
      steps[s] = seed;
      continue;
    }
    const l = RAMP_L[s];
    const dist = Math.abs(l - seed.l);
    // chroma falls off toward both ends of the ramp but never fully desaturates
    const c = Math.max(seed.c * (1 - dist * 1.35), seed.c * 0.12);
    steps[s] = inGamut({ mode: "oklch", l, c, h: seed.h });
  }
  return { steps, seedStep, order: RAMP_STEPS };
}

/** Grey ramp: near-zero chroma with the brand hue, plus optional exact anchors. */
function buildNeutral(seedHex, { tint = 0, anchors = {} } = {}) {
  const seed = oklchOf(seedHex);
  const steps = {};
  for (const s of NEUTRAL_STEPS) {
    const anchor = anchors[String(s)];
    steps[s] = anchor
      ? oklchOf(anchor)
      : inGamut({ mode: "oklch", l: NEUTRAL_L[s], c: tint, h: seed.h });
  }
  return { steps, seedStep: 950, order: NEUTRAL_STEPS };
}

/* ────────────────────────────── ref resolver ────────────────────────────── */

const REF_RE = /\{([a-z]+:)?([a-z]+)(?:\.([+-]?\d+))?(?:\s*@\s*([0-9.]+))?\}/g;

/**
 * Resolve one `{...}` reference against a brand's ramps.
 * Returns { css, color, alpha } where css is a var() reference (so consumers can
 * re-theme a ramp step and every semantic token follows) and color is the
 * concrete OKLCH value used for contrast checks and tokens.json.
 */
function resolveRef(ramps, fn, name, stepExpr, alpha) {
  const ramp = ramps[name];
  if (!ramp) throw new Error(`Unknown ramp "${name}"`);
  let step;
  if (stepExpr == null) step = ramp.seedStep;
  else if (/^[+-]/.test(stepExpr)) {
    const i = ramp.order.indexOf(ramp.seedStep) + Number(stepExpr);
    step = ramp.order[Math.min(ramp.order.length - 1, Math.max(0, i))];
  } else step = Number(stepExpr);
  const color = ramp.steps[step];
  if (!color) throw new Error(`Ramp "${name}" has no step ${step}`);

  if (fn === "on:") {
    const white = ramps.neutral.steps[0];
    const black = ramps.neutral.steps[1000];
    const useWhite = wcagContrast(white, color) >= wcagContrast(black, color);
    return {
      css: useWhite ? "var(--neutral-0)" : "var(--neutral-1000)",
      color: useWhite ? white : black,
    };
  }
  const varRef = `var(--${name}-${step})`;
  if (alpha != null) {
    return {
      css: `oklch(from ${varRef} l c h / ${Math.round(Number(alpha) * 100)}%)`,
      color: { ...color, alpha: Number(alpha) },
    };
  }
  return { css: varRef, color };
}

function resolveValue(ramps, value) {
  const single = new RegExp(`^${REF_RE.source}$`).exec(value);
  if (single) {
    const [, fn, name, step, alpha] = single;
    return resolveRef(ramps, fn, name, step, alpha);
  }
  const css = value.replace(
    REF_RE,
    (_m, fn, name, step, alpha) => resolveRef(ramps, fn, name, step, alpha).css,
  );
  return { css, color: null };
}

/* ────────────────────────────── brand compilation ────────────────────────────── */

function loadBrands() {
  return readdirSync(brandsDir)
    .filter((f) => f.endsWith(".brand.json"))
    .map((f) => JSON.parse(readFileSync(join(brandsDir, f), "utf8")))
    .sort(
      (a, b) =>
        Number(Boolean(b.default)) - Number(Boolean(a.default)) || a.name.localeCompare(b.name),
    );
}

function compileBrand(brand) {
  const status = { ...DEFAULT_STATUS, ...(brand.status ?? {}) };
  const ramps = {
    brand: buildRamp(brand.seed),
    success: buildRamp(status.success),
    warning: buildRamp(status.warning),
    danger: buildRamp(status.danger),
    info: buildRamp(status.info),
    neutral: buildNeutral(brand.seed, brand.neutral ?? {}),
  };

  const modes = {};
  for (const mode of ["light", "dark"]) {
    const map = { ...SEMANTIC[mode], ...(brand.overrides?.[mode] ?? {}) };
    const out = {};
    for (const [key, value] of Object.entries(map)) {
      const r = resolveValue(ramps, value);
      out[key] = {
        css: r.css,
        ...(r.color ? { oklch: cssOf(r.color, r.color.alpha), hex: hexOf(r.color) } : {}),
      };
    }
    modes[mode] = out;
  }

  return { brand, ramps, modes };
}

/* ────────────────────────────── contrast audit ────────────────────────────── */

function audit(compiled) {
  const problems = [];
  const rows = [];
  for (const mode of ["light", "dark"]) {
    const m = compiled.modes[mode];
    for (const [fg, bg, min] of TEXT_PAIRS) {
      const a = m[fg]?.hex;
      const b = m[bg]?.hex;
      if (!a || !b) continue;
      const ratio = wcagContrast(a, b);
      const ok = ratio >= min;
      rows.push({ mode, fg, bg, ratio: round(ratio, 2), min, ok });
      if (!ok)
        problems.push(
          `${compiled.brand.name}/${mode}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (min ${min})`,
        );
    }
  }
  return { rows, problems };
}

/* ────────────────────────────── CSS emit ────────────────────────────── */

const q = (s) => `"${s}"`;

function identityBlock({ brand, ramps }) {
  const lines = [];
  lines.push(`  --radius: ${brand.radius ?? "0.5rem"};`);
  for (const [k, v] of Object.entries(brand.fonts ?? {})) lines.push(`  --font-${k}: ${v};`);
  for (const name of [...RAMP_NAMES, "neutral"]) {
    const ramp = ramps[name];
    for (const step of ramp.order) {
      const c = ramp.steps[step];
      lines.push(`  --${name}-${step}: ${cssOf(c)}; /* ${hexOf(c)} */`);
    }
  }
  return lines.join("\n");
}

function semanticBlock(modeTokens) {
  return Object.entries(modeTokens)
    .map(([k, v]) => `  --${k}: ${v.css};${v.hex ? ` /* ${v.hex} */` : ""}`)
    .join("\n");
}

function selectors(brandName, isDefault, mode) {
  const b = `[data-brand=${q(brandName)}]`;
  if (mode === "light") {
    return isDefault
      ? [
          ":root",
          ".light",
          `[data-theme=${q("light")}]`,
          b,
          `${b} .light`,
          `${b} [data-theme=${q("light")}]`,
        ]
      : [b, `${b} .light`, `${b} [data-theme=${q("light")}]`];
  }
  const dark = isDefault ? [".dark", `[data-theme=${q("dark")}]`] : [];
  return [
    ...dark,
    `.dark${b}`,
    `[data-theme=${q("dark")}]${b}`,
    `.dark ${b}`,
    `[data-theme=${q("dark")}] ${b}`,
    `${b} .dark`,
    `${b} [data-theme=${q("dark")}]`,
  ];
}

function emitCss(compiledBrands) {
  const parts = [];
  parts.push(`/* design-eg tokens · generated by @design-eg/tokens · do not edit by hand */`);
  parts.push(readFileSync(join(srcDir, "static.css"), "utf8").trim());

  for (const cb of compiledBrands) {
    const isDefault = Boolean(cb.brand.default);
    const name = cb.brand.name;
    parts.push(
      `\n/* ═══ brand: ${name}${isDefault ? " (default)" : ""} · seed ${cb.brand.seed} ═══ */`,
    );
    parts.push(`${isDefault ? ":root, " : ""}[data-brand=${q(name)}] {\n${identityBlock(cb)}\n}`);
    parts.push(
      `${selectors(name, isDefault, "light").join(",\n")} {\n  color-scheme: light;\n${semanticBlock(cb.modes.light)}\n}`,
    );
    parts.push(
      `${selectors(name, isDefault, "dark").join(",\n")} {\n  color-scheme: dark;\n${semanticBlock(cb.modes.dark)}\n}`,
    );
  }
  return parts.join("\n\n") + "\n";
}

/* ────────────────────────────── JS / JSON emit ────────────────────────────── */

function emitJson(compiledBrands) {
  const brands = {};
  for (const cb of compiledBrands) {
    const ramps = {};
    for (const name of [...RAMP_NAMES, "neutral"]) {
      ramps[name] = Object.fromEntries(
        cb.ramps[name].order.map((s) => [
          s,
          { oklch: cssOf(cb.ramps[name].steps[s]), hex: hexOf(cb.ramps[name].steps[s]) },
        ]),
      );
      ramps[name].seedStep = cb.ramps[name].seedStep;
    }
    brands[cb.brand.name] = {
      name: cb.brand.name,
      label: cb.brand.label ?? cb.brand.name,
      default: Boolean(cb.brand.default),
      description: cb.brand.description ?? "",
      seed: cb.brand.seed,
      radius: cb.brand.radius ?? "0.5rem",
      fonts: cb.brand.fonts ?? {},
      ramps,
      modes: cb.modes,
    };
  }
  return {
    $schema: "https://design-eg.dev/schema/tokens.json",
    version: JSON.parse(readFileSync(join(root, "package.json"), "utf8")).version,
    defaultBrand:
      compiledBrands.find((b) => b.brand.default)?.brand.name ?? compiledBrands[0].brand.name,
    semanticKeys: Object.keys(SEMANTIC.light),
    brands,
  };
}

function emitJs(json) {
  const js = `// generated by @design-eg/tokens
export const tokens = ${JSON.stringify(json, null, 2)};
export const brands = ${JSON.stringify(Object.keys(json.brands))};
export const defaultBrand = ${JSON.stringify(json.defaultBrand)};
export const semanticKeys = ${JSON.stringify(json.semanticKeys)};
export default tokens;
`;
  const dts = `// generated by @design-eg/tokens
export type BrandName = ${Object.keys(json.brands)
    .map((b) => JSON.stringify(b))
    .join(" | ")};
export type Mode = "light" | "dark";
export type SemanticKey = ${json.semanticKeys.map((k) => JSON.stringify(k)).join(" | ")};
export type RampName = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

export interface ColorValue {
  /** CSS value as emitted, usually a var() reference */
  css: string;
  /** Concrete OKLCH colour (absent for composite values such as shadows) */
  oklch?: string;
  /** Concrete sRGB hex (absent for composite values such as shadows) */
  hex?: string;
}
export interface RampStep {
  oklch: string;
  hex: string;
}
export interface Brand {
  name: BrandName;
  label: string;
  default: boolean;
  description: string;
  seed: string;
  radius: string;
  fonts: Record<string, string>;
  ramps: Record<RampName, Record<string, RampStep> & { seedStep: number }>;
  modes: Record<Mode, Record<SemanticKey, ColorValue>>;
}
export interface Tokens {
  $schema: string;
  version: string;
  defaultBrand: BrandName;
  semanticKeys: SemanticKey[];
  brands: Record<BrandName, Brand>;
}

export declare const tokens: Tokens;
export declare const brands: BrandName[];
export declare const defaultBrand: BrandName;
export declare const semanticKeys: SemanticKey[];
export default tokens;
`;
  return { js, dts };
}

/* ────────────────────────────── main ────────────────────────────── */

function build() {
  const started = performance.now();
  const compiled = loadBrands().map(compileBrand);
  if (!compiled.length) throw new Error("No brands found in ./brands");

  const problems = [];
  for (const cb of compiled) {
    const { rows, problems: p } = audit(cb);
    problems.push(...p);
    const failed = rows.filter((r) => !r.ok);
    console.log(
      `  ${cb.brand.name.padEnd(10)} ${rows.length - failed.length}/${rows.length} contrast pairs pass` +
        (failed.length
          ? `  ✗ ${failed.map((r) => `${r.mode}:${r.fg}/${r.bg}=${r.ratio}`).join(", ")}`
          : "  ✓"),
    );
  }

  mkdirSync(distDir, { recursive: true });
  writeFileSync(join(distDir, "index.css"), emitCss(compiled));
  writeFileSync(join(distDir, "tailwind.css"), readFileSync(join(srcDir, "tailwind.css"), "utf8"));
  const json = emitJson(compiled);
  writeFileSync(join(distDir, "tokens.json"), JSON.stringify(json, null, 2));
  const { js, dts } = emitJs(json);
  writeFileSync(join(distDir, "index.js"), js);
  writeFileSync(join(distDir, "index.d.ts"), dts);

  console.log(
    `@design-eg/tokens built ${compiled.length} brand(s) in ${Math.round(performance.now() - started)}ms`,
  );
  if (problems.length) {
    console.error(`\nContrast audit failed:\n  ${problems.join("\n  ")}`);
    if (!process.argv.includes("--watch")) process.exit(1);
  }
}

build();

if (process.argv.includes("--watch")) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        build();
      } catch (e) {
        console.error(e);
      }
    }, 60);
  };
  watch(brandsDir, rebuild);
  watch(srcDir, rebuild);
  console.log("watching brands/ and src/ …");
}
