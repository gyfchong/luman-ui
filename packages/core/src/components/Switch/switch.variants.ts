/**
 * Auto-generated variant classes for switch
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { switchVariantClasses } from './Switch.variants.ts'
 *
 * const switchVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: switchVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const switchVariantClasses = {
  variant: {
        default: [
          'bg-switch-default-background-default',
          'hover:bg-switch-default-background-hover',
          'text-switch-default-text',
          'border border-switch-default-border'
        ],
        primary: [
          'bg-switch-primary-background-default',
          'hover:bg-switch-primary-background-hover',
          'text-switch-primary-text',
          'border border-switch-primary-border'
        ]
  }
} as const

export type SwitchVariant = 'default' | 'primary'
