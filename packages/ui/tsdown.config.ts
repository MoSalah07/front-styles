import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/*.tsx",
    "src/lib/*.ts",
    // tests live next to their component; they must never become build entries,
    // or @testing-library gets bundled into dist/
    "!src/**/*.test.*",
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
