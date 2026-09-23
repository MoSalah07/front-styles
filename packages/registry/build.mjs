/**
 * Registry builder
 * Reads packages/ui/src/components/*.tsx and emits shadcn-compatible registry items
 * into apps/docs/public/r/<name>.json plus an index at registry.json.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const uiSrc = join(repo, "packages/ui/src");
const outDir = join(repo, "apps/docs/public/r");
const uiPkg = JSON.parse(readFileSync(join(repo, "packages/ui/package.json"), "utf8"));
const HOMEPAGE = "https://design-eg.vercel.app";

const IMPORT_RE = /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g;

function externalDeps(source) {
  const deps = new Set();
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("@/") || spec === "react" || spec === "react-dom")
      continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    deps.add(pkg);
  }
  return [...deps].sort();
}

function siblingDeps(source) {
  const deps = new Set();
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith("./")) deps.add(basename(spec).replace(/\.tsx?$/, ""));
  }
  return [...deps].sort();
}

function rewriteImports(source) {
  return source
    .replace(/from\s+["']\.\.\/lib\/cn["']/g, 'from "@/lib/utils"')
    .replace(/from\s+["']\.\/([a-z0-9-]+)["']/g, 'from "@/components/ui/$1"');
}

function titleCase(name) {
  return name.replace(/(^|-)([a-z])/g, (_, _s, c) => (_s ? " " : "") + c.toUpperCase());
}

/**
 * Reads the file-level doc comment only: the one at the very top, allowing a
 * leading "use client" directive. Matching any doc comment would pick up the
 * first prop's JSDoc instead of the component's own summary.
 */
function fileDocComment(source) {
  const m = source.match(/^(?:"use client";\s*)?\/\*\*\s*([\s\S]*?)\s*\*\//);
  return m
    ? m[1]
        .replace(/^\s*\*\s?/gm, "")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

mkdirSync(outDir, { recursive: true });

const items = [];

// utils (cn helper) — every component depends on it
const cnSource = readFileSync(join(uiSrc, "lib/cn.ts"), "utf8");
const utils = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "utils",
  type: "registry:lib",
  title: "Utils",
  description: "cn() helper: clsx + tailwind-merge.",
  dependencies: externalDeps(cnSource),
  files: [
    { path: "lib/utils.ts", type: "registry:lib", content: cnSource, target: "lib/utils.ts" },
  ],
};
items.push(utils);

// components
const files = readdirSync(join(uiSrc, "components")).filter(
  (f) => f.endsWith(".tsx") && !f.includes(".test."),
);
for (const file of files) {
  const name = file.replace(/\.tsx$/, "");
  const source = readFileSync(join(uiSrc, "components", file), "utf8");
  items.push({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    title: titleCase(name),
    description: fileDocComment(source) || `${titleCase(name)} component from design-eg.`,
    dependencies: externalDeps(source),
    registryDependencies: ["utils", ...siblingDeps(source)],
    files: [{ path: `ui/${file}`, type: "registry:ui", content: rewriteImports(source) }],
  });
}

for (const item of items) {
  writeFileSync(join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2));
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "design-eg",
  homepage: HOMEPAGE,
  version: uiPkg.version,
  items: items.map(({ files: _f, ...rest }) => ({
    ...rest,
    files: _f.map(({ content: _c, ...f }) => f),
  })),
};
writeFileSync(join(outDir, "registry.json"), JSON.stringify(index, null, 2));
writeFileSync(join(outDir, "index.json"), JSON.stringify(index.items.map((i) => i.name)));

console.log(`registry: ${items.length} items -> apps/docs/public/r`);
