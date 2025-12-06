/**
 * Auto-generated variant classes for form
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { formVariantClasses } from './Form.variants.ts'
 *
 * const formVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: formVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const formVariantClasses = {
  variant: {
        default: [
          'bg-form-default-background-default',
          'hover:bg-form-default-background-hover',
          'text-form-default-text',
          'border border-form-default-border'
        ]
  }
} as const

export type FormVariant = 'default'
