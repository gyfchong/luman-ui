import { Button as BaseButton } from "@base-ui-components/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils/cn.ts";
import type { ButtonVariant } from "../tokens/generated/component-types.ts";

/**
 * Button variants using design tokens
 */
const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-button-primary-background-default text-button-primary-text hover:bg-button-primary-background-hover border border-button-primary-border",
        secondary:
          "bg-button-secondary-background-default text-button-secondary-text hover:bg-button-secondary-background-hover border border-button-secondary-border",
        outline:
          "bg-button-outline-background-default text-button-outline-text hover:bg-button-outline-background-hover border border-button-outline-border",
        ghost:
          "bg-button-ghost-background-default text-button-ghost-text hover:bg-button-ghost-background-hover border border-button-ghost-border",
        destructive:
          "bg-button-destructive-background-default text-button-destructive-text hover:bg-button-destructive-background-hover border border-button-destructive-border",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  /**
   * Visual variant (auto-generated from design tokens)
   */
  variant?: ButtonVariant;
  /**
   * The content of the button
   */
  children?: React.ReactNode;
  /**
   * If true, the button will be disabled
   */
  disabled?: boolean;
  /**
   * The type of the button
   */
  type?: "button" | "submit" | "reset";
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Additional class name for styling
   */
  className?: string;
}

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
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      children,
      disabled = false,
      type = "button",
      onClick,
      className,
    },
    ref
  ) => {
    return (
      <BaseButton
        ref={ref}
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={cn(buttonVariants({ variant }), className)}
      >
        {children}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";
