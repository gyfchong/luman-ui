import { Button as BaseButton } from "@mui/base/Button"
import * as React from "react"

export interface ButtonProps {
  /**
   * The content of the button
   */
  children?: React.ReactNode
  /**
   * If true, the button will be disabled
   */
  disabled?: boolean
  /**
   * The type of the button
   */
  type?: "button" | "submit" | "reset"
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Additional class name for styling
   */
  className?: string
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
  ({ children, disabled = false, type = "button", onClick, className }, ref) => {
    return (
      <BaseButton ref={ref} disabled={disabled} type={type} onClick={onClick} className={className}>
        {children}
      </BaseButton>
    )
  }
)

Button.displayName = "Button"
