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
          'bg-input-default-background-default',
          'hover:bg-input-default-background-hover',
          'text-input-default-text',
          'border border-input-default-border'
        ],
        error: [
          'bg-input-error-background-default',
          'hover:bg-input-error-background-hover',
          'text-input-error-text',
          'border border-input-error-border'
        ]
  }
} as const

export type InputVariant = 'default' | 'error'
