#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { VERSION } from "./lib/constants.js";

const program = new Command()
  .name("design-eg")
  .description("design-eg: tokens, Tailwind v4 setup and copy-paste components for React")
  .version(VERSION, "-v, --version");

program
  .command("init")
  .description("Set up tokens, Tailwind bridge and the cn() helper in the current project")
  .option("-y, --yes", "accept defaults without prompting", false)
  .option("-c, --cwd <path>", "project directory", process.cwd())
  .option("--no-install", "skip installing npm dependencies")
  .action(init);

program
  .command("add")
  .description("Copy one or more components from the registry into your project")
  .argument("[components...]", "component names, e.g. button card")
  .option("-y, --yes", "skip confirmation", false)
  .option("-o, --overwrite", "overwrite existing files", false)
  .option("-c, --cwd <path>", "project directory", process.cwd())
  .option("-r, --registry <url>", "registry base URL or local folder")
  .option("--no-install", "skip installing npm dependencies")
  .action(add);

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
