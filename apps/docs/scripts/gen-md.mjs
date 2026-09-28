/**
 * Markdown twin of every docs page.
 *
 * Assistants parse Markdown far better than rendered HTML, so every docs URL
 * also answers at that URL plus `.md`:
 *
 *   /docs            -> public/docs.md
 *   /docs/templates  -> public/docs/templates.md
 *   /docs/<name>     -> public/docs/<name>.md
 *
 * A route handler cannot own those paths without fighting app/docs/[slug],
 * so they are written as static files instead, the same way
 * packages/registry/build.mjs writes public/r/*.json. Next serves a file in
 * public/ only for its exact path, so /docs/button stays a prerendered page.
 *
 * Everything factual is read back out of the generated registry and out of the
 * example modules the pages themselves render, so a page and its Markdown twin
 * cannot drift. Run before `next build` — see the docs package.json.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exportName, getItemNotes } from "../lib/item-notes.mjs";
import {
  categorise,
  installCommand,
  KIND_LABEL,
  registryItemUrl,
  shadcnCommand,
} from "../lib/registry-meta.mjs";
import { SITE_URL } from "../lib/site-url.mjs";

/** The Markdown twins are English, so their links point at the English pages. */
const LANG = "en";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, "..");
const registryDir = join(appDir, "public", "r");
const examplesDir = join(appDir, "content", "examples");
const publicDir = join(appDir, "public");
const outDir = join(publicDir, "docs");

const NAME = "design-eg";
const TAGLINE = "A cinematic, RTL-first React design system.";

/** The buckets, in the order the sidebar and the docs index use. */
const CATEGORIES = /** @type {const} */ ([
  ["foundation", "Foundations"],
  ["component", "Components"],
  ["block", "Blocks"],
  ["template", "Page templates"],
]);

/** @param {string} name */
function exampleSource(name) {
  try {
    return readFileSync(join(examplesDir, `${name}.tsx`), "utf8").trimEnd();
  } catch {
    return null;
  }
}

/** Drops empty strings so a skipped section never leaves a double blank line. */
function sections(parts) {
  return parts.filter((part) => part !== "").join("\n\n");
}

/** @param {string[]} values */
function codeList(values) {
  return values.map((value) => `\`${value}\``).join(", ");
}

/**
 * Prose written for a person, rendered as Markdown: an unescaped `<Label>` or
 * `<button>` would be swallowed as raw HTML. Backtick spans are left alone,
 * because a backslash inside one is literal.
 *
 * @param {string} text
 */
function prose(text) {
  return text
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith("`") ? part : part.replace(/</g, "\\<")))
    .join("");
}

