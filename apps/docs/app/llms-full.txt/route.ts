import { brands, semanticKeys, tokens } from "@design-eg/tokens";
import { exportName, getItemNotes } from "@/lib/anatomy";
import {
  BLOCKS,
  COMPONENTS,
  getItemFiles,
  installCommand,
  itemsByCategory,
  REGISTRY_ITEMS,
  shadcnCommand,
  TEMPLATES,
  type RegistryItem,
} from "@/lib/registry";
import { DEFAULT_LOCALE } from "@/lib/locales";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const KIND_LABEL: Record<RegistryItem["category"], string> = {
  foundation: "Foundation",
  component: "Component",
  block: "Block",
  template: "Page template",
};

function fence(path: string) {
  return path.endsWith(".tsx") ? "tsx" : path.endsWith(".ts") ? "ts" : "";
}

/** One section per registry item: the metadata, then the file the CLI copies. */
function section(item: RegistryItem) {
  const notes = getItemNotes(item.name);
  const parts = notes?.anatomy?.length ? notes.anatomy : [exportName(item.name, item.title)];
  const files = getItemFiles(item.name);

  const lines = [
    `### ${item.title} (\`${item.name}\`)`,
    "",
    `- Kind: ${KIND_LABEL[item.category]} (${item.type})`,
    `- Description: ${item.description}`,
    `- Docs: ${SITE.url}${item.href} (Markdown: ${SITE.url}${item.href}.md)`,
    `- Registry item: ${SITE.url}/r/${item.name}.json`,
    `- Copies to: ${item.file}`,
    `- Exports: ${parts.join(", ")}`,
    `- npm dependencies: ${item.dependencies.length ? item.dependencies.join(", ") : "none beyond react"}`,
    `- Registry dependencies: ${item.registryDependencies.length ? item.registryDependencies.join(", ") : "none"}`,
    "",
    "```bash",
    installCommand(item.name),
    shadcnCommand(item.name),
    "```",
    "",
    "```tsx",
    `import { ${parts.join(", ")} } from "@design-eg/ui";`,
    "```",
  ];

  if (notes?.props?.length) {
    lines.push(
      "",
      "Props:",
      "",
      ...notes.props.map(
        (prop) =>
          `- \`${prop.name}\`: ${prop.type}${prop.defaultValue ? ` (default ${prop.defaultValue})` : ""} — ${prop.description}`,
      ),
    );
  }

  if (notes?.notes?.length) {
    lines.push("", "Notes:", "", ...notes.notes.map((note) => `- ${note}`));
  }

  for (const file of files) {
    lines.push(
      "",
      `Source — \`${file.target}\`:`,
      "",
      `\`\`\`${fence(file.path)}`,
      file.content,
      "```",
    );
  }

  return lines.join("\n");
}

function group(heading: string, items: RegistryItem[]) {
  return [`## ${heading} (${items.length})`, "", items.map(section).join("\n\n")].join("\n");
}

const FOUNDATIONS = itemsByCategory("foundation");

/**
 * llms-full.txt — the whole API surface in one fetch: the token contract and
 * every registry item with its real source, so an assistant never has to guess
 * at an import path or a prop name. Where llms.txt is the map, this is the text.
 * Spec: https://llmstxt.org
 */
