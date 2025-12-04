#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import colors from "picocolors";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadConfigWithPaths } from "./config.ts";
import { build } from "./core/build.ts";
import { watch } from "./core/watch.ts";

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
      const config = loadConfigWithPaths(args.config);

      // Check if input file exists
      if (!existsSync(config.inputPath)) {
        console.error(colors.red(`❌ Token file not found: ${config.inputPath}`));
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
    const tokensPath = resolve(cwd, "design-tokens.json");

    // Check if config already exists
    if (existsSync(configPath)) {
      console.log(colors.yellow(`⚠️  Config file already exists: ${configPath}`));
      return;
    }

    // Create config file
    const configContent = `import { defineConfig } from "@luman-ui/design-tokens";

export default defineConfig({
  input: "design-tokens.json",
  outputs: {
    types: {
      path: "generated/component-types.ts",
    },
    tailwind: {
      path: "src/app.css", // Tailwind v4 CSS theme file
    },
    cva: {
      path: "components",
      baseClasses: {
        default: "inline-flex items-center justify-center",
        // Add component-specific base classes here
        // button: "inline-flex items-center gap-2 rounded-md px-4 py-2 ...",
      },
    },
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
    console.log(`  1. Edit ${colors.cyan("design-tokens.json")} to define your tokens`);
    console.log(`  2. Run ${colors.cyan("design-tokens build")} to generate outputs`);
    console.log(`  3. Import ${colors.cyan("src/app.css")} in your main CSS/entry point`);
    console.log(`  4. Run ${colors.cyan("design-tokens build --watch")} for development\n`);
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
  },
  async run() {
    console.log(colors.bold("\n🎨 Design Tokens\n"));
    console.log("Generate TypeScript types, Tailwind config, and CVA variants from W3C Design Tokens\n");
    console.log("Commands:");
    console.log(`  ${colors.cyan("build")}  Build tokens and generate outputs`);
    console.log(`  ${colors.cyan("init")}   Initialize configuration\n`);
    console.log("Options:");
    console.log(`  ${colors.cyan("--help")}     Show help`);
    console.log(`  ${colors.cyan("--version")}  Show version\n`);
  },
});

runMain(main);
