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
          'bg-gray-900',
          'hover:bg-gray-900',
          'text-white',
          'border border-transparent'
        ]
  }
} as const

export type TooltipVariant = 'default'
