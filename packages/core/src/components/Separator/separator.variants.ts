/**
 * Auto-generated variant classes for separator
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { separatorVariantClasses } from './Separator.variants.ts'
 *
 * const separatorVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: separatorVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const separatorVariantClasses = {
  variant: {
        default: [
          'bg-separator-default-background-default',
          'hover:bg-separator-default-background-hover',
          'text-separator-default-text',
          'border border-separator-default-border'
        ]
  }
} as const

export type SeparatorVariant = 'default'
