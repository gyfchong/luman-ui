import * as React from "react";
import {
  Collapsible as BaseCollapsible,
  type CollapsibleProps as BaseCollapsibleProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  collapsibleVariantClasses,
  type CollapsibleVariant,
} from "./collapsible.variants.ts";

export type CollapsibleProps = BaseCollapsibleProps;

/**
 * Collapsible variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const collapsibleVariants = cva(
  // Base classes - structural styles for collapsible container
  "w-full",
  {
    // Variant classes - visual styling from design tokens
    variants: collapsibleVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Collapsible component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Collapsible variant="default">
 *   <CollapsibleTrigger>Toggle Content</CollapsibleTrigger>
 *   <CollapsiblePanel>Hidden content that can be toggled</CollapsiblePanel>
 * </Collapsible>
 * ```
 */
export const Collapsible: React.ForwardRefExoticComponent<
  BaseCollapsibleProps & {
    variant?: CollapsibleVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseCollapsibleProps & { variant?: CollapsibleVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseCollapsible
      ref={ref}
      {...props}
      className={cn(collapsibleVariants({ variant }), className)}
    >
      {children}
    </BaseCollapsible>
  );
});

Collapsible.displayName = "Collapsible";
