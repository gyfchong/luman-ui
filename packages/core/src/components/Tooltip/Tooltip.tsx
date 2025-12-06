import * as React from "react";
import {
  Tooltip as BaseTooltip,
  type TooltipProps as BaseTooltipProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { tooltipVariantClasses, type TooltipVariant } from "./tooltip.variants.ts";

export type TooltipProps = BaseTooltipProps;

/**
 * Tooltip variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const tooltipVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "z-50 rounded-md px-3 py-1.5 text-sm shadow-md data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: tooltipVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Tooltip component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Tooltip variant="default">
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>Helpful tooltip text</TooltipContent>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.ForwardRefExoticComponent<
  BaseTooltipProps & {
    variant?: TooltipVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseTooltipProps & { variant?: TooltipVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseTooltip
      ref={ref}
      {...props}
      className={cn(tooltipVariants({ variant }), className)}
    >
      {children}
    </BaseTooltip>
  );
});

Tooltip.displayName = "Tooltip";
