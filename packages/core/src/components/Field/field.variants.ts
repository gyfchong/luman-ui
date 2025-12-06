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
          'bg-field-default-background-default',
          'hover:bg-field-default-background-hover',
          'text-field-default-text',
          'border border-field-default-border'
        ]
  }
} as const

export type FieldVariant = 'default'
