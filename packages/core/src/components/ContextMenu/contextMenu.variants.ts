/**
 * Auto-generated variant classes for contextMenu
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { contextMenuVariantClasses } from './ContextMenu.variants.ts'
 *
 * const contextMenuVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: contextMenuVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const contextMenuVariantClasses = {
  variant: {
        default: [
          'bg-white',
          'hover:bg-white',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type ContextMenuVariant = 'default'
