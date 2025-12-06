import * as React from "react";
import {
  Toolbar as BaseToolbar,
  type ToolbarProps as BaseToolbarProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { toolbarVariantClasses, type ToolbarVariant } from "./toolbar.variants.ts";

export type ToolbarProps = BaseToolbarProps;

/**
 * Toolbar variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const toolbarVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex items-center gap-2 rounded-md p-2",
  {
    // Variant classes - visual styling from design tokens
    variants: toolbarVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Toolbar component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Toolbar variant="default" aria-label="Text formatting">
 *   <Button>Bold</Button>
 *   <Button>Italic</Button>
 *   <Separator />
 *   <Button>Underline</Button>
 * </Toolbar>
 * ```
 */
export const Toolbar: React.ForwardRefExoticComponent<
  BaseToolbarProps & {
    variant?: ToolbarVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseToolbarProps & { variant?: ToolbarVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseToolbar
      ref={ref}
      {...props}
      className={cn(toolbarVariants({ variant }), className)}
    >
      {children}
    </BaseToolbar>
  );
});

Toolbar.displayName = "Toolbar";
