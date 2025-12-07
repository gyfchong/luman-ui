/**
 * Auto-generated variant classes for checkboxGroup
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { checkboxGroupVariantClasses } from './CheckboxGroup.variants.ts'
 *
 * const checkboxGroupVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: checkboxGroupVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const checkboxGroupVariantClasses = {
  variant: {
        default: [
          'bg-transparent',
          'hover:bg-transparent',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type CheckboxGroupVariant = 'default'
