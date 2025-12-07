/**
 * Auto-generated variant classes for numberField
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { numberFieldVariantClasses } from './NumberField.variants.ts'
 *
 * const numberFieldVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: numberFieldVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const numberFieldVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-300'
        ]
  }
} as const

export type NumberFieldVariant = 'default'
