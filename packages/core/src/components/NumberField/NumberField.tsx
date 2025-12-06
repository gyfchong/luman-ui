import * as React from "react";
import {
  NumberField as BaseNumberField,
  type NumberFieldProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { numberFieldVariantClasses, type NumberFieldVariant } from "./numberField.variants.ts";

/**
 * NumberField variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const numberFieldVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex items-center gap-1 rounded-md border",
  {
    // Variant classes - visual styling from design tokens
    variants: numberFieldVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * NumberField component built on Base-UI with design token variants
 * Provides increment/decrement buttons and a scrub area for numeric input
 *
 * @example
 * ```tsx
 * <NumberField variant="default" value={count} onChange={setCount}>
 *   <NumberField.Decrement />
 *   <NumberField.Input className="w-16 px-2 py-1 text-center" />
 *   <NumberField.Increment />
 * </NumberField>
 * ```
 */
export const NumberField: React.ForwardRefExoticComponent<
  NumberFieldProps & {
    variant?: NumberFieldVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  NumberFieldProps & { variant?: NumberFieldVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseNumberField
      ref={ref}
      {...props}
      className={cn(numberFieldVariants({ variant }), className)}
    >
      {children}
    </BaseNumberField>
  );
});

NumberField.displayName = "NumberField";
