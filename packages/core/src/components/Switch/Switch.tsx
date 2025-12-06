import * as React from "react";
import {
  Switch as BaseSwitch,
  type SwitchProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { switchVariantClasses, type SwitchVariant } from "./switch.variants.ts";

/**
 * Switch variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const switchVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "inline-flex h-6 w-11 items-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: switchVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Switch component built on Base-UI with design token variants
 * Indicates whether a setting is on or off
 *
 * @example
 * ```tsx
 * <Switch variant="default" checked={enabled} onChange={setEnabled} />
 *
 * <Switch variant="primary">
 *   <Switch.Thumb className="h-5 w-5 rounded-full bg-white transition-transform data-[checked]:translate-x-5" />
 * </Switch>
 * ```
 */
export const Switch: React.ForwardRefExoticComponent<
  SwitchProps & {
    variant?: SwitchVariant;
  }
> = React.forwardRef<
  HTMLButtonElement,
  SwitchProps & { variant?: SwitchVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseSwitch
      ref={ref}
      {...props}
      className={cn(switchVariants({ variant }), className)}
    >
      {children}
    </BaseSwitch>
  );
});

Switch.displayName = "Switch";
