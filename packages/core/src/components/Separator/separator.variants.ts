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
          'bg-gray-200',
          'hover:bg-gray-200',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type SeparatorVariant = 'default'
