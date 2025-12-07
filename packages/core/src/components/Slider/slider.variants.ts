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
          'bg-gray-200',
          'hover:bg-gray-200',
          'text-blue-600',
          'border border-transparent'
        ]
  }
} as const

export type SliderVariant = 'default'
