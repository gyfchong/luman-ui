import * as React from "react";
import {
  Slider as BaseSlider,
  type SliderProps as BaseSliderProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import { sliderVariantClasses, type SliderVariant } from "./slider.variants.ts";

export type SliderProps = BaseSliderProps;

/**
 * Slider variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const sliderVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "relative flex touch-none select-none items-center",
  {
    // Variant classes - visual styling from design tokens
    variants: sliderVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Slider component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Slider
 *   variant="default"
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   aria-label="Volume"
 * />
 * ```
 */
export const Slider: React.ForwardRefExoticComponent<
  BaseSliderProps & {
    variant?: SliderVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BaseSliderProps & { variant?: SliderVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BaseSlider
      ref={ref}
      {...props}
      className={cn(sliderVariants({ variant }), className)}
    >
      {children}
    </BaseSlider>
  );
});

Slider.displayName = "Slider";
