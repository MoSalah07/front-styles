import catalogue from "./catalogue.generated.json" with { type: "json" };

/**
 * The queries the server answers, separated from the protocol that carries
 * them. Everything here is a pure function over the baked snapshot, which is
 * what makes it testable without speaking JSON-RPC at it.
 */

export type Category = "component" | "block" | "template" | "hook" | "lib";

/**
 * One resolved semantic token.
 *
 * The compiler emits all three forms because they answer different questions:
 * `css` is what to write in a stylesheet and keeps the brand switchable, `hex`
 * is what to tell a designer or paste into a mock, and `oklch` is the space
 * the ramp was actually derived in.
 */
export interface TokenValue {
  css: string;
  oklch: string;
  hex: string;
}

export interface CatalogueFile {
  path: string;
  target: string;
  content: string;
}

export interface CatalogueItem {
  name: string;
  type: string;
  title: string;
  description: string;
  category: Category;
  dependencies: string[];
  registryDependencies: string[];
  files: CatalogueFile[];
}

const CATALOGUE = catalogue as unknown as {
  name: string;
  version: string;
  homepage: string;
  items: CatalogueItem[];
  tokens: {
    version: string;
    defaultBrand: string;
    semanticKeys: string[];
    brands: Record<
      string,
      {
        label: string;
        description: string;
        seed: string;
        radius: string;
        fonts: Record<string, string>;
        modes: Record<string, Record<string, TokenValue>>;
      }
    >;
  };
};

export const VERSION = CATALOGUE.version;
export const HOMEPAGE = CATALOGUE.homepage;
export const ITEMS = CATALOGUE.items;
export const TOKENS = CATALOGUE.tokens;

const BY_NAME = new Map(ITEMS.map((item) => [item.name, item]));

export function getItem(name: string): CatalogueItem | undefined {
  return BY_NAME.get(name.trim().toLowerCase());
}

export function listItems(category?: Category): CatalogueItem[] {
  return category ? ITEMS.filter((item) => item.category === category) : ITEMS;
}

/** Lowercases and turns every separator into a space, so "sign in" finds "sign-in". */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Ranked substring search over name, title and description.
 *
 * Deliberately not fuzzy: an assistant asking for "dialog" wants the dialog,
 * and a fuzzy matcher that also returns "data-table" because both contain the
 * letters `d`, `a`, `t` costs more than it gives. Name matches outrank title
 * matches, which outrank a mention in the description.
 */
export function search(query: string, limit = 10): CatalogueItem[] {
  const needle = normalise(query);
  if (!needle) return [];

  const scored: { item: CatalogueItem; score: number }[] = [];

  for (const item of ITEMS) {
    // Both sides are normalised, so a query typed as words finds a name
    // written with hyphens — "sign in" finds `login-split`, "data table"
    // finds `data-table`.
    const name = normalise(item.name);
    let score = 0;

    if (name === needle) score = 100;
    else if (name.startsWith(needle)) score = 80;
    else if (name.includes(needle)) score = 60;
    else if (normalise(item.title).includes(needle)) score = 40;
    else if (normalise(item.description).includes(needle)) score = 20;

    if (score) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Every registry item the given ones pull in, transitively.
 *
 * An assistant that copies `data-table` without `pagination` and `checkbox`
 * hands back code that does not compile, so the answer to "what do I need" has
 * to be the closure rather than the direct list.
 */
export function resolveDependencies(names: string[]): string[] {
  const seen = new Set<string>();
  const queue = [...names];

  while (queue.length) {
    const name = queue.shift();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const item = getItem(name);
    if (item) queue.push(...item.registryDependencies);
  }

  for (const name of names) seen.delete(name);
  return [...seen].sort();
}

/** The command that copies an item into a project, in the caller's package manager. */
export function installCommand(names: string[], manager = "pnpm"): string {
  const list = names.join(" ");
  const exec: Record<string, string> = {
    npm: "npx",
    pnpm: "pnpm dlx",
    yarn: "yarn dlx",
    bun: "bunx",
  };
  return `${exec[manager] ?? exec.pnpm} @design-eg/cli add ${list}`;
}

export interface BrandSummary {
  name: string;
  label: string;
  description: string;
  seed: string;
  radius: string;
  fonts: Record<string, string>;
}

export function listBrands(): BrandSummary[] {
  return Object.entries(TOKENS.brands).map(([name, brand]) => ({
    name,
    label: brand.label,
    description: brand.description,
    seed: brand.seed,
    radius: brand.radius,
    fonts: brand.fonts,
  }));
}

/** Every semantic token for one brand in one colour mode, already resolved. */
export function getBrandTokens(
  name: string,
  mode: "light" | "dark" = "dark",
): Record<string, TokenValue> | undefined {
  return TOKENS.brands[name]?.modes[mode];
}
