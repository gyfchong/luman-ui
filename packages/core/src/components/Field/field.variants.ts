/**
 * Auto-generated variant classes for field
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { fieldVariantClasses } from './Field.variants.ts'
 *
 * const fieldVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: fieldVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const fieldVariantClasses = {
  variant: {
        default: [
          'bg-transparent',
          'hover:bg-transparent',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type FieldVariant = 'default'
