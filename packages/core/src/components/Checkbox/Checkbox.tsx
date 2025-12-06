import * as React from "react";
import {
  Checkbox as BaseCheckbox,
  type CheckboxProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { checkboxVariantClasses, type CheckboxVariant } from "./checkbox.variants.ts";

/**
 * Checkbox variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const checkboxVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex h-5 w-5 items-center justify-center rounded border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: checkboxVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Checkbox component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Checkbox variant="default" checked={checked} onChange={setChecked} />
 *
 * <Checkbox variant="primary">
 *   <Checkbox.Indicator>✓</Checkbox.Indicator>
 * </Checkbox>
 * ```
 */
export const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps & {
    variant?: CheckboxVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  CheckboxProps & { variant?: CheckboxVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseCheckbox
      ref={ref}
      {...props}
      className={cn(checkboxVariants({ variant }), className)}
    >
      {children}
    </BaseCheckbox>
  );
});

Checkbox.displayName = "Checkbox";
