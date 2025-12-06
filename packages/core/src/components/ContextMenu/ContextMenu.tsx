import * as React from "react";
import {
  ContextMenu as BaseContextMenu,
  type ContextMenuProps as BaseContextMenuProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { contextMenuVariantClasses, type ContextMenuVariant } from "./contextMenu.variants.ts";

export type ContextMenuProps = BaseContextMenuProps;

/**
 * ContextMenu variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const contextMenuVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "z-50 min-w-[8rem] overflow-hidden rounded-md p-1 shadow-md outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: contextMenuVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * ContextMenu component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <ContextMenu variant="default">
 *   <ContextMenuTrigger>Right click me</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Action 1</ContextMenuItem>
 *     <ContextMenuItem>Action 2</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */
export const ContextMenu: React.ForwardRefExoticComponent<
  BaseContextMenuProps & {
    variant?: ContextMenuVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseContextMenuProps & { variant?: ContextMenuVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseContextMenu
      ref={ref}
      {...props}
      className={cn(contextMenuVariants({ variant }), className)}
    >
      {children}
    </BaseContextMenu>
  );
});

ContextMenu.displayName = "ContextMenu";