export function GET() {
  const body = `# ${SITE.name} — full reference

> ${SITE.tagline} ${SITE.description}

This is the complete text: install, the token contract, and all
${REGISTRY_ITEMS.length} registry items with their descriptions, dependencies,
install commands and source. The short map is at ${SITE.url}/llms.txt.

- Version: ${tokens.version}
- Repository: ${SITE.github}
- npm scope: @design-eg (packages: @design-eg/tokens, @design-eg/ui, @design-eg/cli)
- License: MIT
- Stack: React 19, TypeScript, Tailwind CSS v4, Radix UI primitives, class-variance-authority
- Docs index: ${SITE.url}/${DEFAULT_LOCALE}/docs (Markdown: ${SITE.url}/docs.md)
- Template gallery: ${SITE.url}/${DEFAULT_LOCALE}/docs/templates (Markdown: ${SITE.url}/docs/templates.md)
- Every item: ${SITE.url}/${DEFAULT_LOCALE}/docs/<name>, and ${SITE.url}/docs/<name>.md for Markdown
- Languages: English (default), Arabic, French, Hindi. Every page lives under
  /<lang>/, e.g. ${SITE.url}/ar/docs/button. This reference is English only:
  the API it documents is the same in every language.
- Registry index: ${SITE.url}/r/registry.json — one item: ${SITE.url}/r/<name>.json

## Install

Two supported paths. Install the package and take fixes with a version bump:

\`\`\`bash
pnpm add @design-eg/ui react react-dom
pnpm add -D tailwindcss @tailwindcss/postcss
\`\`\`

Or copy the source into the project and own it:

\`\`\`bash
npx @design-eg/cli init
npx @design-eg/cli add button card dialog
\`\`\`

\`init\` writes \`design-eg.json\`, a \`cn()\` helper, and the token imports.
\`add\` resolves registry dependencies depth-first, so \`add data-table\` also
pulls \`table\`, \`checkbox\` and \`dropdown-menu\`. The shadcn CLI works too,
because every item is a shadcn registry document:

\`\`\`bash
npx shadcn@latest add ${SITE.url}/r/button.json
\`\`\`

Either way, import the stylesheet once, after Tailwind:

\`\`\`css
@import "tailwindcss";
@import "@design-eg/ui/styles.css";
\`\`\`

Then import from the barrel, or from a per-component subpath:

\`\`\`tsx
import { Button, Card, CardContent } from "@design-eg/ui";
import { Button as ButtonOnly } from "@design-eg/ui/button";
\`\`\`

Requirements: Node 20.9+, React 19+ (components use the React 19 ref-as-prop
signature), Tailwind CSS v4+ configured in CSS rather than \`tailwind.config.js\`.
Next.js consumers add \`transpilePackages: ["@design-eg/ui", "@design-eg/tokens"]\`.

## Theming

Everything is driven by attributes on \`<html>\`; there is no provider and no
context, so switching any of them is a one-line DOM write.

\`\`\`html
<html class="dark" data-brand="${tokens.defaultBrand}" data-density="comfortable" dir="rtl" lang="ar"></html>
\`\`\`

| Attribute | Values |
| --- | --- |
| \`class\` / \`data-theme\` | \`light\`, \`dark\` — nestable, so a dark hero can sit inside a light page |
| \`data-brand\` | ${brands.join(", ")} |
| \`data-density\` | \`compact\`, \`comfortable\`, \`spacious\` |
| \`dir\` | \`ltr\`, \`rtl\` |

Brands: ${brands.map((b) => `${b} (seed ${tokens.brands[b].seed})`).join(", ")}. Default brand: ${tokens.defaultBrand}.

\`\`\`ts
document.documentElement.classList.toggle("dark");
document.documentElement.dataset.brand = "neutral";
document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";
\`\`\`

## The token contract

**Three tiers, enforced.** Primitives (\`--brand-600\`, raw OKLCH ramp steps)
feed semantics (\`--primary\`, \`--border\`) feed component knobs
(\`--control-h-md\`, \`--sidebar-w\`). A component only ever references the
semantic and component tiers, which is why re-theming never means editing a
component. A raw colour, an off-scale palette class or a literal z-index fails
the token linter in CI.

**Semantic CSS variables** (shadcn-compatible names, each with a matching
\`-foreground\` where text sits on it):

${semanticKeys.map((k) => `--${k}`).join(", ")}.

In Tailwind these are plain utilities: \`bg-primary\`, \`text-muted-foreground\`,
\`border-border\`, \`ring-ring\`, \`bg-surface-2\`, \`text-destructive\`.

**Z-scale.** A closed scale; never write a literal z-index.

| Variable | Value | For |
| --- | --- | --- |
| \`--z-below\` | -1 | decorative layers behind their own container |
| \`--z-base\` | 0 | in-flow content |
| \`--z-raised\` | 10 | cards and hover lifts |
| \`--z-sticky\` | 100 | sticky headers and toolbars |
| \`--z-dropdown\` | 200 | menus and selects |
| \`--z-overlay\` | 300 | scrims |
| \`--z-modal\` | 400 | dialogs and sheets |
| \`--z-popover\` | 500 | popovers and hover cards |
| \`--z-toast\` | 600 | toasts |
| \`--z-tooltip\` | 700 | tooltips |

Written as \`z-(--z-modal)\`, not \`z-50\`.

**Density.** \`data-density\` sets \`--density-scale\` to 0.875, 1 or 1.125, and
every control height is derived from it: \`--control-h-sm\` = 2rem,
\`--control-h-md\` = 2.5rem, \`--control-h-lg\` = 3rem, each multiplied by the
scale. A control sizes itself with \`h-(--control-h-md)\`, never \`h-10\`, so the
whole UI tightens or relaxes from one attribute. Other component knobs:
\`--header-h\`, \`--sidebar-w\`, \`--sidebar-w-collapsed\`, \`--tap-min\`,
\`--icon-xs\`/\`-sm\`/\`-md\`/\`-lg\`, \`--focus-ring-w\`, \`--gutter\`, \`--card-p\`.

**Motion.** \`--duration-instant\` 100ms, \`--duration-fast\` 150ms,
\`--duration-normal\` 200ms, \`--duration-slow\` 300ms, \`--duration-slower\`
500ms — all forced to 0ms under \`prefers-reduced-motion\`. Animate behind
\`motion-safe:\`.

**Radii and elevation.** \`rounded-card\`, \`rounded-control\`, \`rounded-badge\`
rather than \`rounded-lg\`; \`shadow-1\`, \`shadow-2\`, \`shadow-3\` rather than
\`shadow-md\`. In dark mode elevation becomes a hairline ring instead of a
shadow, because shadows do not read on black.

**RTL is not a plugin.** Logical properties throughout: \`ms-*\`/\`me-*\` not
\`ml-*\`/\`mr-*\`, \`ps-*\`/\`pe-*\` not \`pl-*\`/\`pr-*\`, \`start-*\`/\`end-*\`
not \`left-*\`/\`right-*\`, \`text-start\`/\`text-end\` not \`text-left\`/
\`text-right\`. \`rtl:\` is used only where a transform genuinely needs
mirroring, such as a chevron. Component APIs follow the same rule: a Sheet takes
\`side="start" | "end"\`, not \`"left" | "right"\`. \`:lang(ar)\` switches to
\`--font-ar\` and opens up the line height, so Arabic and English are both
first-class.

**Fonts.** \`--font-body\`, \`--font-ar\`, \`--font-title\`, \`--font-code\`.
Point them at your own faces once in \`:root\`; nothing else needs to change.

## Accessibility

Keyboard behaviour, focus traps and ARIA come from Radix primitives rather than
hand-rolled handlers. Every interactive element has an accessible name, and an
icon-only button needs an explicit \`aria-label\`. Focus is always visible
(\`focus-visible:ring-2 focus-visible:ring-ring\`). Disabled uses
\`disabled:opacity-50 disabled:pointer-events-none\`; invalid uses the
\`aria-invalid:\` variants. The library ships axe fixtures in CI, and the token
compiler fails the build when a brand seed drops a text pair below WCAG AA.

## Registry

${REGISTRY_ITEMS.length} items, all served as stable public URLs:

- Index: ${SITE.url}/r/registry.json (shadcn \`registry.json\` schema)
- Item: ${SITE.url}/r/<name>.json (shadcn \`registry-item.json\` schema, including the file \`content\`)
- Name list: ${SITE.url}/r/index.json

An item's \`registryDependencies\` name other items in this same registry;
\`dependencies\` name npm packages. Both CLIs resolve them for you.

${group("Foundations", FOUNDATIONS)}

${group("Components", COMPONENTS)}

${group("Blocks", BLOCKS)}

${group("Page templates", TEMPLATES)}
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
