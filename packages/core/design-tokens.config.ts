import { defineConfig } from "@luman-ui/design-tokens"

export default defineConfig({
  tokenSchema: "src/design-tokens.json",
  styleSystem: "tailwind",
  outputs: {
    css: "src/tailwind.css",
    components: "src/components",
  },
})
