import * as React from "react";
import {
  CheckboxGroup as BaseCheckboxGroup,
  type CheckboxGroupProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { checkboxGroupVariantClasses, type CheckboxGroupVariant } from "./checkboxGroup.variants.ts";

/**
 * CheckboxGroup variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const checkboxGroupVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex flex-col gap-2",
  {
    // Variant classes - visual styling from design tokens
    variants: checkboxGroupVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * CheckboxGroup component built on Base-UI with design token variants
 * Provides shared state for a series of checkboxes
 *
 * @example
 * ```tsx
 * <CheckboxGroup variant="default" value={selected} onChange={setSelected}>
 *   <Checkbox value="option1">Option 1</Checkbox>
 *   <Checkbox value="option2">Option 2</Checkbox>
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup: React.ForwardRefExoticComponent<
  CheckboxGroupProps & {
    variant?: CheckboxGroupVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps & { variant?: CheckboxGroupVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseCheckboxGroup
      ref={ref}
      {...props}
      className={cn(checkboxGroupVariants({ variant }), className)}
    >
      {children}
    </BaseCheckboxGroup>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";
