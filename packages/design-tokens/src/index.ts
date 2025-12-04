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
  getTypesOutputPath,
  getTailwindOutputPath,
  getCVAOutputPath,
} from "./config.ts";
export type {
  DesignTokensConfig,
  ResolvedConfig,
  ResolvedConfigWithPaths,
  TypesOutputConfig,
  TailwindOutputConfig,
  CVAOutputConfig,
  OutputsConfig,
} from "./config.ts";

// Path utilities
export { createPathContext, resolveInputPath, resolveOutputPath } from "./utils/paths.ts";
export type { PathContext } from "./utils/paths.ts";

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
 * import { buildTokens, defineConfig } from '@luman-ui/design-tokens'
 *
 * const config = defineConfig({
 *   input: 'tokens.json',
 *   outputs: {
 *     types: { path: 'generated/types.ts' },
 *     tailwind: { path: 'tailwind.config.js' },
 *     cva: { path: 'components' }
 *   }
 * })
 *
 * await buildTokens(config)
 * ```
 */
export async function buildTokens(configPath?: string) {
  const { loadConfigWithPaths } = await import("./config.ts");
  const { build } = await import("./core/build.ts");

  const config = loadConfigWithPaths(configPath);
  return await build(config);
}
