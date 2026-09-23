import { brands, semanticKeys, tokens } from "@design-eg/tokens";
import { BLOCKS, COMPONENTS, REGISTRY_ITEMS, TEMPLATES, type RegistryItem } from "@/lib/registry";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

/** One line per item: name, title and the docs URL, so a crawler can follow it. */
function list(items: RegistryItem[]) {
  return items.map((item) => `- ${item.name} — ${item.title}: ${item.description}`).join("\n");
}

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
- Docs index: ${SITE.url}/docs
- Template gallery: ${SITE.url}/docs/templates
- Every item has a page at ${SITE.url}/docs/<name>

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
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
