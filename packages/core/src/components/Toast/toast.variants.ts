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
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-200'
        ],
        success: [
          'bg-green-50',
          'hover:bg-green-50',
          'text-green-700',
          'border border-green-600'
        ],
        error: [
          'bg-red-50',
          'hover:bg-red-50',
          'text-red-700',
          'border border-red-600'
        ]
  }
} as const

export type ToastVariant = 'default' | 'success' | 'error'
