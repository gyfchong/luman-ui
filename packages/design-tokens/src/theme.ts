import { readFile, writeFile, mkdir } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { createJiti } from "jiti"
import { generateTailwindConfig } from "./generators/generate-tailwind.ts"
import { validateSemanticTokens } from "./schema.ts"

export interface ThemeConfig {
  /**
   * Base tokens to extend (path or package name)
   */
  extends?: string

  /**
   * Custom tokens to merge
   */
  tokens?: Record<string, any>

  /**
   * Output file path
   */
  output?: string
}

/**
 * Helper for defining theme config with TypeScript autocomplete
 */
export function defineThemeConfig(config: ThemeConfig): ThemeConfig {
  return config
}

/**
 * Build custom theme from config
 */
export async function buildTheme(options: {
  config: string
  output: string
}): Promise<void> {
  console.log("🎨 Building custom theme...\n")

  const configPath = resolve(process.cwd(), options.config)

  // Load config using jiti
  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
  })
  const loaded = (await jiti.import(configPath)) as
    | { default?: ThemeConfig }
    | ThemeConfig
  const userConfig =
    loaded && typeof loaded === "object" && "default" in loaded
      ? loaded.default
      : loaded

  if (!userConfig) {
    throw new Error(`Failed to load theme config from ${configPath}`)
  }

  // Load base tokens
  let baseTokens = {}
  if (userConfig.extends) {
    const tokenPath = userConfig.extends.startsWith(".")
      ? resolve(process.cwd(), userConfig.extends)
      : require.resolve(`${userConfig.extends}/src/design-tokens.json`)

    baseTokens = JSON.parse(await readFile(tokenPath, "utf-8"))
  }

  // Deep merge tokens (preserving $extensions)
  const mergedTokens = deepMerge(baseTokens, userConfig.tokens || {})

  // Validate semantic tokens have dark modes
  validateSemanticTokens(mergedTokens)

  // Generate CSS
  const css = generateTailwindConfig(mergedTokens)

  // Add warning comment at the top
  const cssWithWarning = `/*
 * AUTO-GENERATED CUSTOM THEME
 *
 * ⚠️  Do NOT import both:
 *   ❌ import '@luman-ui/core/theme'
 *   ❌ import './theme.css'
 *
 * Choose ONE:
 *   ✅ import './theme.css' (this file)
 *   OR
 *   ✅ import '@luman-ui/core/theme' (default)
 */

${css}`

  // Write output
  const outputPath = resolve(
    process.cwd(),
    userConfig.output || options.output
  )
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, cssWithWarning, "utf-8")

  console.log(`✅ Theme built: ${outputPath}`)
}

/**
 * Deep merge two objects, preserving $extensions
 */
function deepMerge(base: any, override: any): any {
  const result = { ...base }

  for (const key in override) {
    if (
      override[key] != null &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      result[key] = deepMerge(result[key] || {}, override[key])
    } else {
      result[key] = override[key]
    }
  }

  return result
}
