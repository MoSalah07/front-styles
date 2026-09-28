/**
 * Bakes the built registry and the compiled tokens into the package.
 *
 * The server answers from this snapshot rather than reading the workspace or
 * fetching the site, for three reasons: it is installed with `npx` on a
 * stranger's machine where neither exists, an assistant asking for a component
 * should not wait on a network round trip, and an answer that changes under the
 * caller between two questions is worse than one that is merely a release old.
 *
 * The version travels with it, so `catalogue.version` is always the version of
 * the library the sources actually came from.
 *
 * The output is committed, and deliberately carries no timestamp: it has to
 * exist for `tsc` to resolve the import on a fresh clone, and a date in it
 * would put a 500 KB diff in every build that changed nothing.
 *
 * Run before `tsdown` — see the package.json build script.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const repo = resolve(pkgRoot, "../..");

const registryDir = join(repo, "apps/docs/public/r");
const tokensFile = join(repo, "packages/tokens/dist/tokens.json");
const outFile = join(pkgRoot, "src/catalogue.generated.json");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

if (!readdirSync(registryDir).includes("registry.json")) {
  console.error("mcp: no registry found. Run `pnpm --filter @design-eg/registry build` first.");
  process.exit(1);
}

const index = readJson(join(registryDir, "registry.json"));

/** Sub-groups mirror the docs sidebar, so an assistant can answer "which form controls exist". */
const GROUPS = {
  "registry:ui": "component",
  "registry:block": "block",
  "registry:hook": "hook",
  "registry:lib": "lib",
};

/**
 * Blocks and templates share `registry:block`, and only the file path tells
 * them apart — the same rule the docs site uses.
 */
function categorise(item) {
  const path = item.files?.[0]?.path ?? "";
  if (path.startsWith("components/templates/")) return "template";
  if (path.startsWith("components/blocks/")) return "block";
  return GROUPS[item.type] ?? "component";
}

const items = index.items.map((entry) => {
  // Only the per-item document carries `content`; the index strips it.
  const full = readJson(join(registryDir, `${entry.name}.json`));
  return {
    name: entry.name,
    type: entry.type,
    title: entry.title,
    description: entry.description ?? "",
    category: categorise(entry),
    dependencies: entry.dependencies ?? [],
    registryDependencies: entry.registryDependencies ?? [],
    files: (full.files ?? []).map((file) => ({
      path: file.path,
      target: file.target ?? file.path,
      content: file.content ?? "",
    })),
  };
});

const tokens = readJson(tokensFile);

const catalogue = {
  name: index.name,
  version: index.version,
  homepage: index.homepage,
  items,
  tokens: {
    version: tokens.version,
    defaultBrand: tokens.defaultBrand,
    semanticKeys: tokens.semanticKeys,
    // The full ramps would triple the payload for something an assistant
    // almost never needs verbatim; the seed, the label and the modes are what
    // answers "what does --primary resolve to in this brand".
    brands: Object.fromEntries(
      Object.entries(tokens.brands).map(([name, brand]) => [
        name,
        {
          label: brand.label,
          description: brand.description,
          seed: brand.seed,
          radius: brand.radius,
          fonts: brand.fonts,
          modes: brand.modes,
        },
      ]),
    ),
  },
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(catalogue)}\n`);

const kb = (JSON.stringify(catalogue).length / 1024).toFixed(0);
const counts = items.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `mcp snapshot: ${items.length} items (${Object.entries(counts)
    .map(([k, v]) => `${k} ${v}`)
    .join(", ")}), ${Object.keys(catalogue.tokens.brands).length} brands, ${kb} KB`,
);
