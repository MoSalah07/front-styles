import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import type { RegistryItem } from "./constants.js";

function isUrl(s: string) {
  return /^https?:\/\//.test(s);
}

export async function fetchItem(
  registry: string,
  name: string,
  cwd: string,
): Promise<RegistryItem> {
  if (isUrl(registry)) {
    const url = `${registry.replace(/\/$/, "")}/${name}.json`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`"${name}" not found in registry (${res.status} ${url})`);
    return (await res.json()) as RegistryItem;
  }
  const dir = isAbsolute(registry) ? registry : resolve(cwd, registry);
  const file = join(dir, `${name}.json`);
  if (!existsSync(file)) throw new Error(`"${name}" not found in local registry (${file})`);
  return JSON.parse(readFileSync(file, "utf8")) as RegistryItem;
}

/** Resolves an item and all of its registry dependencies, depth-first, de-duplicated. */
export async function resolveTree(
  registry: string,
  names: string[],
  cwd: string,
): Promise<RegistryItem[]> {
  const seen = new Map<string, RegistryItem>();
  const visit = async (name: string) => {
    if (seen.has(name)) return;
    const item = await fetchItem(registry, name, cwd);
    seen.set(name, item);
    for (const dep of item.registryDependencies ?? []) await visit(dep);
  };
  for (const n of names) await visit(n);
  // dependencies first, so `utils` lands before the components that import it
  return [...seen.values()].reverse();
}
