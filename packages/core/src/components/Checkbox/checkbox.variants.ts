/**
 * Auto-generated variant classes for checkbox
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { checkboxVariantClasses } from './Checkbox.variants.ts'
 *
 * const checkboxVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: checkboxVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const checkboxVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-gray-50',
          'text-blue-600',
          'border border-gray-300'
        ],
        primary: [
          'bg-blue-600',
          'hover:bg-blue-700',
          'text-white',
          'border border-blue-600'
        ]
  }
} as const

export type CheckboxVariant = 'default' | 'primary'
