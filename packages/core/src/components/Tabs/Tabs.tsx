import * as React from "react";
import {
  Tabs as BaseTabs,
  type TabsProps as BaseTabsProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { tabsVariantClasses, type TabsVariant } from "./tabs.variants.ts";

export type TabsProps = BaseTabsProps;

/**
 * Tabs variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const tabsVariants = cva(
  // Base classes - structural styles for tabs container
  "w-full",
  {
    // Variant classes - visual styling from design tokens
    variants: tabsVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Tabs component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Tabs variant="default" defaultValue="tab1">
 *   <TabsList>
 *     <Tab value="tab1">Tab 1</Tab>
 *     <Tab value="tab2">Tab 2</Tab>
 *   </TabsList>
 *   <TabPanel value="tab1">Content 1</TabPanel>
 *   <TabPanel value="tab2">Content 2</TabPanel>
 * </Tabs>
 * ```
 */
export const Tabs: React.ForwardRefExoticComponent<
  BaseTabsProps & {
    variant?: TabsVariant;
  }
> = React.forwardRef<HTMLDivElement, BaseTabsProps & { variant?: TabsVariant }>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <BaseTabs
        ref={ref}
        {...props}
        className={cn(tabsVariants({ variant }), className)}
      >
        {children}
      </BaseTabs>
    );
  }
);

Tabs.displayName = "Tabs";
