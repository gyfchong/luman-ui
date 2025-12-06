import * as React from "react";
import {
  ScrollArea as BaseScrollArea,
  type ScrollAreaProps as BaseScrollAreaProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { scrollAreaVariantClasses, type ScrollAreaVariant } from "./scrollArea.variants.ts";

export type ScrollAreaProps = BaseScrollAreaProps;

/**
 * ScrollArea variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const scrollAreaVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "relative overflow-hidden",
  {
    // Variant classes - visual styling from design tokens
    variants: scrollAreaVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * ScrollArea component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <ScrollArea variant="default" className="h-[200px] w-[350px]">
 *   <div className="p-4">
 *     {Array.from({ length: 50 }).map((_, i) => (
 *       <div key={i}>Item {i + 1}</div>
 *     ))}
 *   </div>
 * </ScrollArea>
 * ```
 */
export const ScrollArea: React.ForwardRefExoticComponent<
  BaseScrollAreaProps & {
    variant?: ScrollAreaVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseScrollAreaProps & { variant?: ScrollAreaVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseScrollArea
      ref={ref}
      {...props}
      className={cn(scrollAreaVariants({ variant }), className)}
    >
      {children}
    </BaseScrollArea>
  );
});

ScrollArea.displayName = "ScrollArea";
