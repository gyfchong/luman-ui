/**
 * Auto-generated variant classes for accordion
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { accordionVariantClasses } from './Accordion.variants.ts'
 *
 * const accordionVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: accordionVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const accordionVariantClasses = {
  variant: {
        default: [
          'bg-accordion-default-background-default',
          'hover:bg-accordion-default-background-hover',
          'text-accordion-default-text',
          'border border-accordion-default-border'
        ]
  }
} as const

export type AccordionVariant = 'default'
