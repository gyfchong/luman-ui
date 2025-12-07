/**
 * Auto-generated variant classes for progress
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { progressVariantClasses } from './Progress.variants.ts'
 *
 * const progressVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: progressVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const progressVariantClasses = {
  variant: {
        default: [
          'bg-gray-200',
          'hover:bg-gray-200',
          'text-blue-600',
          'border border-transparent'
        ]
  }
} as const

export type ProgressVariant = 'default'
