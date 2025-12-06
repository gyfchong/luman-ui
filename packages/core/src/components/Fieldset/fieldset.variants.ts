/**
 * Auto-generated variant classes for fieldset
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { fieldsetVariantClasses } from './Fieldset.variants.ts'
 *
 * const fieldsetVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: fieldsetVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const fieldsetVariantClasses = {
  variant: {
        default: [
          'bg-fieldset-default-background-default',
          'hover:bg-fieldset-default-background-hover',
          'text-fieldset-default-text',
          'border border-fieldset-default-border'
        ]
  }
} as const

export type FieldsetVariant = 'default'
