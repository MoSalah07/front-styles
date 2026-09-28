import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  platform: "node",
  target: "node20",
  // The package declares `types` and a library `exports` alongside its `bin`,
  // so the declarations have to be emitted for that half to be real.
  dts: true,
  clean: true,
  exports: false,
  // The 500 KB catalogue is inlined on purpose: the published binary answers a
  // question with nothing but node, no data file to find and no network.
  treeshake: false,
});
