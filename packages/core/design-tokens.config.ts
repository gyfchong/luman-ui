import { defineConfig } from "@luman-ui/design-tokens";

export default defineConfig({
  input: "src/design-tokens.json",
  outputs: {
    types: {
      path: "src/components/component-types.gen.ts",
    },
    tailwind: {
      path: "src/theme.css",
    },
    cva: {
      path: "src/components",
    },
  },
});
