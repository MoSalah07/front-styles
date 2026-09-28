/**
 * Registry builder
 *
 * Reads packages/ui/src and emits shadcn-compatible registry items into
 * apps/docs/public/r/<name>.json, plus an index at registry.json.
 *
 *   src/components/*.tsx -> registry:ui     -> components/ui/<name>.tsx
 *   src/blocks/*.tsx     -> registry:block  -> components/blocks/<name>.tsx
 *   src/templates/*.tsx  -> registry:block  -> components/templates/<name>.tsx
 *   src/hooks/*.ts       -> registry:hook   -> hooks/<name>.ts
 *   src/lib/cn.ts        -> registry:lib    -> lib/utils.ts
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const uiSrc = join(repo, "packages/ui/src");
const outDir = join(repo, "apps/docs/public/r");
const uiPkg = JSON.parse(readFileSync(join(repo, "packages/ui/package.json"), "utf8"));
const HOMEPAGE = "https://design-eg.vercel.app";

const IMPORT_RE = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g;

function externalDeps(source) {
  const deps = new Set();
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (spec.startsWith(".") || spec.startsWith("@/")) continue;
    if (
      spec === "react" ||
      spec === "react-dom" ||
      spec.startsWith("react/") ||
      spec.startsWith("react-dom/")
    )
      continue;
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    deps.add(pkg);
  }
  return [...deps].sort();
}

/** Relative sibling imports become registry dependencies so the CLI pulls them too. */
function registryDeps(source) {
  const deps = new Set(["utils"]);
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1];
    if (!spec.startsWith(".")) continue;
    const name = basename(spec).replace(/\.(tsx?|jsx?)$/, "");
    if (name === "cn" || name === "utils") continue;
    // The catalogues travel inside the i18n item rather than as items of their
    // own, so an import of them is not a dependency the CLI can resolve.
    if (name === "messages") continue;
    deps.add(name);
  }
  return [...deps].sort();
}

/**
 * Rewrites workspace-relative imports to the aliases a consumer project uses.
 * Order matters: the lib rewrite must run before the generic sibling rewrite.
 */
function rewriteImports(source) {
  return source
    .replace(/(["'])(?:\.\.?\/)*lib\/cn\1/g, '"@/lib/utils"')
    .replace(/(["'])(?:\.\.?\/)*lib\/i18n\1/g, '"@/lib/i18n"')
    .replace(/(["'])(?:\.\.?\/)*hooks\/([a-z0-9-]+)\1/g, '"@/hooks/$2"')
    .replace(/(["'])(?:\.\.\/)+components\/([a-z0-9-]+)\1/g, '"@/components/ui/$2"')
    .replace(/(["'])(?:\.\.\/)+blocks\/([a-z0-9-]+)\1/g, '"@/components/blocks/$2"')
    .replace(/(["'])(?:\.\.\/)+templates\/([a-z0-9-]+)\1/g, '"@/components/templates/$2"')
    .replace(/(["'])\.\/([a-z0-9-]+)\1/g, '"@/components/ui/$2"');
}

function titleCase(name) {
  return name.replace(/(^|-)([a-z])/g, (_, sep, c) => (sep ? " " : "") + c.toUpperCase());
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
items.push({
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "utils",
  type: "registry:lib",
  title: "Utils",
  description: "cn() helper: clsx + tailwind-merge.",
  dependencies: externalDeps(cnSource),
  files: [
    { path: "lib/utils.ts", type: "registry:lib", content: cnSource, target: "lib/utils.ts" },
  ],
});

// i18n — the provider plus the four catalogues. One item rather than six,
// because a catalogue on its own does nothing and the CLI would have to pull
// all of them anyway. `use-locale` is a separate item, so it is a dependency.
const I18N_FILES = [
  "lib/i18n.tsx",
  "lib/messages/index.ts",
  "lib/messages/types.ts",
  "lib/messages/en.ts",
  "lib/messages/ar.ts",
  "lib/messages/fr.ts",
  "lib/messages/hi.ts",
];
const i18nSources = I18N_FILES.map((path) => ({
  path,
  source: readFileSync(join(uiSrc, path), "utf8"),
}));
items.push({
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "i18n",
  type: "registry:lib",
  title: "I18n",
  description: fileDocComment(i18nSources[0].source),
  dependencies: [...new Set(i18nSources.flatMap(({ source }) => externalDeps(source)))].sort(),
  registryDependencies: ["use-locale"],
  files: i18nSources.map(({ path, source }) => ({
    path,
    type: "registry:lib",
    // Only the hooks import crosses out of lib/; the catalogue imports are
    // relative to each other and stay correct once the folder is copied whole.
    content: source.replace(/(["'])(?:\.\.?\/)*hooks\/([a-z0-9-]+)\1/g, '"@/hooks/$2"'),
    target: path,
  })),
});

const GROUPS = [
  { dir: "components", ext: ".tsx", type: "registry:ui", target: (n) => `components/ui/${n}.tsx` },
  {
    dir: "blocks",
    ext: ".tsx",
    type: "registry:block",
    target: (n) => `components/blocks/${n}.tsx`,
  },
  {
    dir: "templates",
    ext: ".tsx",
    type: "registry:block",
    target: (n) => `components/templates/${n}.tsx`,
  },
  { dir: "hooks", ext: ".ts", type: "registry:hook", target: (n) => `hooks/${n}.ts` },
];

for (const group of GROUPS) {
  const abs = join(uiSrc, group.dir);
  if (!existsSync(abs)) continue;
  const files = readdirSync(abs)
    .filter((f) => f.endsWith(group.ext) && !f.includes(".test.") && !f.includes(".stories."))
    .sort();

  for (const file of files) {
    const name = file.replace(new RegExp(`\\${group.ext}$`), "");
    const source = readFileSync(join(abs, file), "utf8");
    items.push({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: group.type,
      title: titleCase(name),
      description: fileDocComment(source) || `${titleCase(name)} from design-eg.`,
      dependencies: externalDeps(source),
      registryDependencies: registryDeps(source),
      files: [
        {
          path: group.target(name),
          type: group.type,
          content: rewriteImports(source),
          target: group.target(name),
        },
      ],
    });
  }
}

for (const item of items) {
  writeFileSync(join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2));
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "design-eg",
  homepage: HOMEPAGE,
  version: uiPkg.version,
  items: items.map(({ files, ...rest }) => ({
    ...rest,
    files: files.map(({ content, ...f }) => f),
  })),
};
writeFileSync(join(outDir, "registry.json"), JSON.stringify(index, null, 2));
writeFileSync(join(outDir, "index.json"), JSON.stringify(index.items.map((i) => i.name)));

const byType = items.reduce((acc, i) => ({ ...acc, [i.type]: (acc[i.type] ?? 0) + 1 }), {});
console.log(
  `registry: ${items.length} items -> apps/docs/public/r  (${Object.entries(byType)
    .map(([t, n]) => `${t.replace("registry:", "")} ${n}`)
    .join(", ")})`,
);
