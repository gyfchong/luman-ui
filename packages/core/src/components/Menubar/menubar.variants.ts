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
          'bg-gray-50',
          'hover:bg-gray-50',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type MenubarVariant = 'default'
