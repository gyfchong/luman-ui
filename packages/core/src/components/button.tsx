import { Button as BaseButton } from "@base-ui-components/react";
import * as React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps {
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
 * Button component built on Base-UI
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 */
export const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, disabled = false, type = "button", onClick, className },
    ref
  ) => {
    return (
      <BaseButton
        ref={ref}
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={cn(
          "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50",
          className
        )}
      >
        {children}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";
