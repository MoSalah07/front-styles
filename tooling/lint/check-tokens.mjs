#!/usr/bin/env node
/**
 * design-eg token lint
 *
 * Mechanically enforces the "Styling rules" section of AGENTS.md across
 * packages/ui/src/**\/*.tsx (test files excluded — they are not published).
 *
 *   raw-color           #hex, rgb(), rgba(), hsl(), hsla() literals
 *   palette-color       Tailwind palette classes (bg-red-500, text-slate-300,
 *                       bg-white, ...) and any colour utility whose ramp name
 *                       is not declared as --color-* in packages/tokens
 *   z-index             any z-* utility that is not z-(--z-*)
 *   physical-direction  ml- mr- pl- pr- left- right- text-left text-right
 *                       border-l border-r rounded-l rounded-r
 *
 * Per-line opt-out, on the line *before* the offending line:
 *
 *   {\/* design-eg-lint-disable-next-line physical-direction *\/}
 *   /* design-eg-lint-disable-next-line raw-color, z-index *\/
 *   // design-eg-lint-disable-next-line all
 *
 * Usage:  node tooling/lint/check-tokens.mjs [--json] [--include-tests]
 * Exit 0 when clean, 1 when violations remain.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const srcDir = join(repo, "packages/ui/src");
const tokensCss = join(repo, "packages/tokens/src/tailwind.css");

const argv = new Set(process.argv.slice(2));
const asJson = argv.has("--json");
const includeTests = argv.has("--include-tests");

const RULES = ["raw-color", "palette-color", "z-index", "physical-direction"];

/* ------------------------------------------------------------------ tokens */

/** Every `--color-<name>` the token layer declares: the allowed colour words. */
function allowedColorNames() {
  const css = readFileSync(tokensCss, "utf8");
  const names = new Set();
  for (const m of css.matchAll(/--color-([a-z0-9-]+)\s*:/g)) names.add(m[1]);
  return names;
}

const ALLOWED_COLORS = allowedColorNames();

/** Tailwind's built-in palette. None of these belong in a component. */
const TAILWIND_PALETTE = [
  "slate",
  "gray",
  "zinc",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

/* ------------------------------------------------------------------ files */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (entry.endsWith(".tsx") && (includeTests || !entry.endsWith(".test.tsx")))
      out.push(abs);
  }
  return out;
}

/* ------------------------------------------------------------------ rules */

// Class-name boundary: not preceded by a word char or a dash, so `--z-modal`
// and `text-left` never trip the bare `z-` / `left-` matchers. A leading `-`
// is allowed so negative utilities (`-ml-2`) are still caught.
const B = "(?<![\\w-])-?";

const RAW_COLOR_RE =
  /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgba?|hsla?)\s*\(/g;

const Z_RE = new RegExp(`${B}z-(?!\\(--z-)([\\w[\\]().%/-]+)`, "g");

const PHYSICAL = [
  { re: new RegExp(`${B}(ml)-`, "g"), fix: "ms-" },
  { re: new RegExp(`${B}(mr)-`, "g"), fix: "me-" },
  { re: new RegExp(`${B}(pl)-`, "g"), fix: "ps-" },
  { re: new RegExp(`${B}(pr)-`, "g"), fix: "pe-" },
  { re: new RegExp(`${B}(left)-`, "g"), fix: "start-" },
  { re: new RegExp(`${B}(right)-`, "g"), fix: "end-" },
  { re: new RegExp(`${B}(text-left)\\b`, "g"), fix: "text-start" },
  { re: new RegExp(`${B}(text-right)\\b`, "g"), fix: "text-end" },
  { re: new RegExp(`${B}(border-l)(?![a-z])`, "g"), fix: "border-s" },
  { re: new RegExp(`${B}(border-r)(?![a-z])`, "g"), fix: "border-e" },
  { re: new RegExp(`${B}(rounded-l)(?![a-z])`, "g"), fix: "rounded-s" },
  { re: new RegExp(`${B}(rounded-r)(?![a-z])`, "g"), fix: "rounded-e" },
];

const COLOR_PREFIXES =
  "bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|placeholder|caret|accent";
const COLOR_UTIL_RE = new RegExp(`${B}(?:${COLOR_PREFIXES})-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)`, "g");
const PALETTE_RE = new RegExp(`^(?:${TAILWIND_PALETTE.join("|")})-\\d+$`);
const RAMP_RE = /^([a-z]{3,})-(\d+)$/;

// `ring-offset-2`, `border-spacing-2`, `divide-x-2` and friends are sized
// sub-utilities that happen to look like `<word>-<number>`; they are not ramps.
const NON_COLOR_SEGMENTS = new Set([
  "offset",
  "opacity",
  "width",
  "spacing",
  "size",
  "inline",
  "block",
  "start",
  "end",
  "thickness",
]);

/** True when a colour-utility value is not something the tokens define. */
function badColorValue(value) {
  if (value === "white" || value === "black") return true;
  if (PALETTE_RE.test(value)) return true;
  const ramp = RAMP_RE.exec(value);
  if (ramp && !NON_COLOR_SEGMENTS.has(ramp[1]) && !ALLOWED_COLORS.has(value)) return true;
  return false;
}

/* --------------------------------------------------------------- scanning */

/**
 * Blanks out comments, keeping every other character at its original offset so
 * line and column numbers stay true. Without this, prose such as "right-click"
 * or "runs right-to-left" in a doc comment reads as a physical-direction
 * utility. String literals are tracked only so a `//` inside "https://…" is not
 * mistaken for a comment.
 */
function stripComments(source) {
  const out = source.split("");
  let i = 0;
  let quote = null; // "'", '"' or "`"
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (quote) {
      if (c === "\\") i += 2;
      else {
        if (c === quote) quote = null;
        i++;
      }
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      quote = c;
      i++;
      continue;
    }
    if (c === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") out[i++] = " ";
      continue;
    }
    if (c === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      for (; i < stop; i++) if (source[i] !== "\n") out[i] = " ";
      continue;
    }
    i++;
  }
  return out.join("");
}

