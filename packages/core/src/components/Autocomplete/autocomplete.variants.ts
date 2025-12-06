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
          'bg-autocomplete-default-background-default',
          'hover:bg-autocomplete-default-background-hover',
          'text-autocomplete-default-text',
          'border border-autocomplete-default-border'
        ]
  }
} as const

export type AutocompleteVariant = 'default'