/** A Markdown table cell: a pipe or a newline would end the row early. */
function cell(text) {
  return prose(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/** The same, for a cell that is entirely one code span. */
function codeCell(text) {
  return `\`${text.replace(/\|/g, "\\|")}\``;
}

function loadItems() {
  const index = JSON.parse(readFileSync(join(registryDir, "registry.json"), "utf8"));
  const entries = Array.isArray(index.items) ? index.items : [];

  return entries
    .filter((entry) => typeof entry.name === "string")
    .map((entry) => {
      const file = entry.files?.[0]?.path ?? "";
      return {
        name: entry.name,
        type: entry.type ?? "registry:ui",
        title: entry.title ?? entry.name,
        description: entry.description ?? "",
        dependencies: entry.dependencies ?? [],
        registryDependencies: entry.registryDependencies ?? [],
        file,
        category: categorise(file, entry.type ?? "registry:ui"),
        href: `/docs/${entry.name}`,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The install trio, written out so the snippet works wherever it is pasted. */
function installSection(name) {
  return sections([
    "## Install",
    "Copy the source into your project with the design-eg CLI:",
    ["```bash", installCommand(name), "```"].join("\n"),
    "Or with the shadcn CLI, which takes the registry URL directly:",
    ["```bash", shadcnCommand(name), "```"].join("\n"),
    "Or skip copying and use the published package:",
    ["```bash", "pnpm add @design-eg/ui", "```"].join("\n"),
  ]);
}

function propsSection(notes) {
  if (!notes?.props?.length) return "";
  return sections([
    "## Props",
    [
      "| Prop | Type | Default | Description |",
      "| --- | --- | --- | --- |",
      ...notes.props.map(
        (prop) =>
          `| ${codeCell(prop.name)} | ${codeCell(prop.type)} | ${
            prop.defaultValue ? codeCell(prop.defaultValue) : "—"
          } | ${cell(prop.description)} |`,
      ),
    ].join("\n"),
    "Everything else is forwarded to the underlying element or Radix primitive.",
  ]);
}

function notesSection(notes) {
  if (!notes?.notes?.length) return "";
  return sections(["## Notes", notes.notes.map((note) => `- ${prose(note)}`).join("\n")]);
}

function dependenciesSection(item) {
  return sections([
    "## Dependencies",
    [
      `- npm: ${item.dependencies.length ? codeList(item.dependencies) : "none beyond React"}`,
      `- Registry: ${
        item.registryDependencies.length
          ? item.registryDependencies
              .map((dep) => `[\`${dep}\`](${SITE_URL}/docs/${dep}.md)`)
              .join(", ")
          : "standalone"
      }`,
    ].join("\n"),
    item.registryDependencies.length
      ? "Both CLIs resolve these for you: installing this item installs them too."
      : "",
  ]);
}

function footer() {
  return [
    "---",
    "",
    `${NAME} · MIT · [Docs index](${SITE_URL}/docs.md) · ` +
      `[Full reference](${SITE_URL}/llms-full.txt) · ` +
      `[Registry](${SITE_URL}/r/registry.json) · ` +
      `[Source](https://github.com/design-eg/design-eg)`,
  ].join("\n");
}

/** @param {ReturnType<typeof loadItems>[number]} item */
function itemPage(item) {
  const notes = getItemNotes(item.name);
  const parts = notes?.anatomy?.length ? notes.anatomy : [exportName(item.name, item.title)];
  const source = exampleSource(item.name);

  return (
    sections([
      `# ${item.title}`,
      item.description ? `> ${prose(item.description)}` : "",
      [
        `- Kind: ${KIND_LABEL[item.category]} (\`${item.type}\`)`,
        `- Registry name: \`${item.name}\``,
        item.file ? `- Copies to: \`${item.file}\`` : "",
        `- Page: ${SITE_URL}/${LANG}${item.href}`,
        `- Registry item: ${registryItemUrl(item.name)}`,
      ]
        .filter(Boolean)
        .join("\n"),
      installSection(item.name),
      "## Import",
      ["```tsx", `import { ${parts.join(", ")} } from "@design-eg/ui";`, "```"].join("\n"),
      notes?.anatomy?.length
        ? sections([
            "## Anatomy",
            "Exported parts, in composition order:",
            parts.map((part) => `- \`${part}\``).join("\n"),
          ])
        : "",
      source
        ? sections([
            "## Example",
            "A complete module — the imports are part of the snippet, so it compiles as it stands:",
            ["```tsx", source, "```"].join("\n"),
          ])
        : sections([
            "## Example",
            "No live demo for this item yet. Install it with the command above; the props are typed, so an editor will guide the composition.",
          ]),
      propsSection(notes),
      notesSection(notes),
      dependenciesSection(item),
      "## Theming",
      `Colour, radius, control height and direction all come from the token layer rather than from this component. Set \`class="dark"\`, \`data-brand\`, \`data-density\` and \`dir\` on \`<html>\`; see ${SITE_URL}/llms-full.txt for the full token contract.`,
      footer(),
    ]) + "\n"
  );
}

/** @param {ReturnType<typeof loadItems>} items */
function indexPage(items) {
  const counts = Object.fromEntries(
    CATEGORIES.map(([category]) => [category, items.filter((i) => i.category === category).length]),
  );

  const groups = CATEGORIES.map(([category, label]) => {
    const group = items.filter((item) => item.category === category);
    if (group.length === 0) return "";
    return sections([
      `## ${label} (${group.length})`,
      group
        .map(
          (item) =>
            `- [${item.title}](${SITE_URL}/docs/${item.name}.md) — \`${item.name}\`${
              item.description ? `: ${prose(item.description)}` : ""
            }`,
        )
        .join("\n"),
    ]);
  });

  return (
    sections([
      `# ${NAME} documentation`,
      `> ${TAGLINE} ${counts.component} primitives, ${counts.block} composite blocks and ${counts.template} page templates, each with a live preview, an install command and a Markdown twin.`,
      [
        `- Rendered version of this page: ${SITE_URL}/${LANG}/docs`,
        `- Template gallery: ${SITE_URL}/docs/templates.md`,
        `- Every item: \`${SITE_URL}/docs/<name>.md\``,
        `- Whole API surface in one fetch: ${SITE_URL}/llms-full.txt (short map: ${SITE_URL}/llms.txt)`,
        `- Registry: ${SITE_URL}/r/registry.json, one item at \`${SITE_URL}/r/<name>.json\``,
      ].join("\n"),
      "## Install",
      "Install the package and take fixes with a version bump:",
      [
        "```bash",
        "pnpm add @design-eg/ui react react-dom",
        "pnpm add -D tailwindcss @tailwindcss/postcss",
        "```",
      ].join("\n"),
      "Or copy the source into the project and own it:",
      [
        "```bash",
        "npx @design-eg/cli init",
        "npx @design-eg/cli add button card dialog",
        "```",
      ].join("\n"),
      "Either way, import the stylesheet once, after Tailwind:",
      ["```css", '@import "tailwindcss";', '@import "@design-eg/ui/styles.css";', "```"].join("\n"),
      "Then a page is ordinary React:",
      [
        "```tsx",
        'import { Button, Card, CardContent } from "@design-eg/ui";',
        "",
        "export default function Page() {",
        "  return (",
        "    <Card>",
        '      <CardContent className="flex items-center justify-between gap-4">',
        "        <p>Ready when you are.</p>",
        '        <Button size="lg">Continue</Button>',
        "      </CardContent>",
        "    </Card>",
        "  );",
        "}",
        "```",
      ].join("\n"),
      'Requirements: Node 20.9+, React 19+, Tailwind CSS v4+ configured in CSS. Next.js consumers add `transpilePackages: ["@design-eg/ui", "@design-eg/tokens"]`.',
      "## Theming",
      'Attributes on `<html>` drive everything, with no provider and no context: `class="dark" | "light"`, `data-brand`, `data-density="compact" | "comfortable" | "spacious"`, `dir="ltr" | "rtl"`. The library is RTL-first, so components use logical properties throughout and a Sheet opens from `side="start" | "end"` rather than left or right.',
      ...groups,
      footer(),
    ]) + "\n"
  );
}

/** @param {ReturnType<typeof loadItems>} items */
function templatesPage(items) {
  const templates = items.filter((item) => item.category === "template");

  const entries = templates.map((item) => {
    const source = exampleSource(item.name);
    const notes = getItemNotes(item.name);
    const parts = notes?.anatomy?.length ? notes.anatomy : [exportName(item.name, item.title)];
    return sections([
      `## ${item.title}`,
      item.description ? `> ${prose(item.description)}` : "",
      [
        `- Registry name: \`${item.name}\``,
        `- Page: ${SITE_URL}${item.href} (Markdown: ${SITE_URL}${item.href}.md)`,
        `- Install: \`${installCommand(item.name)}\``,
      ].join("\n"),
      ["```tsx", `import { ${parts.join(", ")} } from "@design-eg/ui";`, "```"].join("\n"),
      source ? ["```tsx", source, "```"].join("\n") : "",
    ]);
  });

  return (
    sections([
      "# Template gallery",
      `> ${templates.length} whole pages, each composed only from primitives and blocks in this registry. They are fully controlled: they render and validate, and hand the values back to you rather than navigating by themselves.`,
      [
        `- Rendered version of this page: ${SITE_URL}/docs/templates`,
        `- Docs index: ${SITE_URL}/docs.md`,
        `- Whole API surface in one fetch: ${SITE_URL}/llms-full.txt`,
      ].join("\n"),
      ...entries,
      footer(),
    ]) + "\n"
  );
}

const items = loadItems();

// The directory holds nothing but generated Markdown, so start from empty and
// a renamed or deleted item cannot leave a stale page behind.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

writeFileSync(join(publicDir, "docs.md"), indexPage(items), "utf8");
for (const item of items) {
  writeFileSync(join(outDir, `${item.name}.md`), itemPage(item), "utf8");
}
// Last, so the gallery wins if a registry item is ever called `templates` —
// /docs/templates is a real route and its twin has to match it.
writeFileSync(join(outDir, "templates.md"), templatesPage(items), "utf8");

const written = readdirSync(outDir).length + 1;
console.log(`docs markdown: ${written} files -> apps/docs/public (/docs.md, /docs/*.md)`);
