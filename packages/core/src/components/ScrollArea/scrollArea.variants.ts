/**
 * Auto-generated variant classes for scrollArea
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { scrollAreaVariantClasses } from './ScrollArea.variants.ts'
 *
 * const scrollAreaVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: scrollAreaVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const scrollAreaVariantClasses = {
  variant: {
        default: [
          'bg-scrollArea-default-background-default',
          'hover:bg-scrollArea-default-background-hover',
          'text-scrollArea-default-text',
          'border border-scrollArea-default-border'
        ]
  }
} as const

export type ScrollAreaVariant = 'default'
