/**
 * Auto-generated variant classes for menu
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { menuVariantClasses } from './Menu.variants.ts'
 *
 * const menuVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: menuVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const menuVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type MenuVariant = 'default'
