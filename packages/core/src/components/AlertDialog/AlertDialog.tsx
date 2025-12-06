import * as React from "react";
import {
  AlertDialog as BaseAlertDialog,
  type AlertDialogProps as BaseAlertDialogProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { alertDialogVariantClasses, type AlertDialogVariant } from "./alertDialog.variants.ts";

export type AlertDialogProps = BaseAlertDialogProps;

/**
 * AlertDialog variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const alertDialogVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: alertDialogVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * AlertDialog component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <AlertDialog variant="default">
 *   <AlertDialogContent>
 *     <h2>Are you sure?</h2>
 *     <p>This action cannot be undone.</p>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
export const AlertDialog: React.ForwardRefExoticComponent<
  BaseAlertDialogProps & {
    variant?: AlertDialogVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseAlertDialogProps & { variant?: AlertDialogVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseAlertDialog
      ref={ref}
      {...props}
      className={cn(alertDialogVariants({ variant }), className)}
    >
      {children}
    </BaseAlertDialog>
  );
});

AlertDialog.displayName = "AlertDialog";
