#!/usr/bin/env node
/**
 * design-eg published-surface check
 *
 * Runs against packages/ui/dist after `pnpm --filter @design-eg/ui build` and
 * asserts that what package.json promises is actually on disk:
 *
 *   - dist/index.js and dist/index.d.ts (the barrel)
 *   - dist/styles.css (copied by scripts/copy-styles.mjs, and non-empty)
 *   - every `exports` subpath resolves, including the "./*" per-component
 *     pattern: one .js + .d.ts per src/components/*.tsx
 *   - blocks, templates and lib emit their own entry points too
 *   - the barrel re-exports every component (no file silently dropped)
 *
 * Usage:  node tooling/lint/check-dist.mjs
 * Exit 0 when the surface is complete, 1 otherwise.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const pkgDir = join(repo, "packages/ui");
const dist = join(pkgDir, "dist");
const src = join(pkgDir, "src");

const errors = [];
const fail = (m) => errors.push(m);

if (!existsSync(dist)) {
  console.error(`dist/ not found at ${dist}\nRun \`pnpm --filter @design-eg/ui build\` first.`);
  process.exit(1);
}

/** A built file must exist and carry something. */
function requireFile(relPath, { minBytes = 1 } = {}) {
  const abs = join(dist, relPath);
  if (!existsSync(abs)) return fail(`missing dist/${relPath}`);
  const { size } = statSync(abs);
  if (size < minBytes) fail(`dist/${relPath} is empty (${size} bytes)`);
}

/* ------------------------------------------------------- required entries */

requireFile("index.js", { minBytes: 32 });
requireFile("index.d.ts", { minBytes: 32 });
requireFile("styles.css", { minBytes: 32 });
requireFile("lib/cn.js");
requireFile("lib/cn.d.ts");

/* ------------------------------------------- per-component entry points --- */

function sourceNames(dir, ext) {
  const abs = join(src, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(ext) && !f.includes(".test.") && !f.includes(".stories."))
    .map((f) => f.slice(0, -ext.length))
    .sort();
}

const GROUPS = [
  { dir: "components", ext: ".tsx" },
  { dir: "blocks", ext: ".tsx" },
  { dir: "templates", ext: ".tsx" },
];

const counts = {};
for (const { dir, ext } of GROUPS) {
  const names = sourceNames(dir, ext);
  counts[dir] = names.length;
  for (const name of names) {
    requireFile(`${dir}/${name}.js`);
    requireFile(`${dir}/${name}.d.ts`);
  }
}

/* ------------------------------------------- exports map actually resolves */

const pkg = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8"));

function checkExportTarget(subpath, target) {
  if (typeof target !== "string") return;
  if (!target.startsWith("./dist/")) return; // e.g. "./package.json"
  if (target.includes("*")) return; // handled by the per-component loop
  const abs = join(pkgDir, target);
  if (!existsSync(abs)) fail(`exports["${subpath}"] -> ${target} does not exist`);
}

for (const [subpath, value] of Object.entries(pkg.exports ?? {})) {
  if (typeof value === "string") checkExportTarget(subpath, value);
  else for (const target of Object.values(value)) checkExportTarget(subpath, target);
}

// The "./*" pattern must resolve for a real component name.
const wildcard = pkg.exports?.["./*"];
const sampleComponent = sourceNames("components", ".tsx")[0];
if (wildcard && sampleComponent) {
  for (const target of Object.values(wildcard)) {
    const abs = join(pkgDir, target.replace("*", sampleComponent));
    if (!existsSync(abs)) fail(`exports["./*"] does not resolve for "${sampleComponent}": ${abs}`);
  }
}

if (pkg.main && !existsSync(join(pkgDir, pkg.main))) fail(`"main" -> ${pkg.main} does not exist`);
if (pkg.types && !existsSync(join(pkgDir, pkg.types)))
  fail(`"types" -> ${pkg.types} does not exist`);

/* ------------------------------------------------------- barrel coverage */

if (existsSync(join(dist, "index.js"))) {
  const barrel = readFileSync(join(dist, "index.js"), "utf8");
  for (const { dir, ext } of GROUPS)
    for (const name of sourceNames(dir, ext))
      if (!barrel.includes(`${dir}/${name}.js`))
        fail(`dist/index.js does not re-export ${dir}/${name}`);
}

/* ----------------------------------------------------------------- report */

console.log(
  `design-eg dist check — ${dist}\n` +
    `  components ${counts.components ?? 0}, blocks ${counts.blocks ?? 0}, templates ${counts.templates ?? 0}`,
);

if (errors.length) {
  console.log("");
  for (const e of errors) console.log(`  ${e}`);
  console.log(`\nFAIL: ${errors.length} problem(s) with the published surface.`);
  process.exit(1);
}
console.log("\nOK: published surface is complete.");
