/**
 * Auto-generated variant classes for slider
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { sliderVariantClasses } from './Slider.variants.ts'
 *
 * const sliderVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: sliderVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const sliderVariantClasses = {
  variant: {
        default: [
          'bg-slider-default-background-default',
          'hover:bg-slider-default-background-hover',
          'text-slider-default-text',
          'border border-slider-default-border'
        ]
  }
} as const

export type SliderVariant = 'default'
