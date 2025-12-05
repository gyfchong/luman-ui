/**
 * @luman-ui/design-tokens
 *
 * Design tokens build system for generating TypeScript types, Tailwind config,
 * and CVA variants from W3C Design Tokens JSON files.
 */

// Core build functions
export { build } from "./core/build.ts";
export { watch } from "./core/watch.ts";
export type { BuildResult } from "./core/build.ts";

// Configuration
export {
  loadConfig,
  loadConfigWithPaths,
  defineConfig,
} from "./config.ts";
export type {
  DesignTokensConfig,
  ResolvedConfig,
  ResolvedConfigWithPaths,
} from "./config.ts";

// Generators (for advanced usage)
export { generateComponentTypes } from "./generators/generate-types.ts";
export { generateTailwindConfig } from "./generators/generate-tailwind.ts";
export { generateCVA } from "./generators/generate-cva.ts";

// Schema types
export type {
  DesignToken,
  ColorToken,
  DimensionToken,
  ShadowToken,
  ShadowValue,
  ComponentVariantTokens,
  ComponentTokens,
  DesignTokens,
} from "./schema.ts";

// String formatting utilities
export { toPascalCase, toCamelCase, toConstantCase } from "./utils/formatting.ts";

/**
 * Main API function for building tokens
 *
 * @example
 * ```typescript
 * import { buildTokens } from '@luman-ui/design-tokens'
 *
 * // Build with default config
 * await buildTokens()
 *
 * // Or specify custom config path
 * await buildTokens('./custom-config.ts')
 * ```
 *
 * @example
 * Example config file (design-tokens.config.ts):
 * ```typescript
 * import { defineConfig } from '@luman-ui/design-tokens'
 *
 * export default defineConfig({
 *   tokenSchema: 'src/design-tokens.json',
 *   styleSystem: 'tailwind',
 *   outputs: {
 *     css: 'src/tailwind.css',
 *     components: 'src/components'
 *   }
 * })
 * ```
 */
export async function buildTokens(configPath?: string) {
  const { loadConfigWithPaths } = await import("./config.ts");
  const { build } = await import("./core/build.ts");

  const config = await loadConfigWithPaths(configPath);
  return await build(config);
}
