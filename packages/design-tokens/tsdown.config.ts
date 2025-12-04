import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [
    // CLI dependencies
    "citty",
    "cosmiconfig",
    "defu",
    "jiti",
    "chokidar",
    "picocolors",
  ],
  shims: true,
});
