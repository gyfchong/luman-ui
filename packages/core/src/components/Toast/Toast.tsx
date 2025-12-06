import * as React from "react";
import {
  Toast as BaseToast,
  type ToastProps as BaseToastProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { toastVariantClasses, type ToastVariant } from "./toast.variants.ts";

export type ToastProps = BaseToastProps;

/**
 * Toast variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const toastVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "pointer-events-auto relative z-50 flex w-full max-w-md items-center gap-3 overflow-hidden rounded-md p-4 shadow-lg transition-all data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: toastVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Toast component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Toast variant="default">
 *   <ToastTitle>Notification</ToastTitle>
 *   <ToastDescription>Your changes have been saved.</ToastDescription>
 * </Toast>
 * ```
 */
export const Toast: React.ForwardRefExoticComponent<
  BaseToastProps & {
    variant?: ToastVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseToastProps & { variant?: ToastVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseToast
      ref={ref}
      {...props}
      className={cn(toastVariants({ variant }), className)}
    >
      {children}
    </BaseToast>
  );
});

Toast.displayName = "Toast";
