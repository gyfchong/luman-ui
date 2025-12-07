import type { DesignTokens, ComponentVariantTokens } from "../schema.ts"
import { toPascalCase, toCamelCase } from "../utils/formatting.ts"

interface CVAVariantClasses {
  [variantName: string]: string[]
}

/**
 * Resolve a token value to its primitive color and return the Tailwind class name
 */
function resolveToPrimitiveClass(
  value: string,
  tokens: DesignTokens,
  property: string,
  visited = new Set<string>()
): string | null {
  // Prevent infinite recursion
  if (visited.has(value)) return null
  visited.add(value)

  // Check if it's a reference (e.g., "{color.semantic.brand.strong}")
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    const path = value.slice(1, -1).split(".")
    const token = getTokenByPath(tokens, path)

    if (token?.$value) {
      return resolveToPrimitiveClass(token.$value, tokens, property, visited)
    }
    return null
  }

  // We have a primitive value (hex color, etc.)
  // Now find which primitive color this is
  return findPrimitiveColorClass(value, tokens, property)
}

/**
 * Find the primitive color that matches this value and return its Tailwind class
 */
function findPrimitiveColorClass(
  value: string,
  tokens: DesignTokens,
  property: string
): string | null {
  // Special case: transparent
  if (value === "transparent") {
    return "transparent"
  }

  // Search through primitive colors to find a match
  const primitives = tokens.color.primitive
  for (const [colorName, colorValue] of Object.entries(primitives)) {
    if (typeof colorValue === "object" && !("$value" in colorValue)) {
      // This is a color scale (e.g., blue.50, blue.100, ...)
      for (const [scale, scaleToken] of Object.entries(colorValue)) {
        if (
          typeof scaleToken === "object" &&
          scaleToken !== null &&
          "$value" in scaleToken &&
          scaleToken.$value === value
        ) {
          // Found it! Return the Tailwind class for this color-scale
          return `${colorName}-${scale}`
        }
      }
    } else if (
      typeof colorValue === "object" &&
      "$value" in colorValue &&
      colorValue.$value === value
    ) {
      // Simple color without scale (white, black, transparent)
      return colorName
    }
  }

  return null
}

/**
 * Get token by path (same as in generate-tailwind.ts)
 */
function getTokenByPath(tokens: DesignTokens, path: string[]): any | null {
  let current: any = tokens

  for (const segment of path) {
    if (current && typeof current === "object" && segment in current) {
      current = current[segment]
    } else {
      return null
    }
  }

  if (current && typeof current === "object" && "$value" in current) {
    return current
  }

  return null
}

/**
 * Generates CVA (class-variance-authority) definitions from design tokens
 */
export function generateCVA(
  tokens: DesignTokens,
  config: { propertyMapping: Record<string, string> }
): Map<string, string> {
  const cvaFiles = new Map<string, string>()

  for (const [componentName, componentConfig] of Object.entries(
    tokens.component
  )) {
    // Skip metadata properties
    if (componentName.startsWith('$')) continue

    // Check if component has variants
    const hasVariant =
      "variant" in componentConfig && componentConfig.variant !== undefined
    const isCompound = !hasVariant

    if (isCompound) {
      // Handle compound components (e.g., popover with trigger, popup parts)
      for (const [partName, partConfig] of Object.entries(componentConfig)) {
        if (
          typeof partConfig === "object" &&
          partConfig !== null &&
          "variant" in partConfig &&
          partConfig.variant
        ) {
          const fullName = `${componentName}-${partName}`
          const cvaCode = generateCVAForComponent(
            fullName,
            partConfig.variant as ComponentVariantTokens,
            tokens,
            config
          )
          if (cvaCode) {
            cvaFiles.set(fullName, cvaCode)
          }
        }
      }
    } else if (hasVariant && componentConfig.variant) {
      // Simple component (e.g., button, input)
      const cvaCode = generateCVAForComponent(
        componentName,
        componentConfig.variant,
        tokens,
        config
      )
      if (cvaCode) {
        cvaFiles.set(componentName, cvaCode)
      }
    }
  }

  return cvaFiles
}

