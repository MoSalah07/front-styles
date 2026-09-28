import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { targetFor } from "./commands/add.js";
import { DEFAULT_CONFIG, type RegistryFile, type RegistryItem } from "./lib/constants.js";
import { detectCssFile, detectSrcDir, readConfig, writeConfig } from "./lib/fs.js";
import { detectPackageManager, installCommand } from "./lib/pm.js";
import { resolveTree } from "./lib/registry.js";

/**
 * The CLI writes files into somebody else's repository, so the parts worth
 * testing are the ones that decide *where*: which package manager is in use,
 * whether the project has a `src/` root, and what path a registry file maps to.
 * Those are all pure functions over a directory, which a temp directory can
 * stand in for.
 */

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "design-eg-cli-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

/** Creates a file, and any folders above it. */
function file(relative: string, contents = "") {
  const path = join(dir, relative);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, contents);
}

describe("package manager", () => {
  it.each([
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
  ] as const)("detects %s as %s", (lockfile, expected) => {
    file(lockfile);
    expect(detectPackageManager(dir)).toBe(expected);
  });

  it("falls back to npm when there is no lockfile", () => {
    // The env var is the other signal, and a stray one from the outer process
    // would make this pass for the wrong reason.
    const saved = process.env.npm_config_user_agent;
    delete process.env.npm_config_user_agent;
    try {
      expect(detectPackageManager(dir)).toBe("npm");
    } finally {
      if (saved !== undefined) process.env.npm_config_user_agent = saved;
    }
  });

  it.each([
    ["pnpm", ["pnpm", "add", "clsx"]],
    ["yarn", ["yarn", "add", "clsx"]],
    ["bun", ["bun", "add", "clsx"]],
    ["npm", ["npm", "install", "clsx"]],
  ] as const)("builds the %s install command", (pm, expected) => {
    expect(installCommand(pm, ["clsx"])).toEqual(expected);
  });

  it("uses each manager's own dev flag", () => {
    expect(installCommand("pnpm", ["vitest"], true)).toEqual(["pnpm", "add", "-D", "vitest"]);
    // npm is the odd one out, and getting it wrong installs a dev tool into
    // the consumer's production dependencies.
    expect(installCommand("npm", ["vitest"], true)).toEqual([
      "npm",
      "install",
      "--save-dev",
      "vitest",
    ]);
  });
});

describe("project layout", () => {
  it("finds a src root", () => {
    file("src/app/page.tsx");
    expect(detectSrcDir(dir)).toBe("src/");
  });

  it("prefers a root app directory over a stray src folder", () => {
    file("app/page.tsx");
    file("src/something.ts");
    expect(detectSrcDir(dir)).toBe("");
  });

  it("returns no prefix for a project with neither", () => {
    expect(detectSrcDir(dir)).toBe("");
  });

  it("picks the stylesheet that actually imports Tailwind", () => {
    file("app/globals.css", "/* no tailwind here */");
    file("src/styles/globals.css", '@import "tailwindcss";');
    expect(detectCssFile(dir)).toBe("src/styles/globals.css");
  });

  it("falls back to the first stylesheet it recognises", () => {
    file("app/globals.css", "body { margin: 0 }");
    expect(detectCssFile(dir)).toBe("app/globals.css");
  });

  it("returns null when there is no stylesheet at all", () => {
    expect(detectCssFile(dir)).toBeNull();
  });
});

describe("config", () => {
  it("fills in defaults for the keys a config leaves out", () => {
    writeConfig(dir, {
      ...DEFAULT_CONFIG,
      paths: { ...DEFAULT_CONFIG.paths, ui: "src/components/ui" },
    });

    const config = readConfig(dir)!;
    expect(config.paths.ui).toBe("src/components/ui");
    // Untouched keys keep the default rather than becoming undefined.
    expect(config.paths.lib).toBe(DEFAULT_CONFIG.paths.lib);
    expect(config.aliases.utils).toBe(DEFAULT_CONFIG.aliases.utils);
  });

  it("returns null when the project has no config", () => {
    expect(readConfig(dir)).toBeNull();
  });
});

describe("targetFor", () => {
  const item = { name: "button", type: "registry:ui" } as RegistryItem;

  /**
   * The paths a project configured, already carrying its `src/` prefix —
   * which `init` resolves once. Re-deriving it in `add` is what produced
   * `src/src/components/ui`, so these pin the fix.
   */
  const paths = { ui: "src/components/ui", lib: "src/lib", hooks: "src/hooks" };

  /** targetFor only reads path, target and type; content is required by the type. */
  const asFile = (target: string, type: RegistryFile["type"] = "registry:ui"): RegistryFile => ({
    path: target,
    target,
    type,
    content: "",
  });

  it.each([
    ["components/ui/button.tsx", "src/components/ui/button.tsx"],
    ["components/blocks/hero.tsx", "src/components/blocks/hero.tsx"],
    ["components/templates/login-split.tsx", "src/components/templates/login-split.tsx"],
    ["lib/utils.ts", "src/lib/utils.ts"],
    ["hooks/use-theme.ts", "src/hooks/use-theme.ts"],
  ])("rebases %s onto the configured folders", (target, expected) => {
    const result = targetFor(asFile(target), item, paths);
    expect(result.replace(/\\/g, "/")).toBe(expected);
  });

  it("never doubles the src prefix", () => {
    const result = targetFor(asFile("components/ui/button.tsx"), item, paths);
    expect(result.replace(/\\/g, "/")).not.toContain("src/src");
  });

  it("falls back to the item type when a file has no target", () => {
    const result = targetFor(
      { path: "use-clipboard.ts", type: "registry:hook", content: "" },
      { name: "use-clipboard", type: "registry:hook" } as RegistryItem,
      paths,
    );
    expect(result.replace(/\\/g, "/")).toBe("src/hooks/use-clipboard.ts");
  });

  it("passes an unrecognised target through untouched", () => {
    const result = targetFor(asFile("styles/extra.css"), item, paths);
    expect(result.replace(/\\/g, "/")).toBe("styles/extra.css");
  });
});

describe("resolveTree", () => {
  /** A miniature local registry: the CLI reads a directory as readily as a URL. */
  function registry(items: Record<string, Partial<RegistryItem>>) {
    const root = join(dir, "r");
    mkdirSync(root, { recursive: true });
    for (const [name, item] of Object.entries(items)) {
      writeFileSync(
        join(root, `${name}.json`),
        JSON.stringify({ name, type: "registry:ui", files: [], ...item }),
      );
    }
    return root;
  }

  it("returns dependencies before the items that import them", async () => {
    const root = registry({
      utils: {},
      button: { registryDependencies: ["utils"] },
      "data-table": { registryDependencies: ["button"] },
    });

    const order = (await resolveTree(root, ["data-table"], dir)).map((item) => item.name);
    // `utils` has to land before `button`, which has to land before the table
    // that imports it — otherwise a partial write leaves broken imports.
    expect(order.indexOf("utils")).toBeLessThan(order.indexOf("button"));
    expect(order.indexOf("button")).toBeLessThan(order.indexOf("data-table"));
  });

  it("visits a shared dependency once", async () => {
    const root = registry({
      utils: {},
      button: { registryDependencies: ["utils"] },
      input: { registryDependencies: ["utils"] },
    });

    const names = (await resolveTree(root, ["button", "input"], dir)).map((item) => item.name);
    expect(names.filter((name) => name === "utils")).toHaveLength(1);
  });

  it("names the item and the path when it is not in the registry", async () => {
    const root = registry({ button: {} });
    await expect(resolveTree(root, ["nope"], dir)).rejects.toThrow(/nope/);
  });
});
