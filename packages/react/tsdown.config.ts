import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/components/button.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "@mui/base"],
})
