/**
 * Auto-generated variant classes for menubar
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { menubarVariantClasses } from './Menubar.variants.ts'
 *
 * const menubarVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: menubarVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const menubarVariantClasses = {
  variant: {
        default: [
          'bg-menubar-default-background-default',
          'hover:bg-menubar-default-background-hover',
          'text-menubar-default-text',
          'border border-menubar-default-border'
        ]
  }
} as const

export type MenubarVariant = 'default'
