import * as React from "react";
import {
  Fieldset as BaseFieldset,
  type FieldsetProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { fieldsetVariantClasses, type FieldsetVariant } from "./fieldset.variants.ts";

/**
 * Fieldset variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const fieldsetVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "min-w-0 border p-4 rounded-md",
  {
    // Variant classes - visual styling from design tokens
    variants: fieldsetVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Fieldset component built on Base-UI with design token variants
 * Groups related form controls with an easily stylable legend
 *
 * @example
 * ```tsx
 * <Fieldset variant="default">
 *   <Fieldset.Legend>Personal Information</Fieldset.Legend>
 *   {children}
 * </Fieldset>
 * ```
 */
export const Fieldset: React.ForwardRefExoticComponent<
  FieldsetProps & {
    variant?: FieldsetVariant;
  }
> = React.forwardRef<
  HTMLFieldSetElement,
  FieldsetProps & { variant?: FieldsetVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseFieldset
      ref={ref}
      {...props}
      className={cn(fieldsetVariants({ variant }), className)}
    >
      {children}
    </BaseFieldset>
  );
});

Fieldset.displayName = "Fieldset";
