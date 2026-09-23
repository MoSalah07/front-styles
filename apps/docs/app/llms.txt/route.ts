import { brands, semanticKeys, tokens } from "@design-eg/tokens";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

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

## Components (v${tokens.version})

button, input, label, card, badge, separator, skeleton, switch

## Registry

- Index: ${SITE.url}/r/registry.json
- Item: ${SITE.url}/r/<name>.json (shadcn registry-item schema; works with \`npx shadcn add <url>\`)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
