/**
 * The handful of rules that turn a generated registry entry into something a
 * docs page can show: which bucket it belongs to, what that bucket is called,
 * and how to install it. Plain ESM because two consumers need them — the docs
 * app through `./registry`, and `scripts/gen-md.mjs` under bare node before
 * `next build`. The types live in `./registry`.
 *
 * @typedef {import("./registry").DocsCategory} DocsCategory
 */
import { SITE_URL } from "./site-url.mjs";

/**
 * Templates and blocks are both `registry:block`, so the bucket comes from the
 * path the item copies to rather than from its registry type.
 *
 * @param {string} file
 * @param {string} type
 * @returns {DocsCategory}
 */
export function categorise(file, type) {
  if (file.startsWith("components/templates/")) return "template";
  if (file.startsWith("components/blocks/")) return "block";
  if (type === "registry:ui") return "component";
  return "foundation";
}

/** @type {Record<DocsCategory, string>} */
export const KIND_LABEL = {
  foundation: "Foundation",
  component: "Component",
  block: "Block",
  template: "Template",
};

/**
 * The CLI invocation without its runner, so a multi-package-manager widget can
 * put `npx`, `pnpm dlx`, `yarn dlx` or `bunx` in front of it.
 *
 * @param {string} name
 */
export function installExec(name) {
  return `@design-eg/cli add ${name}`;
}

/** @param {string} name */
export function installCommand(name) {
  return `npx ${installExec(name)}`;
}

/**
 * The stable public URL of an item's registry document.
 * @param {string} name
 */
export function registryItemUrl(name) {
  return `${SITE_URL}/r/${name}.json`;
}

/**
 * The same item through the shadcn CLI, which takes a URL rather than a name.
 * @param {string} name
 */
export function shadcnCommand(name) {
  return `npx shadcn@latest add ${registryItemUrl(name)}`;
}
