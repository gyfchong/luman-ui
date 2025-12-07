/**
 * Auto-generated variant classes for dialog
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { dialogVariantClasses } from './Dialog.variants.ts'
 *
 * const dialogVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: dialogVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const dialogVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type DialogVariant = 'default'
