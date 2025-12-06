import * as React from "react";
import {
  Radio as BaseRadio,
  type RadioProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { radioVariantClasses, type RadioVariant } from "./radio.variants.ts";

/**
 * Radio variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const radioVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: radioVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Radio component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Radio variant="default" value="option1" checked={selected === "option1"} />
 *
 * <Radio variant="primary" value="option2">
 *   <Radio.Indicator />
 * </Radio>
 * ```
 */
export const Radio: React.ForwardRefExoticComponent<
  RadioProps & {
    variant?: RadioVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  RadioProps & { variant?: RadioVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseRadio
      ref={ref}
      {...props}
      className={cn(radioVariants({ variant }), className)}
    >
      {children}
    </BaseRadio>
  );
});

Radio.displayName = "Radio";
