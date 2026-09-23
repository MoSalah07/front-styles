import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/*.tsx",
    "src/blocks/*.tsx",
    "src/templates/*.tsx",
    "src/lib/*.ts",
    "src/hooks/*.ts",
    // tests and stories live next to their component; they must never become
    // build entries, or their dev-only imports get bundled into dist/
    "!src/**/*.test.*",
    "!src/**/*.stories.*",
  ],
  format: "esm",
  platform: "browser",
  target: "es2022",
  dts: true,
  unbundle: true,
  sourcemap: true,
  clean: true,
  exports: false,
});
