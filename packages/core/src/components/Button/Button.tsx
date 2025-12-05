import * as React from "react";
import {
  Button as BaseButton,
  type ButtonProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { buttonVariantClasses, type ButtonVariant } from "./button.variants.ts";

/**
 * Button variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const buttonVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: buttonVariantClasses,
    defaultVariants: {
      variant: "primary",
    },
  }
);

/**
 * Button component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 *
 * <Button variant="destructive">
 *   Delete
 * </Button>
 * ```
 */
export const Button: React.ForwardRefExoticComponent<
  ButtonProps & {
    variant?: ButtonVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { variant?: ButtonVariant }
>(({ variant = "primary", className, children, ...props }, ref) => {
  return (
    <BaseButton
      ref={ref}
      {...props}
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </BaseButton>
  );
});

Button.displayName = "Button";
