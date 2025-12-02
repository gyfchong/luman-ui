import { cva } from 'class-variance-authority'

/**
 * Auto-generated CVA variants for button
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 */
export const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
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
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
)

export type ButtonVariantProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
}
