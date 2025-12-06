import * as React from "react";
import {
  PreviewCard as BasePreviewCard,
  type PreviewCardProps as BasePreviewCardProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  previewCardVariantClasses,
  type PreviewCardVariant,
} from "./previewCard.variants.ts";

export type PreviewCardProps = BasePreviewCardProps;

/**
 * PreviewCard variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const previewCardVariants = cva(
  // Base classes - structural and interactive styles defined by the component
  "rounded-lg shadow-lg p-4 transition-opacity duration-200",
  {
    // Variant classes - visual styling from design tokens
    variants: previewCardVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * PreviewCard component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <PreviewCard variant="default">
 *   <PreviewCardTrigger href="/article">
 *     Read more
 *   </PreviewCardTrigger>
 *   <PreviewCardContent>
 *     <h3>Article Title</h3>
 *     <p>Preview text...</p>
 *   </PreviewCardContent>
 * </PreviewCard>
 * ```
 */
export const PreviewCard: React.ForwardRefExoticComponent<
  BasePreviewCardProps & {
    variant?: PreviewCardVariant;
  }
> = React.forwardRef<
  HTMLDivElement,
  BasePreviewCardProps & { variant?: PreviewCardVariant }
>(({ variant = "default", className, children, ...props }, ref) => {
  return (
    <BasePreviewCard
      ref={ref}
      {...props}
      className={cn(previewCardVariants({ variant }), className)}
    >
      {children}
    </BasePreviewCard>
  );
});

PreviewCard.displayName = "PreviewCard";
