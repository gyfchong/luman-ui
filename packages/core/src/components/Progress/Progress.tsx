import * as React from "react";
import {
  Progress as BaseProgress,
  type ProgressProps as BaseProgressProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  progressVariantClasses,
  type ProgressVariant,
} from "./progress.variants.ts";

export type ProgressProps = BaseProgressProps;

/**
 * Progress variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const progressVariants = cva(
  // Base classes - structural styles for progress bar
  "relative w-full overflow-hidden rounded-full",
  {
    // Variant classes - visual styling from design tokens
    variants: progressVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Progress component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Progress variant="default" value={60} max={100} />
 * <Progress variant="success" value={100} />
 * ```
 */
export const Progress: React.ForwardRefExoticComponent<
  BaseProgressProps & {
    variant?: ProgressVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseProgressProps & { variant?: ProgressVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseProgress
      ref={ref}
      {...props}
      className={cn(progressVariants({ variant }), className)}
    >
      {children}
    </BaseProgress>
  );
});

Progress.displayName = "Progress";
