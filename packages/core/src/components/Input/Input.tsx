import * as React from "react";
import {
  Input as BaseInput,
  type InputProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { inputVariantClasses, type InputVariant } from "./input.variants.ts";

/**
 * Input variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const inputVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "w-full rounded-md border px-3 py-2 text-base transition-colors focus:outline focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: inputVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Input component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Input variant="default" placeholder="Enter text..." />
 *
 * <Input variant="error" value={value} onChange={onChange} />
 * ```
 */
export const Input: React.ForwardRefExoticComponent<
  InputProps & {
    variant?: InputVariant;
  }
> = React.forwardRef<
  HTMLInputElement,
  InputProps & { variant?: InputVariant }
>(({ variant = "default", className, ...props }, ref) => {
  return (
    <BaseInput
      ref={ref}
      {...props}
      className={cn(inputVariants({ variant }), className)}
    />
  );
});

Input.displayName = "Input";
