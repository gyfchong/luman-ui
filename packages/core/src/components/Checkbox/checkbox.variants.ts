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
          'bg-checkbox-default-background-default',
          'hover:bg-checkbox-default-background-hover',
          'text-checkbox-default-text',
          'border border-checkbox-default-border'
        ],
        primary: [
          'bg-checkbox-primary-background-default',
          'hover:bg-checkbox-primary-background-hover',
          'text-checkbox-primary-text',
          'border border-checkbox-primary-border'
        ]
  }
} as const

export type CheckboxVariant = 'default' | 'primary'
