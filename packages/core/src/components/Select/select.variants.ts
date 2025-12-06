/**
 * Auto-generated variant classes for select
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { selectVariantClasses } from './Select.variants.ts'
 *
 * const selectVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: selectVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const selectVariantClasses = {
  variant: {
        default: [
          'bg-select-default-background-default',
          'hover:bg-select-default-background-hover',
          'text-select-default-text',
          'border border-select-default-border'
        ]
  }
} as const

export type SelectVariant = 'default'
