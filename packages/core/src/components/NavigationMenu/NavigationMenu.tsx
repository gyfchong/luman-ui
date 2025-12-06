import * as React from "react";
import {
  NavigationMenu as BaseNavigationMenu,
  type NavigationMenuProps as BaseNavigationMenuProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  navigationMenuVariantClasses,
  type NavigationMenuVariant,
} from "./navigationMenu.variants.ts";

export type NavigationMenuProps = BaseNavigationMenuProps;

/**
 * NavigationMenu variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const navigationMenuVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "flex items-center gap-1",
  {
    // Variant classes - visual styling from design tokens
    variants: navigationMenuVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * NavigationMenu component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <NavigationMenu variant="default">
 *   <NavigationMenuItem>
 *     <NavigationMenuLink href="/home">Home</NavigationMenuLink>
 *   </NavigationMenuItem>
 * </NavigationMenu>
 * ```
 */
export const NavigationMenu: React.ForwardRefExoticComponent<
  BaseNavigationMenuProps & {
    variant?: NavigationMenuVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseNavigationMenuProps & { variant?: NavigationMenuVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseNavigationMenu
      ref={ref}
      {...props}
      className={cn(navigationMenuVariants({ variant }), className)}
    >
      {children}
    </BaseNavigationMenu>
  );
});

NavigationMenu.displayName = "NavigationMenu";
