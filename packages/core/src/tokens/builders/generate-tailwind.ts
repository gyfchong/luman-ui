import type { DesignTokens } from '../schema.ts'

export function generateTailwindConfig(tokens: DesignTokens) {
  const colors: Record<string, string | Record<string, string>> = {}
  const spacing: Record<string, string> = {}
  const fontSize: Record<string, string> = {}
  const borderRadius: Record<string, string> = {}
  const boxShadow: Record<string, string> = {}

  // Extract color tokens
  for (const [scaleName, scaleValues] of Object.entries(tokens.color)) {
    const scaleColors: Record<string, string> = {}
    for (const [shade, token] of Object.entries(scaleValues)) {
      scaleColors[shade] = resolveTokenValue(token.$value, tokens)
    }
    colors[scaleName] = scaleColors
  }

  // Extract spacing tokens
  for (const [key, token] of Object.entries(tokens.spacing)) {
    spacing[key] = resolveTokenValue(token.$value, tokens)
  }

  // Extract fontSize tokens
  for (const [key, token] of Object.entries(tokens.fontSize)) {
    fontSize[key] = resolveTokenValue(token.$value, tokens)
  }

  // Extract radius tokens
  for (const [key, token] of Object.entries(tokens.radius)) {
    borderRadius[key] = resolveTokenValue(token.$value, tokens)
  }

  // Extract shadow tokens
  for (const [key, token] of Object.entries(tokens.shadow)) {
    boxShadow[key] = formatShadow(token.$value)
  }

  // Extract component tokens and create semantic color classes
  const componentColors: Record<string, string> = {}

  for (const [componentName, componentConfig] of Object.entries(tokens.component)) {
    if ('variant' in componentConfig && componentConfig.variant) {
      for (const [variantName, variantTokens] of Object.entries(componentConfig.variant)) {
        for (const [property, propertyValue] of Object.entries(variantTokens)) {
          // Handle nested states (default, hover, etc.)
          if (typeof propertyValue === 'object' && propertyValue !== null && !('$value' in propertyValue)) {
            for (const [state, stateToken] of Object.entries(propertyValue)) {
              if (typeof stateToken === 'object' && stateToken !== null && '$value' in stateToken) {
                const className = `${componentName}-${variantName}-${property}-${state}`
                componentColors[className] = resolveTokenValue(stateToken.$value as string, tokens)
              }
            }
          } else if (typeof propertyValue === 'object' && '$value' in propertyValue) {
            // Simple property
            const className = `${componentName}-${variantName}-${property}`
            componentColors[className] = resolveTokenValue(propertyValue.$value as string, tokens)
          }
        }
      }
    }
  }

  return {
    theme: {
      extend: {
        colors: {
          ...colors,
          ...componentColors,
        },
        spacing,
        fontSize,
        borderRadius,
        boxShadow,
      },
    },
  }
}

function resolveTokenValue(value: string, tokens: DesignTokens): string {
  // Check if it's a reference (e.g., "{color.brand.600}")
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const path = value.slice(1, -1).split('.')
    let current: any = tokens

    for (const segment of path) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment]
      } else {
        // Can't resolve, return as-is
        return value
      }
    }

    // If we found a token, get its $value
    if (current && typeof current === 'object' && '$value' in current) {
      return resolveTokenValue(current.$value, tokens)
    }

    return value
  }

  return value
}

function formatShadow(shadows: Array<{
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  color: string
}>): string {
  return shadows
    .map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`)
    .join(', ')
}
