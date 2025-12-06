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
          'bg-menu-default-background-default',
          'hover:bg-menu-default-background-hover',
          'text-menu-default-text',
          'border border-menu-default-border'
        ]
  }
} as const

export type MenuVariant = 'default'
