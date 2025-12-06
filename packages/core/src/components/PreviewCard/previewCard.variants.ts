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
          'bg-previewCard-default-background-default',
          'hover:bg-previewCard-default-background-hover',
          'text-previewCard-default-text',
          'border border-previewCard-default-border'
        ]
  }
} as const

export type PreviewCardVariant = 'default'
