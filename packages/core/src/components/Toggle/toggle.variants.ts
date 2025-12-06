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
          'bg-toggle-default-background-default',
          'hover:bg-toggle-default-background-hover',
          'text-toggle-default-text',
          'border border-toggle-default-border'
        ],
        primary: [
          'bg-toggle-primary-background-default',
          'hover:bg-toggle-primary-background-hover',
          'text-toggle-primary-text',
          'border border-toggle-primary-border'
        ]
  }
} as const

export type ToggleVariant = 'default' | 'primary'
