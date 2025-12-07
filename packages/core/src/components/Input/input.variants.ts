/**
 * Auto-generated variant classes for input
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { inputVariantClasses } from './Input.variants.ts'
 *
 * const inputVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: inputVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const inputVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-300'
        ],
        error: [
          'bg-red-50',
          'hover:bg-red-50',
          'text-gray-900',
          'border border-red-600'
        ]
  }
} as const

export type InputVariant = 'default' | 'error'
