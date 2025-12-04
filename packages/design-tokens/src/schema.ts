/**
 * TypeScript schema for Design Tokens
 * Based on https://designtokens.org/specs/2025.10/schema.json
 */

export interface DesignToken<T = unknown> {
  $value: T
  $type: string
  $description?: string
  $extensions?: Record<string, unknown>
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
