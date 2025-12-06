import * as React from "react";
import {
  Form as BaseForm,
  type FormProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { formVariantClasses, type FormVariant } from "./form.variants.ts";

/**
 * Form variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const formVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex flex-col gap-4",
  {
    // Variant classes - visual styling from design tokens
    variants: formVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Form component built on Base-UI with design token variants
 * Provides consolidated error handling for form submissions
 *
 * @example
 * ```tsx
 * <Form variant="default" onSubmit={handleSubmit}>
 *   <Field>
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control render={<Input />} />
 *   </Field>
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
export const Form: React.ForwardRefExoticComponent<
  FormProps & {
    variant?: FormVariant;
  }
> = React.forwardRef<
  HTMLFormElement,
  FormProps & { variant?: FormVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseForm
      ref={ref}
      {...props}
      className={cn(formVariants({ variant }), className)}
    >
      {children}
    </BaseForm>
  );
});

Form.displayName = "Form";
