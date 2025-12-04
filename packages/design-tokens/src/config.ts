import { cosmiconfigSync } from "cosmiconfig";
import { createJiti } from "jiti";
import { defu } from "defu";
import type { PathContext } from "./utils/paths.ts";
import { createPathContext, resolveInputPath, resolveOutputPath } from "./utils/paths.ts";

/**
 * Configuration for TypeScript types output
 */
export interface TypesOutputConfig {
  enabled?: boolean;
  path?: string;
}

/**
 * Configuration for Tailwind v4 CSS theme output
 */
export interface TailwindOutputConfig {
  enabled?: boolean;
  path?: string;
}

/**
 * Configuration for CVA variants output
 */
export interface CVAOutputConfig {
  enabled?: boolean;
  /**
   * Base directory for component folders. Variant files will be generated at:
   * `{path}/{ComponentName}/{componentName}.variants.ts`
   *
   * NOTE: Component directories must already exist. The script will NOT create them.
   * Create component directories first, then run the build.
   *
   * Example with path: "src/components":
   * - src/components/Button/ (you create this)
   *   └── button.variants.ts (script generates this)
   * - src/components/Input/ (you create this)
   *   └── input.variants.ts (script generates this)
   */
  path?: string;
  propertyMapping?: {
    [property: string]: string;
  };
}

/**
 * Output configuration
 */
export interface OutputsConfig {
  types?: TypesOutputConfig;
  tailwind?: TailwindOutputConfig;
  cva?: CVAOutputConfig;
}

/**
 * User configuration (what users write in config files)
 */
export interface DesignTokensConfig {
  /**
   * Path to the input tokens JSON file
   */
  input?: string;
  /**
   * Output configurations
   */
  outputs?: OutputsConfig;
}

/**
 * Fully resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  input: string;
  outputs: {
    types: Required<TypesOutputConfig>;
    tailwind: Required<TailwindOutputConfig>;
    cva: Required<CVAOutputConfig>;
  };
}

/**
 * Resolved configuration with absolute paths
 */
export interface ResolvedConfigWithPaths extends ResolvedConfig {
  /**
   * Absolute path to input file
   */
  inputPath: string;
  /**
   * Path context for resolving relative paths
   */
  pathContext: PathContext;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ResolvedConfig = {
  input: "design-tokens.json",
  outputs: {
    types: {
      enabled: true,
      path: "generated/component-types.ts",
    },
    tailwind: {
      enabled: true,
      path: "src/app.css",
    },
    cva: {
      enabled: true,
      path: "components",
      propertyMapping: {
        background: "bg",
        text: "text",
        border: "border",
      },
    },
  },
};

/**
 * Helper for defining config with TypeScript autocomplete
 */
export function defineConfig(config: DesignTokensConfig): DesignTokensConfig {
  return config;
}

/**
 * Load and resolve configuration
 */
export function loadConfig(configPath?: string): ResolvedConfig {
  const explorer = cosmiconfigSync("design-tokens", {
    searchPlaces: [
      "design-tokens.config.ts",
      "design-tokens.config.js",
      "design-tokens.config.json",
      "package.json",
      ".designtokensrc.json",
    ],
    loaders: {
      ".ts": (filepath) => {
        // Use jiti to load TypeScript config files
        const jiti = createJiti(filepath, {
          interopDefault: true,
          esmResolve: true,
        });
        const loaded = jiti(filepath);
        // Handle both default and named exports
        return loaded?.default || loaded;
      },
    },
  });

  let result;
  if (configPath) {
    // Load specific config file
    result = explorer.load(configPath);
  } else {
    // Search for config
    result = explorer.search();
  }

  const userConfig = (result?.config as DesignTokensConfig) || {};

  // Merge with defaults
  const merged = defu(userConfig, DEFAULT_CONFIG) as ResolvedConfig;

  return merged;
}

/**
 * Load config and resolve all paths to absolute paths
 */
export function loadConfigWithPaths(configPath?: string): ResolvedConfigWithPaths {
  const config = loadConfig(configPath);
  const pathContext = createPathContext(configPath);

  // Resolve input path
  const inputPath = resolveInputPath(config.input, pathContext);

  return {
    ...config,
    inputPath,
    pathContext,
  };
}

/**
 * Get absolute path for types output
 */
export function getTypesOutputPath(config: ResolvedConfigWithPaths): string {
  return resolveOutputPath(config.outputs.types.path, config.pathContext);
}

/**
 * Get absolute path for Tailwind output
 */
export function getTailwindOutputPath(config: ResolvedConfigWithPaths): string {
  return resolveOutputPath(config.outputs.tailwind.path, config.pathContext);
}

/**
 * Get absolute path for CVA output (directory)
 */
export function getCVAOutputPath(config: ResolvedConfigWithPaths): string {
  return resolveOutputPath(config.outputs.cva.path, config.pathContext);
}
