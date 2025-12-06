import * as React from "react";
import {
  Meter as BaseMeter,
  type MeterProps as BaseMeterProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { meterVariantClasses, type MeterVariant } from "./meter.variants.ts";

export type MeterProps = BaseMeterProps;

/**
 * Meter variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const meterVariants = cva(
  // Base classes - structural styles for meter
  "relative w-full overflow-hidden rounded-full",
  {
    // Variant classes - visual styling from design tokens
    variants: meterVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Meter component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Meter variant="default" value={60} min={0} max={100} />
 * <Meter variant="warning" value={80} optimum={50} />
 * ```
 */
export const Meter: React.ForwardRefExoticComponent<
  BaseMeterProps & {
    variant?: MeterVariant;
  }
> = React.forwardRef<HTMLDivElement, BaseMeterProps & { variant?: MeterVariant }>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <BaseMeter
        ref={ref}
        {...props}
        className={cn(meterVariants({ variant }), className)}
      >
        {children}
      </BaseMeter>
    );
  }
);

Meter.displayName = "Meter";
