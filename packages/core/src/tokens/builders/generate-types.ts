import type { DesignTokens } from '../schema.ts'

export function generateComponentTypes(tokens: DesignTokens): string {
  const lines: string[] = []

  // Header
  lines.push('/**')
  lines.push(' * Auto-generated from design-tokens.json')
  lines.push(' * DO NOT EDIT MANUALLY')
  lines.push(' *')
  lines.push(` * Last updated: ${new Date().toISOString()}`)
  lines.push(' */')
  lines.push('')

  const components = tokens.component

  for (const [componentName, componentConfig] of Object.entries(components)) {
    // Check if it's a compound component (has parts like popover.trigger)
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
          const variants = Object.keys(partConfig.variant)
          const typeName = toPascalCase(`${componentName}-${partName}-variant`)
          const constantName = toConstantCase(`${componentName}-${partName}-variant`)

          lines.push(`export type ${typeName} = ${variants.map((v) => `'${v}'`).join(' | ')}`)
          lines.push(
            `export const ${constantName}_VALUES = [${variants.map((v) => `'${v}'`).join(', ')}] as const`,
          )
          lines.push('')
        }
      }
    } else if (hasVariant && componentConfig.variant) {
      // Simple component (e.g., button, input)
      const variants = Object.keys(componentConfig.variant)
      const typeName = toPascalCase(`${componentName}-variant`)
      const constantName = toConstantCase(`${componentName}-variant`)

      lines.push(`export type ${typeName} = ${variants.map((v) => `'${v}'`).join(' | ')}`)
      lines.push(
        `export const ${constantName}_VALUES = [${variants.map((v) => `'${v}'`).join(', ')}] as const`,
      )
      lines.push('')
    }
  }

  return lines.join('\n')
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toConstantCase(str: string): string {
  return str.toUpperCase().replace(/-/g, '_')
}
