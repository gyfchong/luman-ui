/**
 * Auto-generated variant classes for combobox
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { comboboxVariantClasses } from './Combobox.variants.ts'
 *
 * const comboboxVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: comboboxVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const comboboxVariantClasses = {
  variant: {
        default: [
          'bg-combobox-default-background-default',
          'hover:bg-combobox-default-background-hover',
          'text-combobox-default-text',
          'border border-combobox-default-border'
        ]
  }
} as const

export type ComboboxVariant = 'default'
