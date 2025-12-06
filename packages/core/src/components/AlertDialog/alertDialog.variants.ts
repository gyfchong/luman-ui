/**
 * Auto-generated variant classes for alertDialog
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { alertDialogVariantClasses } from './AlertDialog.variants.ts'
 *
 * const alertDialogVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: alertDialogVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const alertDialogVariantClasses = {
  variant: {
        default: [
          'bg-alertDialog-default-background-default',
          'hover:bg-alertDialog-default-background-hover',
          'text-alertDialog-default-text',
          'border border-alertDialog-default-border'
        ]
  }
} as const

export type AlertDialogVariant = 'default'