const DISABLE_RE = /design-eg-lint-disable-next-line([^*/\n]*)/;

/** Rules disabled for line index `i` by a comment on the line above it. */
function disabledFor(lines, i) {
  if (i === 0) return null;
  const m = DISABLE_RE.exec(lines[i - 1]);
  if (!m) return null;
  const named = m[1]
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (named.length === 0 || named.includes("all")) return new Set(RULES);
  return new Set(named);
}

function scanFile(abs) {
  const rel = relative(repo, abs).split(sep).join("/");
  const source = readFileSync(abs, "utf8");
  const rawLines = source.split(/\r?\n/);
  const lines = stripComments(source).split(/\r?\n/);
  const found = [];
  const suppressed = [];

  lines.forEach((line, i) => {
    const off = disabledFor(rawLines, i);
    const hits = [];

    const push = (rule, text, hint) => hits.push({ rule, text, hint });

    for (const m of line.matchAll(RAW_COLOR_RE)) push("raw-color", m[0].trim(), "use a token");

    for (const m of line.matchAll(COLOR_UTIL_RE)) {
      const whole = m[0].replace(/^-/, "");
      const value = m[1];
      if (badColorValue(value)) push("palette-color", whole, "use a semantic or ramp token");
    }

    for (const m of line.matchAll(Z_RE)) {
      push("z-index", m[0].trim(), "use z-(--z-modal) etc.");
    }

    for (const { re, fix } of PHYSICAL) {
      for (const m of line.matchAll(re)) push("physical-direction", m[0].trim(), `use ${fix}`);
    }

    for (const hit of hits) {
      const record = { file: rel, line: i + 1, col: line.indexOf(hit.text) + 1, ...hit };
      if (off?.has(hit.rule)) suppressed.push(record);
      else found.push(record);
    }
  });

  return { found, suppressed };
}

/* ----------------------------------------------------------------- report */

const files = walk(srcDir).sort();
const violations = [];
const suppressions = [];
for (const f of files) {
  const r = scanFile(f);
  violations.push(...r.found);
  suppressions.push(...r.suppressed);
}

const byRule = Object.fromEntries(RULES.map((r) => [r, 0]));
for (const v of violations) byRule[v.rule]++;
const suppressedByRule = Object.fromEntries(RULES.map((r) => [r, 0]));
for (const v of suppressions) suppressedByRule[v.rule]++;

if (asJson) {
  console.log(
    JSON.stringify({ files: files.length, byRule, suppressedByRule, violations }, null, 2),
  );
  process.exit(violations.length ? 1 : 0);
}

const grouped = new Map();
for (const v of violations) {
  if (!grouped.has(v.file)) grouped.set(v.file, []);
  grouped.get(v.file).push(v);
}

console.log(`design-eg token lint — ${files.length} files scanned\n`);

for (const [file, list] of grouped) {
  console.log(file);
  for (const v of list) {
    console.log(
      `  ${String(v.line).padStart(4)}:${String(v.col).padEnd(3)}  ${v.rule.padEnd(18)}  ${v.text}  (${v.hint})`,
    );
  }
  console.log("");
}

console.log("summary by rule");
for (const rule of RULES) {
  const n = byRule[rule];
  const s = suppressedByRule[rule];
  console.log(`  ${rule.padEnd(18)} ${String(n).padStart(4)}${s ? `   (${s} suppressed)` : ""}`);
}
const fileCount = grouped.size;
console.log(
  `  ${"TOTAL".padEnd(18)} ${String(violations.length).padStart(4)}  in ${fileCount} file(s)`,
);
console.log(`  ${"opt-outs used".padEnd(18)} ${String(suppressions.length).padStart(4)}`);

if (violations.length) {
  console.log(
    `\nFAIL: ${violations.length} token violation(s). See AGENTS.md "Styling rules".` +
      `\nAdd /* design-eg-lint-disable-next-line <rule> */ above a line for a deliberate exception.`,
  );
  process.exit(1);
}
console.log("\nOK: no token violations.");
