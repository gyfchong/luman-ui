/**
 * Auto-generated variant classes for popover
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { popoverVariantClasses } from './Popover.variants.ts'
 *
 * const popoverVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: popoverVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const popoverVariantClasses = {
  variant: {
        default: [
          'bg-popover-default-background-default',
          'hover:bg-popover-default-background-hover',
          'text-popover-default-text',
          'border border-popover-default-border'
        ]
  }
} as const

export type PopoverVariant = 'default'
