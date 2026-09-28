import {
  getBrandTokens,
  getItem,
  HOMEPAGE,
  installCommand,
  listBrands,
  listItems,
  resolveDependencies,
  search,
  TOKENS,
  VERSION,
  type Category,
} from "./catalogue";

/**
 * The tools the server exposes, as data.
 *
 * Each one is a schema plus a handler that returns text. Keeping them in one
 * table means `tools/list` and `tools/call` cannot drift apart, and it lets the
 * whole surface be tested without a transport.
 *
 * Every handler returns Markdown rather than JSON. The consumer is a language
 * model: a fenced code block and a heading are read more reliably than a
 * nested object, and the source of a component is the answer to most of these
 * questions anyway.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => string;
}

const CATEGORIES: Category[] = ["component", "block", "template", "hook", "lib"];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") return [value];
  return [];
}

/** One line per item, the shape an assistant can scan and then drill into. */
function line(name: string, title: string, description: string): string {
  return `- \`${name}\` — **${title}**: ${description}`;
}

function notFound(name: string): string {
  const near = search(name, 5);
  const hint = near.length
    ? `\n\nDid you mean: ${near.map((i) => `\`${i.name}\``).join(", ")}?`
    : "";
  return `No registry item called \`${name}\`.${hint}`;
}

