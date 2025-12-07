/**
 * Auto-generated variant classes for autocomplete
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { autocompleteVariantClasses } from './Autocomplete.variants.ts'
 *
 * const autocompleteVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: autocompleteVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const autocompleteVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-gray-50',
          'text-gray-900',
          'border border-gray-300'
        ]
  }
} as const

export type AutocompleteVariant = 'default'
