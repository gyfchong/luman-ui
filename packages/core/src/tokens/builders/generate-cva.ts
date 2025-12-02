import type { DesignTokens } from '../schema.ts'

interface CVAVariantClasses {
  [variantName: string]: string[]
}

/**
 * Generates CVA (class-variance-authority) definitions from design tokens
 */
export function generateCVA(tokens: DesignTokens): Map<string, string> {
  const cvaFiles = new Map<string, string>()

  for (const [componentName, componentConfig] of Object.entries(tokens.component)) {
    // Check if component has variants
    const hasVariant = 'variant' in componentConfig && componentConfig.variant !== undefined
    const isCompound = !hasVariant

    if (isCompound) {
      // Handle compound components (e.g., popover with trigger, popup parts)
      for (const [partName, partConfig] of Object.entries(componentConfig)) {
        if (
          typeof partConfig === 'object' &&
          partConfig !== null &&
          'variant' in partConfig &&
          partConfig.variant
        ) {
          const fullName = `${componentName}-${partName}`
          const cvaCode = generateCVAForComponent(fullName, partConfig.variant)
          if (cvaCode) {
            cvaFiles.set(fullName, cvaCode)
          }
        }
      }
    } else if (hasVariant && componentConfig.variant) {
      // Simple component (e.g., button, input)
      const cvaCode = generateCVAForComponent(componentName, componentConfig.variant)
      if (cvaCode) {
        cvaFiles.set(componentName, cvaCode)
      }
    }
  }

  return cvaFiles
}

function generateCVAForComponent(
  componentName: string,
  variants: Record<string, any>
): string | null {
  const variantClasses: CVAVariantClasses = {}

  // Build class strings for each variant
  for (const [variantName, variantTokens] of Object.entries(variants)) {
    const classes: string[] = []

    for (const [property, propertyValue] of Object.entries(variantTokens)) {
      // Handle nested states (default, hover, etc.)
      if (
        typeof propertyValue === 'object' &&
        propertyValue !== null &&
        !('$value' in propertyValue)
      ) {
        for (const [state, stateToken] of Object.entries(propertyValue)) {
          if (typeof stateToken === 'object' && stateToken !== null && '$value' in stateToken) {
            const className = `${componentName}-${variantName}-${property}-${state}`
            const pseudoClass = getPseudoClass(state)

            if (pseudoClass) {
              classes.push(`${pseudoClass}:bg-${className}`)
            } else if (property === 'background') {
              classes.push(`bg-${className}`)
            } else if (property === 'text') {
              classes.push(`text-${className}`)
            } else if (property === 'border') {
              classes.push(`border border-${className}`)
            }
          }
        }
      } else if (typeof propertyValue === 'object' && propertyValue !== null && '$value' in propertyValue) {
        // Simple property without states
        const className = `${componentName}-${variantName}-${property}`

        if (property === 'background') {
          classes.push(`bg-${className}`)
        } else if (property === 'text') {
          classes.push(`text-${className}`)
        } else if (property === 'border') {
          classes.push(`border border-${className}`)
        }
      }
    }

    variantClasses[variantName] = classes
  }

  // Generate the CVA code
  const variantNames = Object.keys(variantClasses)
  const firstVariant = variantNames[0] || 'primary'

  const variantsCode = variantNames
    .map((name) => {
      const classes = variantClasses[name] || []
      return `        ${name}: [\n          '${classes.join("',\n          '")}'\n        ]`
    })
    .join(',\n')

  const pascalName = toPascalCase(componentName)

  return `import { cva } from 'class-variance-authority'

/**
 * Auto-generated CVA variants for ${componentName}
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 */
export const ${camelCase(componentName)}Variants = cva(
  // Base classes
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
${variantsCode}
      }
    },
    defaultVariants: {
      variant: '${firstVariant}'
    }
  }
)

export type ${pascalName}VariantProps = {
  variant?: ${variantNames.map((v) => `'${v}'`).join(' | ')}
}
`
}

function getPseudoClass(state: string): string | null {
  const stateMap: Record<string, string> = {
    hover: 'hover',
    active: 'active',
    focus: 'focus',
    disabled: 'disabled',
    open: 'data-[popup-open]',
  }
  return stateMap[state] || null
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function camelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}
