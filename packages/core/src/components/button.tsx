import { Button as BaseButton } from "@base-ui-components/react";
import * as React from "react";
import { cn } from "../utils/cn.ts";
import { buttonVariants } from "./button.variants.ts";
import type { ButtonVariant } from "../tokens/generated/component-types.ts";

export interface ButtonProps {
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
