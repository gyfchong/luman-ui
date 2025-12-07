/**
 * Auto-generated variant classes for previewCard
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { previewCardVariantClasses } from './PreviewCard.variants.ts'
 *
 * const previewCardVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: previewCardVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const previewCardVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type PreviewCardVariant = 'default'
