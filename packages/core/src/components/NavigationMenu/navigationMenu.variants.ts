/**
 * Auto-generated variant classes for navigationMenu
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { navigationMenuVariantClasses } from './NavigationMenu.variants.ts'
 *
 * const navigationMenuVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: navigationMenuVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const navigationMenuVariantClasses = {
  variant: {
        default: [
          'bg-transparent',
          'hover:bg-gray-100',
          'text-gray-900',
          'border border-transparent'
        ]
  }
} as const

export type NavigationMenuVariant = 'default'
