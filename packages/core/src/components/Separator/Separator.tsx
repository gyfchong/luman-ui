import * as React from "react";
import {
  Separator as BaseSeparator,
  type SeparatorProps as BaseSeparatorProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  separatorVariantClasses,
  type SeparatorVariant,
} from "./separator.variants.ts";

export type SeparatorProps = BaseSeparatorProps;

/**
 * Separator variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const separatorVariants = cva(
  // Base classes - structural styles for separator
  "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
  {
    // Variant classes - visual styling from design tokens
    variants: separatorVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Separator component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Separator variant="default" orientation="horizontal" />
 * <Separator variant="subtle" orientation="vertical" />
 * ```
 */
export const Separator: React.ForwardRefExoticComponent<
  BaseSeparatorProps & {
    variant?: SeparatorVariant;
  }
> = React.forwardRef<
  HTMLHRElement,
  BaseSeparatorProps & { variant?: SeparatorVariant }
>(({ variant = "default", className, ...props }, ref) => {
  return (
    <BaseSeparator
      ref={ref}
      {...props}
      className={cn(separatorVariants({ variant }), className)}
    />
  );
});

Separator.displayName = "Separator";
