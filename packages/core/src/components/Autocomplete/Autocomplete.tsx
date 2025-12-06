import * as React from "react";
import {
  Autocomplete as BaseAutocomplete,
  type AutocompleteProps as BaseAutocompleteProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { autocompleteVariantClasses, type AutocompleteVariant } from "./autocomplete.variants.ts";

export type AutocompleteProps = BaseAutocompleteProps;

/**
 * Autocomplete variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const autocompleteVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "relative w-full",
  {
    // Variant classes - visual styling from design tokens
    variants: autocompleteVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Autocomplete component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Autocomplete variant="default">
 *   <Autocomplete.Input placeholder="Type to search..." />
 *   <Autocomplete.Listbox>
 *     <Autocomplete.Option value="result1">Result 1</Autocomplete.Option>
 *     <Autocomplete.Option value="result2">Result 2</Autocomplete.Option>
 *   </Autocomplete.Listbox>
 * </Autocomplete>
 * ```
 */
export const Autocomplete: React.ForwardRefExoticComponent<
  BaseAutocompleteProps & {
    variant?: AutocompleteVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseAutocompleteProps & { variant?: AutocompleteVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseAutocomplete
      ref={ref}
      {...props}
      className={cn(autocompleteVariants({ variant }), className)}
    >
      {children}
    </BaseAutocomplete>
  );
});

Autocomplete.displayName = "Autocomplete";
