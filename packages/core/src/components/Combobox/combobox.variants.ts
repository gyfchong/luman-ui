/**
 * Auto-generated variant classes for combobox
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { comboboxVariantClasses } from './Combobox.variants.ts'
 *
 * const comboboxVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: comboboxVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const comboboxVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-gray-50',
          'text-gray-900',
          'border border-gray-300'
        ]
  }
} as const

export type ComboboxVariant = 'default'
