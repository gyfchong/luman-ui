import * as React from "react";
import {
  Dialog as BaseDialog,
  type DialogProps as BaseDialogProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { dialogVariantClasses, type DialogVariant } from "./dialog.variants.ts";

export type DialogProps = BaseDialogProps;

/**
 * Dialog variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const dialogVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: dialogVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Dialog component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Dialog variant="default">
 *   <DialogContent>
 *     <h2>Dialog Title</h2>
 *     <p>Dialog content goes here</p>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog: React.ForwardRefExoticComponent<
  BaseDialogProps & {
    variant?: DialogVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseDialogProps & { variant?: DialogVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseDialog
      ref={ref}
      {...props}
      className={cn(dialogVariants({ variant }), className)}
    >
      {children}
    </BaseDialog>
  );
});

Dialog.displayName = "Dialog";
