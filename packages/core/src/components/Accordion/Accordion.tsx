import * as React from "react";
import {
  Accordion as BaseAccordion,
  type AccordionProps as BaseAccordionProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  accordionVariantClasses,
  type AccordionVariant,
} from "./accordion.variants.ts";

export type AccordionProps = BaseAccordionProps;

/**
 * Accordion variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const accordionVariants = cva(
  // Base classes - structural styles for accordion container
  "w-full divide-y",
  {
    // Variant classes - visual styling from design tokens
    variants: accordionVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Accordion component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Accordion variant="default">
 *   <AccordionItem>
 *     <AccordionHeader>
 *       <AccordionTrigger>Section 1</AccordionTrigger>
 *     </AccordionHeader>
 *     <AccordionPanel>Content 1</AccordionPanel>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export const Accordion: React.ForwardRefExoticComponent<
  BaseAccordionProps & {
    variant?: AccordionVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseAccordionProps & { variant?: AccordionVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseAccordion
      ref={ref}
      {...props}
      className={cn(accordionVariants({ variant }), className)}
    >
      {children}
    </BaseAccordion>
  );
});

Accordion.displayName = "Accordion";
