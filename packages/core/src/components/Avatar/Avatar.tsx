import * as React from "react";
import {
  Avatar as BaseAvatar,
  type AvatarProps as BaseAvatarProps,
} from "@base-ui-components/react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";
import {
  avatarVariantClasses,
  type AvatarVariant,
} from "./avatar.variants.ts";

export type AvatarProps = BaseAvatarProps;

/**
 * Avatar variants with component-specific base classes
 * Base classes are defined here, variant styling comes from design tokens
 */
const avatarVariants = cva(
  // Base classes - structural styles for avatar
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    // Variant classes - visual styling from design tokens
    variants: avatarVariantClasses,
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Avatar component built on Base-UI with design token variants
 *
 * @example
 * ```tsx
 * <Avatar variant="default">
 *   <AvatarImage src="/user.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 */
export const Avatar: React.ForwardRefExoticComponent<
  BaseAvatarProps & {
    variant?: AvatarVariant;
  }
> = React.forwardRef<HTMLSpanElement, BaseAvatarProps & { variant?: AvatarVariant }>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <BaseAvatar
        ref={ref}
        {...props}
        className={cn(avatarVariants({ variant }), className)}
      >
        {children}
      </BaseAvatar>
    );
  }
);

Avatar.displayName = "Avatar";
