/**
 * Auto-generated variant classes for tooltip
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { tooltipVariantClasses } from './Tooltip.variants.ts'
 *
 * const tooltipVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: tooltipVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const tooltipVariantClasses = {
  variant: {
        default: [
          'bg-tooltip-default-background-default',
          'hover:bg-tooltip-default-background-hover',
          'text-tooltip-default-text',
          'border border-tooltip-default-border'
        ]
  }
} as const

export type TooltipVariant = 'default'
