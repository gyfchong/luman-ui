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
          'bg-dialog-default-background-default',
          'hover:bg-dialog-default-background-hover',
          'text-dialog-default-text',
          'border border-dialog-default-border'
        ]
  }
} as const

export type DialogVariant = 'default'
