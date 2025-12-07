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
          'bg-transparent',
          'hover:bg-transparent',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type FormVariant = 'default'
