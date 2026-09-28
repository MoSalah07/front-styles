import { brands, semanticKeys, tokens } from "@design-eg/tokens";
import {
  BLOCKS,
  COMPONENTS,
  itemsByCategory,
  REGISTRY_ITEMS,
  TEMPLATES,
  type RegistryItem,
} from "@/lib/registry";
import { DEFAULT_LOCALE } from "@/lib/locales";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** One line per item: name, title and the docs URL, so a crawler can follow it. */
function list(items: RegistryItem[]) {
  return items.map((item) => `- ${item.name} — ${item.title}: ${item.description}`).join("\n");
}

/** The cn() helper and the hooks: everything that is neither a component nor a block. */
const FOUNDATIONS = itemsByCategory("foundation");

/**
 * llms.txt — a plain-text map of the project for AI assistants and crawlers.
 * Spec: https://llmstxt.org
 */
export function GET() {
  const body = `# ${SITE.name}

> ${SITE.tagline} ${SITE.description}

- Repository: ${SITE.github}
- npm scope: @design-eg (packages: @design-eg/tokens, @design-eg/ui, @design-eg/cli)
- License: MIT
- Stack: React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, class-variance-authority
- Full reference in one fetch: ${SITE.url}/llms-full.txt
- Docs index: ${SITE.url}/${DEFAULT_LOCALE}/docs
- Template gallery: ${SITE.url}/${DEFAULT_LOCALE}/docs/templates
- Every item has a page at ${SITE.url}/${DEFAULT_LOCALE}/docs/<name>
- Languages: English (default), Arabic, French, Hindi. Every page lives under
  /<lang>/, e.g. ${SITE.url}/ar/docs/button. This reference is English only:
  the API it documents is the same in every language.
- Every docs page has a Markdown twin at the same URL plus \`.md\`, e.g. ${SITE.url}/docs/button.md

## Install

\`\`\`bash
pnpm add @design-eg/ui            # npm packages
npx @design-eg/cli init           # or copy the source into your project
npx @design-eg/cli add button card
\`\`\`

\`\`\`css
@import "tailwindcss";
@import "@design-eg/ui/styles.css";
\`\`\`

## Theming

Switch with attributes on <html>: class="dark" | "light", data-brand="${brands.join('" | "')}", data-density="compact" | "comfortable" | "spacious", dir="rtl" | "ltr".
Brands: ${brands.map((b) => `${b} (seed ${tokens.brands[b].seed})`).join(", ")}. Default brand: ${tokens.defaultBrand}.

Semantic CSS variables (shadcn-compatible names): ${semanticKeys.map((k) => `--${k}`).join(", ")}.

## Foundations (${FOUNDATIONS.length})

${list(FOUNDATIONS)}

## Components (${COMPONENTS.length}, v${tokens.version})

${list(COMPONENTS)}

## Blocks (${BLOCKS.length})

${list(BLOCKS)}

## Page templates (${TEMPLATES.length})

${list(TEMPLATES)}

## Registry

- ${REGISTRY_ITEMS.length} items in total.
- Index: ${SITE.url}/r/registry.json
- Item: ${SITE.url}/r/<name>.json (shadcn registry-item schema; works with \`npx shadcn add <url>\`)
- Name list: ${SITE.url}/r/index.json

These URLs are stable: the registry is generated from the library source on
every build and served from the docs deployment, so a link to an item keeps
working across releases.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
