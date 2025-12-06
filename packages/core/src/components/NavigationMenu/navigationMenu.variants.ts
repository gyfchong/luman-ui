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
          'bg-navigationMenu-default-background-default',
          'hover:bg-navigationMenu-default-background-hover',
          'text-navigationMenu-default-text',
          'border border-navigationMenu-default-border'
        ]
  }
} as const

export type NavigationMenuVariant = 'default'
