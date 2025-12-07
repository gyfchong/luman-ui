/**
 * TypeScript schema for Design Tokens
 * Based on https://designtokens.org/specs/2025.10/schema.json
 */

export interface DesignToken<T = unknown> {
  $value: T
  $type: string
  $description?: string
  $extensions?: {
    mode?: {
      dark?: string
      // Future: high-contrast?, colorblind?, etc.
    }
    [key: string]: unknown
  }
}

export interface ColorToken extends DesignToken<string> {
  $type: 'color'
}

export interface DimensionToken extends DesignToken<string> {
  $type: 'dimension'
}

export interface ShadowValue {
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
}

export interface ShadowToken extends DesignToken<ShadowValue[]> {
  $type: 'shadow'
}

export interface ComponentVariantTokens {
  [variantName: string]: {
    [property: string]: DesignToken | { [state: string]: DesignToken }
  }
}

export interface ComponentTokens {
  variant?: ComponentVariantTokens
  [partName: string]: unknown
}

export interface DesignTokens {
  color: {
    [scale: string]: {
      [shade: string]: ColorToken
    }
  }
  spacing: {
    [key: string]: DimensionToken
  }
  fontSize: {
    [key: string]: DimensionToken
  }
  radius: {
    [key: string]: DimensionToken
  }
  shadow: {
    [key: string]: ShadowToken
  }
  component: {
    [componentName: string]: ComponentTokens
  }
}

/**
 * Validates that all semantic tokens have required dark mode values
 * @throws Error if validation fails
 */
export function validateSemanticTokens(tokens: any): void {
  const semanticTokens = tokens.color?.semantic || {}
  const errors: string[] = []

  function checkToken(token: any, path: string): void {
    if (token.$value !== undefined) {
      // This is a leaf token - check for dark mode
      if (!token.$extensions?.mode?.dark) {
        errors.push(`Semantic token "${path}" missing dark mode value`)
      }
    } else {
      // Not a leaf - recurse into children
      for (const [key, value] of Object.entries(token)) {
        if (key.startsWith('$')) continue // Skip metadata
        checkToken(value, `${path}.${key}`)
      }
    }
  }

  // Check all semantic tokens
  for (const [category, tokens] of Object.entries(semanticTokens)) {
    // Skip metadata properties
    if (category.startsWith('$')) continue
    checkToken(tokens, `color.semantic.${category}`)
  }

  if (errors.length > 0) {
    throw new Error(
      `Dark mode validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    )
  }
}
