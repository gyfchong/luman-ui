/**
 * Auto-generated variant classes for toast
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { toastVariantClasses } from './Toast.variants.ts'
 *
 * const toastVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: toastVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const toastVariantClasses = {
  variant: {
        default: [
          'bg-toast-default-background-default',
          'hover:bg-toast-default-background-hover',
          'text-toast-default-text',
          'border border-toast-default-border'
        ],
        success: [
          'bg-toast-success-background-default',
          'hover:bg-toast-success-background-hover',
          'text-toast-success-text',
          'border border-toast-success-border'
        ],
        error: [
          'bg-toast-error-background-default',
          'hover:bg-toast-error-background-hover',
          'text-toast-error-text',
          'border border-toast-error-border'
        ]
  }
} as const

export type ToastVariant = 'default' | 'success' | 'error'
