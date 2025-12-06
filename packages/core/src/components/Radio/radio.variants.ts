/**
 * Auto-generated variant classes for radio
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { radioVariantClasses } from './Radio.variants.ts'
 *
 * const radioVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: radioVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const radioVariantClasses = {
  variant: {
        default: [
          'bg-radio-default-background-default',
          'hover:bg-radio-default-background-hover',
          'text-radio-default-text',
          'border border-radio-default-border'
        ],
        primary: [
          'bg-radio-primary-background-default',
          'hover:bg-radio-primary-background-hover',
          'text-radio-primary-text',
          'border border-radio-primary-border'
        ]
  }
} as const

export type RadioVariant = 'default' | 'primary'
