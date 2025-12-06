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
          'bg-checkboxGroup-default-background-default',
          'hover:bg-checkboxGroup-default-background-hover',
          'text-checkboxGroup-default-text',
          'border border-checkboxGroup-default-border'
        ]
  }
} as const

export type CheckboxGroupVariant = 'default'
