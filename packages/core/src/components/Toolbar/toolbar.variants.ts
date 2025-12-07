/**
 * Auto-generated variant classes for toolbar
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { toolbarVariantClasses } from './Toolbar.variants.ts'
 *
 * const toolbarVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: toolbarVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const toolbarVariantClasses = {
  variant: {
        default: [
          'bg-gray-50',
          'hover:bg-gray-50',
          'text-gray-900',
          'border border-gray-200'
        ]
  }
} as const

export type ToolbarVariant = 'default'
