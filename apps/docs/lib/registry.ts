import fs from "node:fs";
import path from "node:path";
import { categorise } from "./registry-meta.mjs";

/**
 * Reads the generated shadcn registry at build time so the docs site never
 * duplicates a title, a description or a dependency list by hand.
 */

export type DocsCategory = "foundation" | "component" | "block" | "template";

export interface RegistryItem {
  /** Registry name, which is also the docs slug and the CLI argument. */
  name: string;
  /** Registry type, e.g. `registry:ui`. */
  type: string;
  title: string;
  description: string;
  /** npm packages the item needs. */
  dependencies: string[];
  /** Other registry items the item needs. */
  registryDependencies: string[];
  /** Source path inside a consumer project, e.g. `components/ui/button.tsx`. */
  file: string;
  category: DocsCategory;
  /** Sidebar group heading. */
  group: string;
  href: string;
}

export interface NavGroup {
  id: string;
  label: string;
  category: DocsCategory;
  items: { name: string; title: string; href: string }[];
}

/** Sub-groups for primitives, so a 37-item list reads as six short ones. */
const COMPONENT_GROUPS: Record<string, string> = {
  button: "Forms",
  input: "Forms",
  textarea: "Forms",
  label: "Forms",
  checkbox: "Forms",
  "radio-group": "Forms",
  select: "Forms",
  switch: "Forms",
  slider: "Forms",
  toggle: "Forms",
  "toggle-group": "Forms",
  form: "Forms",
  "input-otp": "Forms",

  dialog: "Overlays",
  "alert-dialog": "Overlays",
  sheet: "Overlays",
  popover: "Overlays",
  "dropdown-menu": "Overlays",
  "context-menu": "Overlays",
  "hover-card": "Overlays",
  tooltip: "Overlays",
  command: "Overlays",

  tabs: "Navigation",
  accordion: "Navigation",
  collapsible: "Navigation",
  breadcrumb: "Navigation",
  pagination: "Navigation",
  "scroll-area": "Navigation",

  table: "Data display",
  card: "Data display",
  badge: "Data display",
  avatar: "Data display",
  separator: "Data display",
  skeleton: "Data display",
  progress: "Data display",

  alert: "Feedback",
  sonner: "Feedback",
  "copy-button": "Feedback",
};

const GROUP_ORDER = [
  "Foundations",
  "Forms",
  "Overlays",
  "Navigation",
  "Data display",
  "Feedback",
  "Components",
  "Blocks",
  "Templates",
];

const GROUP_CATEGORY: Record<string, DocsCategory> = {
  Foundations: "foundation",
  Blocks: "block",
  Templates: "template",
};

function slugifyGroup(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function titleFromName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function loadRegistry(): RegistryItem[] {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "public", "r", "registry.json"),
    "utf8",
  ) as string;
  const parsed = JSON.parse(raw) as { items?: unknown };
  const items = Array.isArray(parsed.items) ? parsed.items : [];

  return items
    .map((entry) => entry as Record<string, unknown>)
    .filter((entry) => typeof entry.name === "string")
    .map((entry) => {
      const name = entry.name as string;
      const type = typeof entry.type === "string" ? entry.type : "registry:ui";
      const files = Array.isArray(entry.files) ? (entry.files as Record<string, unknown>[]) : [];
      const first = files[0];
      const file = first && typeof first.path === "string" ? first.path : "";
      const category = categorise(file, type);
      const group =
        category === "component"
          ? (COMPONENT_GROUPS[name] ?? "Components")
          : category === "block"
            ? "Blocks"
            : category === "template"
              ? "Templates"
              : "Foundations";

      return {
        name,
        type,
        title: typeof entry.title === "string" ? entry.title : titleFromName(name),
        description: typeof entry.description === "string" ? entry.description : "",
        dependencies: asStringArray(entry.dependencies),
        registryDependencies: asStringArray(entry.registryDependencies),
        file,
        category,
        group,
        href: `/docs/${name}`,
      } satisfies RegistryItem;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const REGISTRY_ITEMS: RegistryItem[] = loadRegistry();

const BY_NAME = new Map(REGISTRY_ITEMS.map((item) => [item.name, item]));

export function getRegistryItem(name: string): RegistryItem | undefined {
  return BY_NAME.get(name);
}

export function itemsByCategory(category: DocsCategory): RegistryItem[] {
  return REGISTRY_ITEMS.filter((item) => item.category === category);
}

export const COMPONENTS = itemsByCategory("component");
export const BLOCKS = itemsByCategory("block");
export const TEMPLATES = itemsByCategory("template");

/** Sidebar model: ordered groups, each with its items in alphabetical order. */
export const NAV_GROUPS: NavGroup[] = GROUP_ORDER.flatMap((label) => {
  const items = REGISTRY_ITEMS.filter((item) => item.group === label);
  if (items.length === 0) return [];
  const category = GROUP_CATEGORY[label] ?? "component";
  return [
    {
      id: slugifyGroup(label),
      label,
      category,
      items: items.map((item) => ({ name: item.name, title: item.title, href: item.href })),
    },
  ];
});

/** Every docs route this site generates, for the sitemap. */
export const DOCS_ROUTES: string[] = [
  "/docs",
  "/docs/templates",
  ...REGISTRY_ITEMS.map((item) => item.href),
];

/**
 * The Markdown twin of every docs route, written into `public/` by
 * `scripts/gen-md.mjs`. Assistants parse these far better than rendered HTML.
 */
export const DOCS_MD_ROUTES: string[] = DOCS_ROUTES.map((route) => `${route}.md`);

export {
  installCommand,
  installExec,
  KIND_LABEL,
  registryItemUrl,
  shadcnCommand,
} from "./registry-meta.mjs";

export interface RegistryFile {
  path: string;
  type: string;
  content: string;
  target: string;
}

const FILE_CACHE = new Map<string, RegistryFile[]>();

/**
 * The item document rather than the index: only `r/<name>.json` carries the
 * source, because the index strips `content` to stay small.
 */
export function getItemFiles(name: string): RegistryFile[] {
  const cached = FILE_CACHE.get(name);
  if (cached) return cached;

  let files: RegistryFile[] = [];
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "public", "r", `${name}.json`), "utf8");
    const parsed = JSON.parse(raw) as { files?: unknown };
    files = (Array.isArray(parsed.files) ? parsed.files : [])
      .map((entry) => entry as Record<string, unknown>)
      .filter((entry) => typeof entry.path === "string" && typeof entry.content === "string")
      .map((entry) => ({
        path: entry.path as string,
        type: typeof entry.type === "string" ? entry.type : "registry:ui",
        content: entry.content as string,
        target: typeof entry.target === "string" ? entry.target : (entry.path as string),
      }));
  } catch {
    files = [];
  }

  FILE_CACHE.set(name, files);
  return files;
}
