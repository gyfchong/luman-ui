/**
 * Auto-generated variant classes for meter
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { meterVariantClasses } from './Meter.variants.ts'
 *
 * const meterVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: meterVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const meterVariantClasses = {
  variant: {
        default: [
          'bg-gray-200',
          'hover:bg-gray-200',
          'text-blue-600',
          'border border-transparent'
        ]
  }
} as const

export type MeterVariant = 'default'
