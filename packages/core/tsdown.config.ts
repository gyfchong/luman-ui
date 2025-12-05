import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/components/Button/Button.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "@base-ui-components/react", "clsx", "tailwind-merge"],
})
