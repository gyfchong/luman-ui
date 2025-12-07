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
          'bg-transparent',
          'hover:bg-transparent',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type FieldsetVariant = 'default'