export const TOOLS: ToolDefinition[] = [
  {
    name: "list_items",
    description:
      "List every component, block, page template, hook and lib helper in the design-eg registry. Filter by category to narrow it.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: CATEGORIES,
          description: "Restrict to one kind of item. Omit for everything.",
        },
      },
    },
    handler: (args) => {
      const category = asString(args.category) as Category | "";
      const items = listItems(category || undefined);
      if (!items.length) return `No items in category \`${category}\`.`;

      const heading = category ? `${items.length} ${category}s` : `${items.length} registry items`;
      return [
        `# design-eg ${heading} (v${VERSION})`,
        "",
        ...items.map((item) => line(item.name, item.title, item.description)),
      ].join("\n");
    },
  },

  {
    name: "search_items",
    description:
      "Find registry items by name, title or description. Use this before guessing whether a component exists.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "What to look for, e.g. `table`, `sign in`, `toast`.",
        },
        limit: { type: "number", description: "Maximum results. Defaults to 10." },
      },
      required: ["query"],
    },
    handler: (args) => {
      const query = asString(args.query);
      const limit = typeof args.limit === "number" ? args.limit : 10;
      const hits = search(query, limit);

      if (!hits.length) return `Nothing in the registry matches "${query}".`;
      return [
        `# ${hits.length} match${hits.length === 1 ? "" : "es"} for "${query}"`,
        "",
        ...hits.map((item) => line(item.name, item.title, item.description)),
      ].join("\n");
    },
  },

  {
    name: "get_item",
    description:
      "The full record for one registry item: description, dependencies, install command and — unless you turn it off — its complete source.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Registry name, e.g. `button`, `data-table`." },
        includeSource: {
          type: "boolean",
          description: "Include the file contents. Defaults to true.",
        },
      },
      required: ["name"],
    },
    handler: (args) => {
      const name = asString(args.name);
      const item = getItem(name);
      if (!item) return notFound(name);

      const includeSource = args.includeSource !== false;
      const transitive = resolveDependencies([item.name]);

      const out = [
        `# ${item.title} (\`${item.name}\`)`,
        "",
        item.description,
        "",
        `- Category: ${item.category}`,
        `- Install: \`${installCommand([item.name])}\``,
        `- Docs: ${HOMEPAGE}/en/docs/${item.name}`,
      ];

      if (item.dependencies.length) {
        out.push(`- npm dependencies: ${item.dependencies.map((d) => `\`${d}\``).join(", ")}`);
      }
      if (transitive.length) {
        out.push(`- Also installs: ${transitive.map((d) => `\`${d}\``).join(", ")}`);
      }

      if (includeSource) {
        for (const file of item.files) {
          out.push("", `## ${file.target}`, "", "```tsx", file.content.trimEnd(), "```");
        }
      }

      return out.join("\n");
    },
  },

  {
    name: "get_install_plan",
    description:
      "Everything needed to add a set of items to a project: the command, the registry items it pulls in transitively, and the npm packages they need.",
    inputSchema: {
      type: "object",
      properties: {
        names: {
          type: "array",
          items: { type: "string" },
          description: "Registry names to install.",
        },
        packageManager: {
          type: "string",
          enum: ["npm", "pnpm", "yarn", "bun"],
          description: "Defaults to pnpm.",
        },
      },
      required: ["names"],
    },
    handler: (args) => {
      const names = asStringArray(args.names);
      if (!names.length) return "Pass at least one registry name.";

      const unknown = names.filter((name) => !getItem(name));
      if (unknown.length) return unknown.map(notFound).join("\n\n");

      const manager = asString(args.packageManager, "pnpm");
      const transitive = resolveDependencies(names);
      const npm = [
        ...new Set([...names, ...transitive].flatMap((name) => getItem(name)?.dependencies ?? [])),
      ].sort();

      const out = [
        `# Installing ${names.map((n) => `\`${n}\``).join(", ")}`,
        "",
        "```bash",
        installCommand(names, manager),
        "```",
        "",
        // The CLI resolves these itself; listing them is so the assistant can
        // say what is about to appear in the project rather than be surprised.
        transitive.length
          ? `The CLI also copies: ${transitive.map((d) => `\`${d}\``).join(", ")}.`
          : "No other registry items are needed.",
      ];

      if (npm.length) {
        out.push("", `npm packages required: ${npm.map((d) => `\`${d}\``).join(", ")}.`);
      }

      return out.join("\n");
    },
  },

  {
    name: "list_brands",
    description:
      "The brands the token layer compiles: the seed colour, corner radius and font stacks of each.",
    inputSchema: { type: "object", properties: {} },
    handler: () => {
      const brands = listBrands();
      return [
        `# ${brands.length} brands (tokens v${TOKENS.version})`,
        "",
        `Default: \`${TOKENS.defaultBrand}\`. Switch with \`data-brand\` on \`<html>\`.`,
        "",
        ...brands.map(
          (brand) =>
            `- \`${brand.name}\` — **${brand.label}**, seed \`${brand.seed}\`, radius \`${brand.radius}\`. ${brand.description}`,
        ),
      ].join("\n");
    },
  },

  {
    name: "get_tokens",
    description:
      "Every semantic design token for one brand in one colour mode, already resolved to a colour. Use this instead of guessing what `--primary` is.",
    inputSchema: {
      type: "object",
      properties: {
        brand: { type: "string", description: "Brand name. Defaults to the default brand." },
        mode: { type: "string", enum: ["light", "dark"], description: "Defaults to dark." },
      },
    },
    handler: (args) => {
      const brand = asString(args.brand, TOKENS.defaultBrand);
      const mode = asString(args.mode, "dark") === "light" ? "light" : "dark";
      const tokens = getBrandTokens(brand, mode);

      if (!tokens) {
        const known = Object.keys(TOKENS.brands)
          .map((b) => `\`${b}\``)
          .join(", ");
        return `No brand called \`${brand}\`. Known brands: ${known}.`;
      }

      // Both forms, because they answer different questions: the `var()` is
      // what keeps a stylesheet brand-switchable, and the hex is what an
      // assistant needs when it is asked what the colour actually is.
      return [
        `# \`${brand}\` tokens — ${mode} mode`,
        "",
        "Write the `var()` form: it follows `data-brand` and the colour mode.",
        "The hex is the resolved value for this brand and mode only.",
        "",
        "```css",
        ...Object.entries(tokens).map(
          ([key, value]) => `--${key}: ${value.css}; /* ${value.hex} */`,
        ),
        "```",
      ].join("\n");
    },
  },
];

export const TOOLS_BY_NAME = new Map(TOOLS.map((tool) => [tool.name, tool]));

/** The `tools/list` payload: the table above minus the handlers. */
export function toolManifest() {
  return TOOLS.map(({ name, description, inputSchema }) => ({
    name,
    description,
    inputSchema,
  }));
}
