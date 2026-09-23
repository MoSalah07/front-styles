import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import kleur from "kleur";
import prompts from "prompts";
import { CONFIG_FILE, DEFAULT_CONFIG, type DesignEgConfig } from "../lib/constants.js";
import { detectCssFile, detectSrcDir, readConfig, writeConfig, writeFile } from "../lib/fs.js";
import { detectPackageManager, installCommand, run } from "../lib/pm.js";

interface InitOptions {
  yes: boolean;
  cwd: string;
  install: boolean;
}

const CSS_IMPORTS = `@import "@design-eg/tokens/css";
@import "@design-eg/tokens/tailwind.css";`;

const CSS_BASE = `
@layer base {
  * {
    border-color: var(--border);
    outline-color: color-mix(in oklab, var(--ring) 50%, transparent);
  }
  html {
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
  :lang(ar) {
    font-family: var(--font-ar);
    line-height: var(--lh-ar-body);
  }
}
`;

const UTILS_TS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

export async function init(opts: InitOptions) {
  const cwd = opts.cwd;
  if (!existsSync(join(cwd, "package.json"))) {
    console.log(kleur.red("No package.json here.") + " Run this inside a React project.");
    process.exit(1);
  }
  if (readConfig(cwd) && !opts.yes) {
    const { again } = await prompts({
      type: "confirm",
      name: "again",
      message: `${CONFIG_FILE} already exists. Re-run init and overwrite it?`,
      initial: false,
    });
    if (!again) return;
  }

  const src = detectSrcDir(cwd);
  const css = detectCssFile(cwd) ?? `${src}app/globals.css`;
  const defaults: DesignEgConfig = {
    ...DEFAULT_CONFIG,
    paths: {
      ui: `${src}components/ui`,
      lib: `${src}lib`,
      hooks: `${src}hooks`,
      css,
    },
  };

  let config = defaults;
  if (!opts.yes) {
    const answers = await prompts([
      {
        type: "text",
        name: "css",
        message: "Global CSS file (imports tailwindcss)",
        initial: defaults.paths.css,
      },
      { type: "text", name: "ui", message: "Folder for components", initial: defaults.paths.ui },
      {
        type: "text",
        name: "lib",
        message: "Folder for lib files (cn helper)",
        initial: defaults.paths.lib,
      },
      {
        type: "text",
        name: "utils",
        message: "Import alias for utils",
        initial: defaults.aliases.utils,
      },
    ]);
    if (answers.css === undefined) return;
    config = {
      ...defaults,
      paths: { ...defaults.paths, css: answers.css, ui: answers.ui, lib: answers.lib },
      aliases: { ...defaults.aliases, utils: answers.utils },
    };
  }

  writeConfig(cwd, config);
  console.log(kleur.green("✔") + ` wrote ${CONFIG_FILE}`);

  // cn() helper
  const utilsFile = join(cwd, config.paths.lib, "utils.ts");
  if (!existsSync(utilsFile)) {
    writeFile(utilsFile, UTILS_TS);
    console.log(kleur.green("✔") + ` wrote ${config.paths.lib}/utils.ts`);
  }

  // CSS wiring
  const cssFile = join(cwd, config.paths.css);
  let cssContent = existsSync(cssFile) ? readFileSync(cssFile, "utf8") : `@import "tailwindcss";\n`;
  if (!cssContent.includes("@design-eg/tokens/css")) {
    cssContent = cssContent.includes('@import "tailwindcss"')
      ? cssContent.replace(/@import\s+["']tailwindcss["'];?/, (m) => `${m}\n${CSS_IMPORTS}`)
      : `@import "tailwindcss";\n${CSS_IMPORTS}\n${cssContent}`;
    if (!/@layer base/.test(cssContent)) cssContent += CSS_BASE;
    writeFile(cssFile, cssContent);
    console.log(kleur.green("✔") + ` updated ${config.paths.css}`);
  }

  // dependencies
  const deps = [
    "@design-eg/tokens",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    "radix-ui",
  ];
  const pm = detectPackageManager(cwd);
  if (opts.install) {
    await run(installCommand(pm, deps), cwd);
  } else {
    console.log(kleur.dim("Install dependencies:\n  ") + installCommand(pm, deps).join(" "));
  }

  console.log();
  console.log(
    kleur.bold("Done.") + " Add components with " + kleur.cyan("design-eg add button card"),
  );
  console.log(kleur.dim(`Switch theme with <html class="dark" data-brand="crimson">`));
}
