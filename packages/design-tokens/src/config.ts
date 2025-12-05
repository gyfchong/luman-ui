import { cosmiconfig } from "cosmiconfig"
import { createJiti } from "jiti"
import { defu } from "defu"
import { resolve, isAbsolute } from "node:path"

/**
 * User configuration (what users write in config files)
 */
export interface DesignTokensConfig {
  /**
   * Path to design tokens JSON file (relative to project root)
   * @default "src/design-tokens.json"
   */
  tokenSchema?: string

  /**
   * Style system for theme generation
   * @default "tailwind"
   */
  styleSystem?: "tailwind"

  /**
   * Output file paths
   */
  outputs?: {
    /**
     * CSS output file path (relative to project root)
     * @default "src/tailwind.css"
     */
    css?: string

    /**
     * Components directory for types and variants (relative to project root)
     * Generates:
     * - `{components}/component-types.ts` - TypeScript component types
     * - `{components}/{ComponentName}/{componentName}.variants.ts` - CVA variants
     * @default "src/components"
     */
    components?: string
  }
}

/**
 * Fully resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  tokenSchema: string
  styleSystem: "tailwind"
  outputs: {
    css: string
    components: string
  }
  cva: {
    propertyMapping: Record<string, string>
  }
}

/**
 * Resolved configuration with absolute paths
 */
export interface ResolvedConfigWithPaths extends ResolvedConfig {
  /**
   * Absolute path to token schema file
   */
  tokenSchemaPath: string
  /**
   * Absolute path to CSS output file
   */
  cssOutputPath: string
  /**
   * Absolute path to components directory
   */
  componentDirPath: string
  /**
   * Absolute path to component types file (pre-computed)
   */
  componentTypesPath: string
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ResolvedConfig = {
  tokenSchema: "src/design-tokens.json",
  styleSystem: "tailwind",
  outputs: {
    css: "src/tailwind.css",
    components: "src/components",
  },
  cva: {
    propertyMapping: {
      background: "bg",
      text: "text",
      border: "border",
    },
  },
}

/**
 * Helper for defining config with TypeScript autocomplete
 */
export function defineConfig(config: DesignTokensConfig): DesignTokensConfig {
  return config
}

/**
 * Load and resolve configuration
 */
export async function loadConfig(configPath?: string): Promise<ResolvedConfig> {
  const explorer = cosmiconfig("design-tokens", {
    searchPlaces: [
      "design-tokens.config.ts",
      "design-tokens.config.js",
      "design-tokens.config.json",
      "package.json",
      ".designtokensrc.json",
    ],
    loaders: {
      ".ts": async (filepath) => {
        // Use jiti to load TypeScript config files
        const jiti = createJiti(import.meta.url, {
          interopDefault: true,
        })
        const loaded = await jiti.import(filepath) as { default?: DesignTokensConfig } | DesignTokensConfig
        // Handle both default and named exports
        return loaded && typeof loaded === "object" && "default" in loaded
          ? loaded.default
          : loaded
      },
    },
  })

  let result
  if (configPath) {
    // Load specific config file
    result = await explorer.load(configPath)
  } else {
    // Search for config
    result = await explorer.search()
  }

  const userConfig = (result?.config as DesignTokensConfig | undefined) || {}

  // Simple merge with defaults
  const config = defu(userConfig, DEFAULT_CONFIG) as ResolvedConfig
  return config
}

/**
 * Load config and resolve all paths to absolute paths
 */
export async function loadConfigWithPaths(
  configPath?: string
): Promise<ResolvedConfigWithPaths> {
  // Load config (handles all validation and defaults)
  const config = await loadConfig(configPath)

  const cwd = process.cwd()

  // Resolve all paths relative to cwd
  const tokenSchemaPath = isAbsolute(config.tokenSchema)
    ? config.tokenSchema
    : resolve(cwd, config.tokenSchema)

  const cssOutputPath = isAbsolute(config.outputs.css)
    ? config.outputs.css
    : resolve(cwd, config.outputs.css)

  const componentDirPath = isAbsolute(config.outputs.components)
    ? config.outputs.components
    : resolve(cwd, config.outputs.components)

  const componentTypesPath = resolve(componentDirPath, "component-types.gen.ts")

  return {
    ...config,
    tokenSchemaPath,
    cssOutputPath,
    componentDirPath,
    componentTypesPath,
  }
}
