import * as React from "react";
import {
  Menu as BaseMenu,
  type MenuProps as BaseMenuProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { menuVariantClasses, type MenuVariant } from "./menu.variants.ts";

export type MenuProps = BaseMenuProps;

/**
 * Menu variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const menuVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "z-50 min-w-[8rem] overflow-hidden rounded-md p-1 shadow-md outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
  {
    // Variant classes - visual styling from design tokens
    variants: menuVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Menu component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Menu variant="default">
 *   <MenuTrigger>Open menu</MenuTrigger>
 *   <MenuContent>
 *     <MenuItem>Item 1</MenuItem>
 *     <MenuItem>Item 2</MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export const Menu: React.ForwardRefExoticComponent<
  BaseMenuProps & {
    variant?: MenuVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseMenuProps & { variant?: MenuVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseMenu
      ref={ref}
      {...props}
      className={cn(menuVariants({ variant }), className)}
    >
      {children}
    </BaseMenu>
  );
});

Menu.displayName = "Menu";
