import * as React from "react";
import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { toggleVariantClasses, type ToggleVariant } from "./toggle.variants.ts";

export type ToggleProps = BaseToggleProps;

/**
 * Toggle variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const toggleVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    // Variant classes - visual styling from design tokens
    variants: toggleVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Toggle component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Toggle variant="default" aria-label="Toggle italic">
 *   <i>I</i>
 * </Toggle>
 *
 * <Toggle variant="outline" aria-label="Toggle bold">
 *   <b>B</b>
 * </Toggle>
 * ```
 */
export const Toggle: React.ForwardRefExoticComponent<
  BaseToggleProps & {
    variant?: ToggleVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  BaseToggleProps & { variant?: ToggleVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseToggle
      ref={ref}
      {...props}
      className={cn(toggleVariants({ variant }), className)}
    >
      {children}
    </BaseToggle>
  );
});

Toggle.displayName = "Toggle";
