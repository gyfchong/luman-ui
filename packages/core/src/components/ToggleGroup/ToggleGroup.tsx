import * as React from "react";
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { toggleGroupVariantClasses, type ToggleGroupVariant } from "./toggleGroup.variants.ts";

export type ToggleGroupProps = BaseToggleGroupProps;

/**
 * ToggleGroup variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const toggleGroupVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex items-center gap-1 rounded-md p-1",
  {
    // Variant classes - visual styling from design tokens
    variants: toggleGroupVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * ToggleGroup component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <ToggleGroup variant="default" type="single">
 *   <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
 *   <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
 *   <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup: React.ForwardRefExoticComponent<
  BaseToggleGroupProps & {
    variant?: ToggleGroupVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseToggleGroupProps & { variant?: ToggleGroupVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseToggleGroup
      ref={ref}
      {...props}
      className={cn(toggleGroupVariants({ variant }), className)}
    >
      {children}
    </BaseToggleGroup>
  );
});

ToggleGroup.displayName = "ToggleGroup";
