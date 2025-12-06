import * as React from "react";
import {
  Field as BaseField,
  type FieldProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { fieldVariantClasses, type FieldVariant } from "./field.variants.ts";

/**
 * Field variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const fieldVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex flex-col gap-1",
  {
    // Variant classes - visual styling from design tokens
    variants: fieldVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Field component built on Base-UI with design token variants
 * Provides labeling and validation for form controls
 *
 * @example
 * ```tsx
 * <Field variant="default">
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control render={<Input />} />
 *   <Field.Error />
 * </Field>
 * ```
 */
export const Field: React.ForwardRefExoticComponent<
  FieldProps & {
    variant?: FieldVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  FieldProps & { variant?: FieldVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseField
      ref={ref}
      {...props}
      className={cn(fieldVariants({ variant }), className)}
    >
      {children}
    </BaseField>
  );
});

Field.displayName = "Field";
