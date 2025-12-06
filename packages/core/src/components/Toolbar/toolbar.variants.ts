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
          'bg-toolbar-default-background-default',
          'hover:bg-toolbar-default-background-hover',
          'text-toolbar-default-text',
          'border border-toolbar-default-border'
        ]
  }
} as const

export type ToolbarVariant = 'default'
