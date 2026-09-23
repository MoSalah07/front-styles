import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  if (existsSync(join(cwd, "bun.lockb")) || existsSync(join(cwd, "bun.lock"))) return "bun";
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm";
}

export function installCommand(pm: PackageManager, deps: string[], dev = false): string[] {
  const flag = dev ? ["-D"] : [];
  switch (pm) {
    case "pnpm":
      return ["pnpm", "add", ...flag, ...deps];
    case "yarn":
      return ["yarn", "add", ...flag, ...deps];
    case "bun":
      return ["bun", "add", ...flag, ...deps];
    default:
      return ["npm", "install", ...(dev ? ["--save-dev"] : []), ...deps];
  }
}

export function run(cmd: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const [bin, ...args] = cmd;
    if (!bin) return resolve();
    const child = spawn(bin, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd.join(" ")} exited with ${code}`)),
    );
    child.on("error", reject);
  });
}
