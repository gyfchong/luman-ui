import * as React from "react";
import {
  Select as BaseSelect,
  type SelectProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { selectVariantClasses, type SelectVariant } from "./select.variants.ts";

/**
 * Select variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const selectVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-base transition-colors focus:outline focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: selectVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Select component built on Base-UI with design token variants
 * For choosing a predefined value in a dropdown menu
 *
 * @example
 * ```tsx
 * <Select variant="default" value={value} onChange={setValue}>
 *   <Select.Option value="option1">Option 1</Select.Option>
 *   <Select.Option value="option2">Option 2</Select.Option>
 * </Select>
 * ```
 */
export const Select: React.ForwardRefExoticComponent<
  SelectProps & {
    variant?: SelectVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  SelectProps & { variant?: SelectVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseSelect
      ref={ref}
      {...props}
      className={cn(selectVariants({ variant }), className)}
    >
      {children}
    </BaseSelect>
  );
});

Select.displayName = "Select";
