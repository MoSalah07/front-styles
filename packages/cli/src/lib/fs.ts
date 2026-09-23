import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { CONFIG_FILE, DEFAULT_CONFIG, type DesignEgConfig } from "./constants.js";

export function readJson<T>(file: string): T | null {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

export function writeFile(file: string, content: string) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, "utf8");
}

export function readConfig(cwd: string): DesignEgConfig | null {
  const cfg = readJson<Partial<DesignEgConfig>>(join(cwd, CONFIG_FILE));
  if (!cfg) return null;
  return {
    ...DEFAULT_CONFIG,
    ...cfg,
    paths: { ...DEFAULT_CONFIG.paths, ...(cfg.paths ?? {}) },
    aliases: { ...DEFAULT_CONFIG.aliases, ...(cfg.aliases ?? {}) },
  };
}

export function writeConfig(cwd: string, config: DesignEgConfig) {
  writeFile(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
}

/** Detects whether the project uses a `src/` root and returns the prefix ("src/" or ""). */
export function detectSrcDir(cwd: string): string {
  const hasSrcApp = existsSync(join(cwd, "src", "app")) || existsSync(join(cwd, "src", "pages"));
  const hasRootApp = existsSync(join(cwd, "app")) || existsSync(join(cwd, "pages"));
  if (hasSrcApp && !hasRootApp) return "src/";
  if (!hasRootApp && existsSync(join(cwd, "src"))) return "src/";
  return "";
}

/** Finds the first stylesheet that imports Tailwind, if any. */
export function detectCssFile(cwd: string): string | null {
  const candidates = [
    "app/globals.css",
    "src/app/globals.css",
    "src/index.css",
    "src/styles/globals.css",
    "styles/globals.css",
    "src/global.css",
    "app/app.css",
  ];
  for (const c of candidates) {
    const f = join(cwd, c);
    if (existsSync(f) && /@import\s+["']tailwindcss["']/.test(readFileSync(f, "utf8"))) return c;
  }
  for (const c of candidates) if (existsSync(join(cwd, c))) return c;
  return null;
}
