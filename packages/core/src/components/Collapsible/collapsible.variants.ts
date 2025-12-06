/**
 * Auto-generated variant classes for collapsible
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { collapsibleVariantClasses } from './Collapsible.variants.ts'
 *
 * const collapsibleVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: collapsibleVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const collapsibleVariantClasses = {
  variant: {
        default: [
          'bg-collapsible-default-background-default',
          'hover:bg-collapsible-default-background-hover',
          'text-collapsible-default-text',
          'border border-collapsible-default-border'
        ]
  }
} as const

export type CollapsibleVariant = 'default'
