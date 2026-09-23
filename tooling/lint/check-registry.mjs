#!/usr/bin/env node
/**
 * design-eg registry validation
 *
 * Validates the shadcn-compatible registry that packages/registry emits into
 * apps/docs/public/r. Checks, per item:
 *
 *   - name            non-empty, kebab-case, matches its file name
 *   - type            one of the registry:* types the CLI understands
 *   - description     non-empty real sentence (not just the fallback stub)
 *   - files           at least one, each with path, type and non-empty content
 *   - registryDeps    every entry resolves to another item that exists
 *
 * Also checks the registry.json index: it lists every item exactly once, and
 * its entries agree with the per-item files.
 *
 * Usage:  node tooling/lint/check-registry.mjs [--dir <path>] [--json]
 * Exit 0 when valid, 1 when not (or when the registry has not been built).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");

const argv = process.argv.slice(2);
const asJson = argv.includes("--json");
const dirArg = argv.indexOf("--dir");
const outDir = dirArg !== -1 ? resolve(argv[dirArg + 1]) : join(repo, "apps/docs/public/r");

const VALID_TYPES = new Set([
  "registry:ui",
  "registry:block",
  "registry:hook",
  "registry:lib",
  "registry:component",
  "registry:page",
  "registry:file",
  "registry:style",
  "registry:theme",
]);

const errors = [];
const fail = (where, message) => errors.push({ where, message });

if (!existsSync(outDir)) {
  console.error(
    `registry not found at ${outDir}\n` +
      `Run \`pnpm --filter @design-eg/registry build\` (or \`pnpm build\`) first.`,
  );
  process.exit(1);
}

const jsonFiles = readdirSync(outDir).filter((f) => f.endsWith(".json"));
const INDEX_FILES = new Set(["registry.json", "index.json"]);
const itemFiles = jsonFiles.filter((f) => !INDEX_FILES.has(f)).sort();

if (itemFiles.length === 0) fail(outDir, "no registry items found");

function readJson(file) {
  const abs = join(outDir, file);
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch (err) {
    fail(file, `invalid JSON: ${err.message}`);
    return null;
  }
}

/* ------------------------------------------------------------------ items */

const items = new Map();
for (const file of itemFiles) {
  const item = readJson(file);
  if (item) items.set(file.replace(/\.json$/, ""), item);
}

for (const [slug, item] of items) {
  const at = `${slug}.json`;

  if (typeof item.name !== "string" || item.name.trim() === "") fail(at, "missing `name`");
  else {
    if (item.name !== slug) fail(at, `name "${item.name}" does not match file name "${slug}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.name))
      fail(at, `name "${item.name}" is not kebab-case`);
  }

  if (typeof item.type !== "string" || item.type.trim() === "") fail(at, "missing `type`");
  else if (!VALID_TYPES.has(item.type)) fail(at, `unknown type "${item.type}"`);

  if (typeof item.description !== "string" || item.description.trim() === "")
    fail(at, "missing `description`");
  else if (item.description.trim().length < 10)
    fail(at, `description is too short to be useful: "${item.description}"`);

  if (!Array.isArray(item.files) || item.files.length === 0) fail(at, "missing `files`");
  else
    item.files.forEach((f, i) => {
      const fAt = `${at} files[${i}]`;
      if (!f || typeof f !== "object") return fail(fAt, "is not an object");
      if (typeof f.path !== "string" || f.path.trim() === "") fail(fAt, "missing `path`");
      if (typeof f.type !== "string" || !VALID_TYPES.has(f.type))
        fail(fAt, `missing or unknown file type (${JSON.stringify(f.type)})`);
      if (typeof f.content !== "string" || f.content.trim() === "")
        fail(fAt, `missing \`content\` for ${f.path ?? "?"}`);
    });

  if (item.registryDependencies !== undefined) {
    if (!Array.isArray(item.registryDependencies))
      fail(at, "`registryDependencies` is not an array");
    else
      for (const dep of item.registryDependencies) {
        if (typeof dep !== "string") {
          fail(at, `registryDependencies entry is not a string: ${JSON.stringify(dep)}`);
          continue;
        }
        // A full URL points at another registry; only local names are our problem.
        if (/^https?:\/\//.test(dep)) continue;
        if (dep === item.name) fail(at, `registryDependencies lists itself ("${dep}")`);
        if (!items.has(dep)) fail(at, `registryDependencies "${dep}" does not resolve to an item`);
      }
  }

  if (item.dependencies !== undefined && !Array.isArray(item.dependencies))
    fail(at, "`dependencies` is not an array");
}

/* ------------------------------------------------------------------ index */

const index = existsSync(join(outDir, "registry.json")) ? readJson("registry.json") : null;
if (!index) fail("registry.json", "missing index");
else {
  if (!Array.isArray(index.items)) fail("registry.json", "`items` is not an array");
  else {
    const seen = new Set();
    for (const entry of index.items) {
      if (!entry || typeof entry.name !== "string") {
        fail("registry.json", `index entry without a name: ${JSON.stringify(entry)}`);
        continue;
      }
      if (seen.has(entry.name)) fail("registry.json", `duplicate index entry "${entry.name}"`);
      seen.add(entry.name);
      if (!items.has(entry.name))
        fail("registry.json", `index lists "${entry.name}" but ${entry.name}.json is missing`);
    }
    for (const name of items.keys())
      if (!seen.has(name)) fail("registry.json", `"${name}.json" exists but is not in the index`);
  }
  if (typeof index.name !== "string" || !index.name) fail("registry.json", "missing `name`");
  if (typeof index.homepage !== "string" || !index.homepage)
    fail("registry.json", "missing `homepage`");
}

/* ----------------------------------------------------------------- report */

const byType = {};
for (const item of items.values()) byType[item.type] = (byType[item.type] ?? 0) + 1;

if (asJson) {
  console.log(JSON.stringify({ dir: outDir, items: items.size, byType, errors }, null, 2));
  process.exit(errors.length ? 1 : 0);
}

console.log(`design-eg registry check — ${items.size} items in ${outDir}`);
console.log(
  `  ${Object.entries(byType)
    .map(([t, n]) => `${t.replace("registry:", "")} ${n}`)
    .join(", ")}`,
);

if (errors.length) {
  console.log("");
  for (const e of errors) console.log(`  ${e.where}: ${e.message}`);
  console.log(`\nFAIL: ${errors.length} registry problem(s).`);
  process.exit(1);
}
console.log("\nOK: registry is valid.");
