/**
 * Auto-generated variant classes for toggle
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { toggleVariantClasses } from './Toggle.variants.ts'
 *
 * const toggleVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: toggleVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const toggleVariantClasses = {
  variant: {
        default: [
          'bg-transparent',
          'hover:bg-gray-100',
          'text-gray-900',
          'border border-gray-300'
        ],
        primary: [
          'bg-blue-100',
          'hover:bg-gray-100',
          'text-blue-700',
          'border border-blue-100'
        ]
  }
} as const

export type ToggleVariant = 'default' | 'primary'
