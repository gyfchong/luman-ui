import type { DesignTokens } from "../schema.ts"
import { validateSemanticTokens } from "../schema.ts"

/**
 * Generate Tailwind v4 CSS theme configuration with dark mode support
 */
export function generateTailwindConfig(tokens: DesignTokens): string {
  // Validate semantic tokens have dark mode values
  validateSemanticTokens(tokens)

  const lines: string[] = []

  lines.push("@import 'tailwindcss';")
  lines.push("")

  // Generate light mode (default)
  lines.push("/* Light mode (default) */")
  lines.push("@theme {")
  generateTokensForMode(lines, tokens, "light", "  ")
  lines.push("}")
  lines.push("")

  // Generate automatic dark mode (prefers-color-scheme)
  lines.push("/* Dark mode - automatic (prefers-color-scheme) */")
  lines.push("@media (prefers-color-scheme: dark) {")
  lines.push('  :root:not([data-theme="light"]) {')
  generateTokensForMode(lines, tokens, "dark", "    ")
  lines.push("  }")
  lines.push("}")
  lines.push("")

  // Generate manual dark mode override
  lines.push("/* Dark mode - manual override */")
  lines.push('[data-theme="dark"] {')
  generateTokensForMode(lines, tokens, "dark", "  ")
  lines.push("}")
  lines.push("")

  // Generate manual light mode override (takes precedence over prefers-color-scheme)
  lines.push(
    "/* Light mode - manual override (takes precedence over prefers-color-scheme) */"
  )
  lines.push('[data-theme="light"] {')
  generateTokensForMode(lines, tokens, "light", "  ")
  lines.push("}")
  lines.push("")

  return lines.join("\n")
}

/**
 * Generate tokens for a specific mode (light or dark)
 */
function generateTokensForMode(
  lines: string[],
  tokens: DesignTokens,
  mode: "light" | "dark",
  indent: string
): void {
  // Generate color tokens recursively to handle nested structure
  function generateColorTokens(obj: any, prefix: string[]): void {
    for (const [key, value] of Object.entries(obj)) {
      // Skip metadata properties
      if (key.startsWith('$')) continue

      if (value && typeof value === 'object') {
        if ('$value' in value && '$type' in value) {
          // This is a leaf token
          const tokenPath = [...prefix, key].join('-')
          const resolvedValue = resolveTokenValue(value.$value, tokens, mode)
          lines.push(`${indent}--color-${tokenPath}: ${resolvedValue};`)
        } else {
          // This is a nested object, recurse
          generateColorTokens(value, [...prefix, key])
        }
      }
    }
  }

  // Generate all color tokens (primitives, semantics, etc.)
  generateColorTokens(tokens.color, [])

  // Generate spacing tokens (mode-agnostic)
  if (mode === "light") {
    for (const [key, token] of Object.entries(tokens.spacing)) {
      const value = resolveTokenValue(token.$value, tokens, mode)
      lines.push(`${indent}--spacing-${key}: ${value};`)
    }

    // Generate fontSize tokens (mode-agnostic)
    for (const [key, token] of Object.entries(tokens.fontSize)) {
      const value = resolveTokenValue(token.$value, tokens, mode)
      lines.push(`${indent}--font-size-${key}: ${value};`)
    }

    // Generate radius tokens (mode-agnostic)
    for (const [key, token] of Object.entries(tokens.radius)) {
      const value = resolveTokenValue(token.$value, tokens, mode)
      lines.push(`${indent}--radius-${key}: ${value};`)
    }

    // Generate shadow tokens (mode-agnostic)
    for (const [key, token] of Object.entries(tokens.shadow)) {
      const value = formatShadow(token.$value)
      lines.push(`${indent}--shadow-${key}: ${value};`)
    }
  }

  // Generate component tokens as custom color utilities
  for (const [componentName, componentConfig] of Object.entries(
    tokens.component
  )) {
    // Skip metadata properties
    if (componentName.startsWith('$')) continue

    if ("variant" in componentConfig && componentConfig.variant) {
      for (const [variantName, variantTokens] of Object.entries(
        componentConfig.variant
      )) {
        for (const [property, propertyValue] of Object.entries(
          variantTokens
        )) {
          // Skip metadata properties
          if (property.startsWith('$')) continue

          // Handle nested states (default, hover, etc.)
          if (
            typeof propertyValue === "object" &&
            propertyValue !== null &&
            !("$value" in propertyValue)
          ) {
            for (const [state, stateToken] of Object.entries(propertyValue)) {
              // Skip metadata properties
              if (state.startsWith('$')) continue

              if (
                typeof stateToken === "object" &&
                stateToken !== null &&
                "$value" in stateToken
              ) {
                const varName = `${componentName}-${variantName}-${property}-${state}`
                const value = resolveTokenValue(
                  stateToken.$value as string,
                  tokens,
                  mode
                )
                lines.push(`${indent}--color-${varName}: ${value};`)
              }
            }
          } else if (typeof propertyValue === "object" && "$value" in propertyValue) {
            // Simple property
            const varName = `${componentName}-${variantName}-${property}`
            const value = resolveTokenValue(
              propertyValue.$value as string,
              tokens,
              mode
            )
            lines.push(`${indent}--color-${varName}: ${value};`)
          }
        }
      }
    }
  }
}

/**
 * Resolve token value with mode awareness
 */
function resolveTokenValue(
  value: string,
  tokens: DesignTokens,
  mode: "light" | "dark"
): string {
  const visited = new Set<string>()
  return resolveTokenValueInternal(value, tokens, mode, visited)
}

/**
 * Internal recursive token resolution with cycle detection
 */
function resolveTokenValueInternal(
  value: string,
  tokens: DesignTokens,
  mode: "light" | "dark",
  visited: Set<string>
): string {
  // Check if it's a reference (e.g., "{color.brand.600}")
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    // Prevent infinite recursion
    if (visited.has(value)) {
      console.warn(`Circular reference detected: ${value}`)
      return value
    }

    visited.add(value)

    const path = value.slice(1, -1).split(".")
    const token = getTokenByPath(tokens, path)

    if (token) {
      // If in dark mode and token has a dark mode override, use it
      if (mode === "dark" && token.$extensions?.mode?.dark) {
        // Recursively resolve the dark mode reference
        return resolveTokenValueInternal(token.$extensions.mode.dark, tokens, mode, visited)
      }

      // Otherwise use the default $value
      if (token.$value !== undefined) {
        return resolveTokenValueInternal(token.$value, tokens, mode, visited)
      }
    }

    // Can't resolve, return as-is
    return value
  }

  return value
}

/**
 * Get token by path
 */
function getTokenByPath(
  tokens: DesignTokens,
  path: string[]
): any | null {
  let current: any = tokens

  for (const segment of path) {
    if (current && typeof current === "object" && segment in current) {
      current = current[segment]
    } else {
      // Can't resolve
      return null
    }
  }

  // Check if it's a token (has $value)
  if (current && typeof current === "object" && "$value" in current) {
    return current
  }

  return null
}

/**
 * Format shadow values for CSS
 */
function formatShadow(
  shadows: Array<{
    offsetX: string
    offsetY: string
    blur: string
    spread: string
    color: string
  }>
): string {
  return shadows
    .map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`)
    .join(", ")
}
