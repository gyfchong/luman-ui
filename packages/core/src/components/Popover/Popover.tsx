import * as React from "react";
import {
  Popover as BasePopover,
  type PopoverProps as BasePopoverProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { popoverVariantClasses, type PopoverVariant } from "./popover.variants.ts";

export type PopoverProps = BasePopoverProps;

/**
 * Popover variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const popoverVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "z-50 rounded-md shadow-lg outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: popoverVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Popover component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Popover variant="default">
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
export const Popover: React.ForwardRefExoticComponent<
  BasePopoverProps & {
    variant?: PopoverVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BasePopoverProps & { variant?: PopoverVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BasePopover
      ref={ref}
      {...props}
      className={cn(popoverVariants({ variant }), className)}
    >
      {children}
    </BasePopover>
  );
});

Popover.displayName = "Popover";
