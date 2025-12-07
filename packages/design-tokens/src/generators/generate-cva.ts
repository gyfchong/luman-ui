import type { DesignTokens, ComponentVariantTokens } from "../schema.ts"
import { toPascalCase, toCamelCase } from "../utils/formatting.ts"

interface CVAVariantClasses {
  [variantName: string]: string[]
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
            const className = `${componentName}-${variantName}-${property}-${state}`
            const pseudoClass = getPseudoClass(state)

            // Get the Tailwind prefix for this property
            const prefix = config.propertyMapping[property]
            if (prefix) {
              if (pseudoClass) {
                classes.push(`${pseudoClass}:${prefix}-${className}`)
              } else {
                // Special handling for border which needs the border class
                if (property === "border") {
                  classes.push(`border ${prefix}-${className}`)
                } else {
                  classes.push(`${prefix}-${className}`)
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
        const className = `${componentName}-${variantName}-${property}`

        // Get the Tailwind prefix for this property
        const prefix = config.propertyMapping[property]
        if (prefix) {
          // Special handling for border which needs the border class
          if (property === "border") {
            classes.push(`border ${prefix}-${className}`)
          } else {
            classes.push(`${prefix}-${className}`)
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
