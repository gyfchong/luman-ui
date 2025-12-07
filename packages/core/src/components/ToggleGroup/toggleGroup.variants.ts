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
          'bg-gray-100',
          'hover:bg-gray-100',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type ToggleGroupVariant = 'default'
