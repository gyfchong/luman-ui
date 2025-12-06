import * as React from "react";
import {
  Menubar as BaseMenubar,
  type MenubarProps as BaseMenubarProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  menubarVariantClasses,
  type MenubarVariant,
} from "./menubar.variants.ts";

export type MenubarProps = BaseMenubarProps;

/**
 * Menubar variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const menubarVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex items-center gap-1 rounded-md p-1",
  {
    // Variant classes - visual styling from design tokens
    variants: menubarVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Menubar component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Menubar variant="default">
 *   <MenubarMenu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenubarContent>
 *       <MenubarItem>New</MenubarItem>
 *       <MenubarItem>Open</MenubarItem>
 *     </MenubarContent>
 *   </MenubarMenu>
 * </Menubar>
 * ```
 */
export const Menubar: React.ForwardRefExoticComponent<
  BaseMenubarProps & {
    variant?: MenubarVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseMenubarProps & { variant?: MenubarVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseMenubar
      ref={ref}
      {...props}
      className={cn(menubarVariants({ variant }), className)}
    >
      {children}
    </BaseMenubar>
  );
});

Menubar.displayName = "Menubar";
