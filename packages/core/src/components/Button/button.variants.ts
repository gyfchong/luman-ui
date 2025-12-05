/**
 * Auto-generated variant classes for button
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { buttonVariantClasses } from './Button.variants.ts'
 *
 * const buttonVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: buttonVariantClasses,
 *     defaultVariants: { variant: 'primary' }
 *   }
 * )
 * ```
 */
export const buttonVariantClasses = {
  variant: {
        primary: [
          'bg-button-primary-background-default',
          'hover:bg-button-primary-background-hover',
          'text-button-primary-text',
          'border border-button-primary-border'
        ],
        secondary: [
          'bg-button-secondary-background-default',
          'hover:bg-button-secondary-background-hover',
          'text-button-secondary-text',
          'border border-button-secondary-border'
        ],
        outline: [
          'bg-button-outline-background-default',
          'hover:bg-button-outline-background-hover',
          'text-button-outline-text',
          'border border-button-outline-border'
        ],
        ghost: [
          'bg-button-ghost-background-default',
          'hover:bg-button-ghost-background-hover',
          'text-button-ghost-text',
          'border border-button-ghost-border'
        ],
        destructive: [
          'bg-button-destructive-background-default',
          'hover:bg-button-destructive-background-hover',
          'text-button-destructive-text',
          'border border-button-destructive-border'
        ]
  }
} as const

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
