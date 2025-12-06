import * as React from "react";
import {
  Combobox as BaseCombobox,
  type ComboboxProps as BaseComboboxProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { comboboxVariantClasses, type ComboboxVariant } from "./combobox.variants.ts";

export type ComboboxProps = BaseComboboxProps;

/**
 * Combobox variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const comboboxVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "relative w-full",
  {
    // Variant classes - visual styling from design tokens
    variants: comboboxVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Combobox component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Combobox variant="default">
 *   <Combobox.Input placeholder="Select an option..." />
 *   <Combobox.Listbox>
 *     <Combobox.Option value="option1">Option 1</Combobox.Option>
 *     <Combobox.Option value="option2">Option 2</Combobox.Option>
 *   </Combobox.Listbox>
 * </Combobox>
 * ```
 */
export const Combobox: React.ForwardRefExoticComponent<
  BaseComboboxProps & {
    variant?: ComboboxVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseComboboxProps & { variant?: ComboboxVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseCombobox
      ref={ref}
      {...props}
      className={cn(comboboxVariants({ variant }), className)}
    >
      {children}
    </BaseCombobox>
  );
});

Combobox.displayName = "Combobox";
