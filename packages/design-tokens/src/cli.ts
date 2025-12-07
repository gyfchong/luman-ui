#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import colors from "picocolors";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadConfigWithPaths } from "./config.ts";
import { build } from "./core/build.ts";
import { watch } from "./core/watch.ts";
import { buildTheme } from "./theme.ts";

const buildCommand = defineCommand({
  meta: {
    name: "build",
    description: "Build design tokens and generate outputs",
  },
  args: {
    watch: {
      type: "boolean",
      alias: "w",
      description: "Watch for changes and rebuild",
      default: false,
    },
    config: {
      type: "string",
      alias: "c",
      description: "Path to config file",
    },
  },
  async run({ args }) {
    try {
      const config = await loadConfigWithPaths(args.config);

      // Check if input file exists
      if (!existsSync(config.tokenSchemaPath)) {
        console.error(colors.red(`❌ Token file not found: ${config.tokenSchemaPath}`));
        console.log(
          `\nCreate a ${colors.cyan("design-tokens.json")} file or run ${colors.cyan("design-tokens init")}`,
        );
        process.exit(1);
      }

      if (args.watch) {
        await watch(config);
      } else {
        const result = await build(config);
        if (!result.success) {
          process.exit(1);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(colors.red(`❌ Error: ${message}`));
      process.exit(1);
    }
  },
});

const initCommand = defineCommand({
  meta: {
    name: "init",
    description: "Initialize design tokens configuration",
  },
  async run() {
    const cwd = process.cwd();
    const configPath = resolve(cwd, "design-tokens.config.ts");
    const tokensPath = resolve(cwd, "src/design-tokens.json");
    const srcDir = resolve(cwd, "src");

    // Check if config already exists
    if (existsSync(configPath)) {
      console.log(colors.yellow(`⚠️  Config file already exists: ${configPath}`));
      return;
    }

    // Ensure src directory exists
    if (!existsSync(srcDir)) {
      console.error(colors.red(`❌ src directory not found: ${srcDir}`));
      console.log(`\nCreate the ${colors.cyan("src/")} directory first, or adjust the rootDir in your config.`);
      return;
    }

    // Create config file (optional - defaults work out of the box)
    const configContent = `import { defineConfig } from "@luman-ui/design-tokens";

export default defineConfig({
  // Path to design tokens JSON file (default: "src/design-tokens.json")
  tokenSchema: "src/design-tokens.json",

  // Style system for theme generation (default: "tailwind")
  styleSystem: "tailwind",

  // Output file paths
  outputs: {
    // CSS output file path (default: "src/tailwind.css")
    css: "src/tailwind.css",

    // Components directory for types and variants (default: "src/components")
    components: "src/components",
  },
});
`;

    writeFileSync(configPath, configContent, "utf-8");
    console.log(colors.green(`✅ Created config file: ${configPath}`));

    // Create starter tokens file if it doesn't exist
    if (!existsSync(tokensPath)) {
      const starterTokens = {
        $schema: "https://designtokens.org/specs/2025.10/schema.json",
        color: {
          brand: {
            "500": { $value: "#3b82f6", $type: "color" },
            "600": { $value: "#2563eb", $type: "color" },
            "700": { $value: "#1d4ed8", $type: "color" },
          },
        },
        component: {
          button: {
            variant: {
              primary: {
                background: {
                  default: { $value: "{color.brand.600}", $type: "color" },
                  hover: { $value: "{color.brand.700}", $type: "color" },
                },
                text: { $value: "#ffffff", $type: "color" },
              },
            },
          },
        },
      };

      writeFileSync(tokensPath, JSON.stringify(starterTokens, null, 2), "utf-8");
      console.log(colors.green(`✅ Created starter tokens: ${tokensPath}`));
    }

    console.log(`\n${colors.bold("Next steps:")}`);
    console.log(`  1. Edit ${colors.cyan("src/design-tokens.json")} to define your design tokens`);
    console.log(`  2. Run ${colors.cyan("design-tokens build")} to generate outputs:`);
    console.log(`     - ${colors.dim("src/components/component-types.ts")} (TypeScript types)`);
    console.log(`     - ${colors.dim("src/components/*/*.variants.ts")} (CVA variant classes)`);
    console.log(`     - ${colors.dim("src/tailwind.css")} (Tailwind v4 theme)`);
    console.log(`  3. Import ${colors.cyan("src/tailwind.css")} in your main CSS/entry point`);
    console.log(`  4. Run ${colors.cyan("design-tokens build --watch")} for development\n`);
  },
});

const themeCommand = defineCommand({
  meta: {
    name: "theme",
    description: "Build custom theme from config",
  },
  args: {
    config: {
      type: "string",
      alias: "c",
      description: "Path to theme config file",
      default: "theme.config.ts",
    },
    output: {
      type: "string",
      alias: "o",
      description: "Output file path",
      default: "src/theme.css",
    },
  },
  async run({ args }) {
    try {
      await buildTheme({
        config: args.config,
        output: args.output,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(colors.red(`❌ Error: ${message}`));
      process.exit(1);
    }
  },
});

const main = defineCommand({
  meta: {
    name: "design-tokens",
    version: "0.1.0",
    description: "Design tokens build system for Tailwind + CVA",
  },
  subCommands: {
    build: buildCommand,
    init: initCommand,
    theme: themeCommand,
  },
  async run() {
    console.log(colors.bold("\n🎨 Design Tokens\n"));
    console.log("Generate TypeScript types, Tailwind config, and CVA variants from W3C Design Tokens\n");
    console.log("Commands:");
    console.log(`  ${colors.cyan("build")}  Build tokens and generate outputs`);
    console.log(`  ${colors.cyan("init")}   Initialize configuration`);
    console.log(`  ${colors.cyan("theme")}  Build custom theme from config\n`);
    console.log("Options:");
    console.log(`  ${colors.cyan("--help")}     Show help`);
    console.log(`  ${colors.cyan("--version")}  Show version\n`);
  },
});

runMain(main);
