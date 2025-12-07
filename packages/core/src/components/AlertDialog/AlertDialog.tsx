import { AlertDialog as BaseAlertDialog } from "@base-ui-components/react/alert-dialog"
import { cva } from "class-variance-authority"
import { cn } from "../../utils/cn.ts"
import {
  alertDialogVariantClasses,
  type AlertDialogVariant,
} from "./alertDialog.variants.ts"
import { type ButtonVariant } from "../Button/button.variants.ts"
import { buttonVariants } from "../Button/Button.tsx"

export interface AlertDialogContent extends BaseAlertDialog.Popup.Props {
  variant?: AlertDialogVariant
}

/**
 * AlertDialog variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const alertPopupVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "fixed top-1/2 left-1/2",
  {
    // Variant classes - visual styling from design tokens
    variants: alertDialogVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
)

export function AlertDialogContent({
  variant,
  className,
  children,
  ...props
}: AlertDialogContent) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
      <BaseAlertDialog.Popup
        {...props}
        className={cn(alertPopupVariants({ variant }), className)}
      >
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  )
}

export function AlertDialog(props: BaseAlertDialog.Root.Props) {
  return <BaseAlertDialog.Root {...props} />
}
export function AlertDialogViewPort(props: BaseAlertDialog.Viewport.Props) {
  return <BaseAlertDialog.Viewport {...props} />
}

export function AlertDialogTitle(props: BaseAlertDialog.Title.Props) {
  return <BaseAlertDialog.Title {...props} />
}

export function AlertDialogDescription(
  props: BaseAlertDialog.Description.Props
) {
  return <BaseAlertDialog.Description {...props} />
}

interface AlertDialogTriggerProps extends BaseAlertDialog.Trigger.Props {
  variant: ButtonVariant
}

export function AlertDialogTrigger({
  variant,
  ...props
}: AlertDialogTriggerProps) {
  return <BaseAlertDialog.Trigger {...props} />
}

interface AlertDialogCloseProps extends BaseAlertDialog.Close.Props {
  variant: ButtonVariant
}

export function AlertDialogClose({ variant, ...props }: AlertDialogCloseProps) {
  return (
    <BaseAlertDialog.Close
      {...props}
      className={cn(buttonVariants({ variant }), props.className)}
    />
  )
}

const App = () => (
  <AlertDialog>
    <AlertDialogTrigger variant="primary">Open Alert Dialog</AlertDialogTrigger>
    <AlertDialogContent variant="default">
      <AlertDialogTitle>Alert Dialog Title</AlertDialogTitle>
      <AlertDialogDescription>
        This is an alert dialog description.
      </AlertDialogDescription>
      <AlertDialogClose variant="primary">Close</AlertDialogClose>
      <AlertDialogClose variant="destructive">Delete</AlertDialogClose>
    </AlertDialogContent>
  </AlertDialog>
)
