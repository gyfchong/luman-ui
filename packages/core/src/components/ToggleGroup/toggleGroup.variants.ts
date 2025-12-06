/**
 * Auto-generated variant classes for toggleGroup
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { toggleGroupVariantClasses } from './ToggleGroup.variants.ts'
 *
 * const toggleGroupVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: toggleGroupVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const toggleGroupVariantClasses = {
  variant: {
        default: [
          'bg-toggleGroup-default-background-default',
          'hover:bg-toggleGroup-default-background-hover',
          'text-toggleGroup-default-text',
          'border border-toggleGroup-default-border'
        ]
  }
} as const

export type ToggleGroupVariant = 'default'
