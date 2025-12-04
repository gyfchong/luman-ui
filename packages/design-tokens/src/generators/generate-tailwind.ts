import type { DesignTokens } from "../schema.ts";

/**
 * Generate Tailwind v4 CSS theme configuration
 */
export function generateTailwindConfig(tokens: DesignTokens): string {
  const lines: string[] = [];

  lines.push("@import 'tailwindcss';");
  lines.push("");
  lines.push("@theme {");

  // Generate color tokens
  for (const [scaleName, scaleValues] of Object.entries(tokens.color)) {
    for (const [shade, token] of Object.entries(scaleValues)) {
      const value = resolveTokenValue(token.$value, tokens);
      lines.push(`  --color-${scaleName}-${shade}: ${value};`);
    }
  }

  // Generate spacing tokens
  for (const [key, token] of Object.entries(tokens.spacing)) {
    const value = resolveTokenValue(token.$value, tokens);
    lines.push(`  --spacing-${key}: ${value};`);
  }

  // Generate fontSize tokens
  for (const [key, token] of Object.entries(tokens.fontSize)) {
    const value = resolveTokenValue(token.$value, tokens);
    lines.push(`  --font-size-${key}: ${value};`);
  }

  // Generate radius tokens
  for (const [key, token] of Object.entries(tokens.radius)) {
    const value = resolveTokenValue(token.$value, tokens);
    lines.push(`  --radius-${key}: ${value};`);
  }

  // Generate shadow tokens
  for (const [key, token] of Object.entries(tokens.shadow)) {
    const value = formatShadow(token.$value);
    lines.push(`  --shadow-${key}: ${value};`);
  }

  // Generate component tokens as custom color utilities
  for (const [componentName, componentConfig] of Object.entries(tokens.component)) {
    if ("variant" in componentConfig && componentConfig.variant) {
      for (const [variantName, variantTokens] of Object.entries(componentConfig.variant)) {
        for (const [property, propertyValue] of Object.entries(variantTokens)) {
          // Handle nested states (default, hover, etc.)
          if (
            typeof propertyValue === "object" &&
            propertyValue !== null &&
            !("$value" in propertyValue)
          ) {
            for (const [state, stateToken] of Object.entries(propertyValue)) {
              if (typeof stateToken === "object" && stateToken !== null && "$value" in stateToken) {
                const varName = `${componentName}-${variantName}-${property}-${state}`;
                const value = resolveTokenValue(stateToken.$value as string, tokens);
                lines.push(`  --color-${varName}: ${value};`);
              }
            }
          } else if (typeof propertyValue === "object" && "$value" in propertyValue) {
            // Simple property
            const varName = `${componentName}-${variantName}-${property}`;
            const value = resolveTokenValue(propertyValue.$value as string, tokens);
            lines.push(`  --color-${varName}: ${value};`);
          }
        }
      }
    }
  }

  lines.push("}");
  lines.push("");

  return lines.join("\n");
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
