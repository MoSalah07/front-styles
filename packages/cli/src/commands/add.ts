import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import kleur from "kleur";
import prompts from "prompts";
import type { RegistryFile, RegistryItem } from "../lib/constants.js";
import { readConfig, writeFile } from "../lib/fs.js";
import { detectPackageManager, installCommand, run } from "../lib/pm.js";
import { resolveTree } from "../lib/registry.js";

interface AddOptions {
  yes: boolean;
  overwrite: boolean;
  cwd: string;
  registry?: string;
  install: boolean;
}

function targetFor(
  file: RegistryFile,
  item: RegistryItem,
  paths: { ui: string; lib: string; hooks: string },
) {
  if (file.target) return file.target;
  const name = basename(file.path);
  switch (file.type ?? item.type) {
    case "registry:lib":
      return join(paths.lib, name);
    case "registry:hook":
      return join(paths.hooks, name);
    case "registry:block":
      return join(paths.ui, "..", "blocks", name);
    default:
      return join(paths.ui, name);
  }
}

export async function add(components: string[], opts: AddOptions) {
  const config = readConfig(opts.cwd);
  if (!config) {
    console.log(
      kleur.red("No design-eg.json found.") + " Run " + kleur.cyan("design-eg init") + " first.",
    );
    process.exit(1);
  }
  if (!components.length) {
    console.log(
      kleur.yellow("Nothing to add.") + " Example: " + kleur.cyan("design-eg add button card"),
    );
    return;
  }

  const registry = opts.registry ?? config.registry;
  const srcPrefix =
    existsSync(join(opts.cwd, "src")) && !existsSync(join(opts.cwd, config.paths.ui)) ? "src/" : "";
  const paths = {
    ui: srcPrefix + config.paths.ui,
    lib: srcPrefix + config.paths.lib,
    hooks: srcPrefix + config.paths.hooks,
  };

  console.log(kleur.dim(`registry: ${registry}`));
  const items = await resolveTree(registry, components, opts.cwd);

  const plan: { item: RegistryItem; file: RegistryFile; target: string; exists: boolean }[] = [];
  for (const item of items) {
    for (const file of item.files) {
      const target = targetFor(file, item, paths);
      plan.push({ item, file, target, exists: existsSync(join(opts.cwd, target)) });
    }
  }

  console.log();
  for (const p of plan) {
    const flag = p.exists
      ? opts.overwrite
        ? kleur.yellow(" (overwrite)")
        : kleur.dim(" (skip, exists)")
      : "";
    // join() yields backslashes on Windows; show posix paths so the list reads consistently
    console.log(`  ${kleur.green("+")} ${p.target.replace(/\\/g, "/")}${flag}`);
  }
  console.log();

  if (!opts.yes) {
    const { ok } = await prompts({
      type: "confirm",
      name: "ok",
      message: "Write these files?",
      initial: true,
    });
    if (!ok) return;
  }

  let written = 0;
  for (const p of plan) {
    if (p.exists && !opts.overwrite) continue;
    writeFile(join(opts.cwd, p.target), p.file.content);
    written++;
  }
  console.log(kleur.green(`✔ wrote ${written} file(s)`));

  const deps = [...new Set(items.flatMap((i) => i.dependencies ?? []))];
  const devDeps = [...new Set(items.flatMap((i) => i.devDependencies ?? []))];
  if (deps.length || devDeps.length) {
    const pm = detectPackageManager(opts.cwd);
    if (opts.install) {
      if (deps.length) await run(installCommand(pm, deps), opts.cwd);
      if (devDeps.length) await run(installCommand(pm, devDeps, true), opts.cwd);
    } else {
      console.log(kleur.dim("Install dependencies:"));
      if (deps.length) console.log("  " + installCommand(pm, deps).join(" "));
      if (devDeps.length) console.log("  " + installCommand(pm, devDeps, true).join(" "));
    }
  }
}
