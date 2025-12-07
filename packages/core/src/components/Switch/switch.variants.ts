/**
 * Auto-generated variant classes for switch
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { switchVariantClasses } from './Switch.variants.ts'
 *
 * const switchVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: switchVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const switchVariantClasses = {
  variant: {
        default: [
          'bg-gray-200',
          'hover:bg-gray-300',
          'text-gray-900',
          'border border-transparent'
        ],
        primary: [
          'bg-blue-600',
          'hover:bg-blue-700',
          'text-white',
          'border border-transparent'
        ]
  }
} as const

export type SwitchVariant = 'default' | 'primary'
