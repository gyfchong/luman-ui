/**
 * Auto-generated variant classes for tabs
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { tabsVariantClasses } from './Tabs.variants.ts'
 *
 * const tabsVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: tabsVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const tabsVariantClasses = {
  variant: {
        default: [
          'bg-tabs-default-background-default',
          'hover:bg-tabs-default-background-hover',
          'text-tabs-default-text',
          'border border-tabs-default-border'
        ]
  }
} as const

export type TabsVariant = 'default'