function generateCVAForComponent(
  componentName: string,
  variants: ComponentVariantTokens,
  tokens: DesignTokens,
  config: { propertyMapping: Record<string, string> }
): string | null {
  const variantClasses: CVAVariantClasses = {}

  // Build class strings for each variant
  for (const [variantName, variantTokens] of Object.entries(variants)) {
    const classes: string[] = []

    for (const [property, propertyValue] of Object.entries(variantTokens)) {
      // Handle nested states (default, hover, etc.)
      if (
        typeof propertyValue === "object" &&
        propertyValue !== null &&
        !("$value" in propertyValue)
      ) {
        for (const [state, stateToken] of Object.entries(propertyValue)) {
          if (
            typeof stateToken === "object" &&
            stateToken !== null &&
            "$value" in stateToken
          ) {
            const pseudoClass = getPseudoClass(state)

            // Get the Tailwind prefix for this property
            const prefix = config.propertyMapping[property]
            if (prefix) {
              // Resolve the token value to a Tailwind primitive class
              const primitiveClass = resolveToPrimitiveClass(
                stateToken.$value as string,
                tokens,
                property
              )

              if (primitiveClass) {
                const utilityClass = `${prefix}-${primitiveClass}`

                if (pseudoClass) {
                  classes.push(`${pseudoClass}:${utilityClass}`)
                } else {
                  // Special handling for border which needs the border class
                  if (property === "border") {
                    classes.push(`border ${utilityClass}`)
                  } else {
                    classes.push(utilityClass)
                  }
                }
              }
            }
          }
        }
      } else if (
        typeof propertyValue === "object" &&
        propertyValue !== null &&
        "$value" in propertyValue
      ) {
        // Simple property without states
        // Get the Tailwind prefix for this property
        const prefix = config.propertyMapping[property]
        if (prefix) {
          // Resolve the token value to a Tailwind primitive class
          const primitiveClass = resolveToPrimitiveClass(
            propertyValue.$value as string,
            tokens,
            property
          )

          if (primitiveClass) {
            const utilityClass = `${prefix}-${primitiveClass}`

            // Special handling for border which needs the border class
            if (property === "border") {
              classes.push(`border ${utilityClass}`)
            } else {
              classes.push(utilityClass)
            }
          }
        }
      }
    }

    variantClasses[variantName] = classes
  }

  // Generate the CVA code
  const variantNames = Object.keys(variantClasses)
  const firstVariant = variantNames[0] || "primary"

  const variantsCode = variantNames
    .map((name) => {
      const classes = variantClasses[name] || []
      return `        ${name}: [\n          '${classes.join("',\n          '")}'\n        ]`
    })
    .join(",\n")

  const pascalName = toPascalCase(componentName)

  return `/**
 * Auto-generated variant classes for ${componentName}
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * \`\`\`tsx
 * import { cva } from 'class-variance-authority'
 * import { ${toCamelCase(componentName)}VariantClasses } from './${pascalName}.variants.ts'
 *
 * const ${toCamelCase(componentName)}Variants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: ${toCamelCase(componentName)}VariantClasses,
 *     defaultVariants: { variant: '${firstVariant}' }
 *   }
 * )
 * \`\`\`
 */
export const ${toCamelCase(componentName)}VariantClasses = {
  variant: {
${variantsCode}
  }
} as const

export type ${pascalName}Variant = ${variantNames.map((v) => `'${v}'`).join(" | ")}
`
}

function getPseudoClass(state: string): string | null {
  const stateMap: Record<string, string> = {
    hover: "hover",
    active: "active",
    focus: "focus",
    disabled: "disabled",
    open: "data-[popup-open]",
  }
  return stateMap[state] || null
}
