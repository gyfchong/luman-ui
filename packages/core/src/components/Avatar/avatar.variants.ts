/**
 * Auto-generated variant classes for avatar
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { avatarVariantClasses } from './Avatar.variants.ts'
 *
 * const avatarVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: avatarVariantClasses,
 *     defaultVariants: { variant: 'default' }
 *   }
 * )
 * ```
 */
export const avatarVariantClasses = {
  variant: {
        default: [
          'bg-avatar-default-background-default',
          'hover:bg-avatar-default-background-hover',
          'text-avatar-default-text',
          'border border-avatar-default-border'
        ],
        primary: [
          'bg-avatar-primary-background-default',
          'hover:bg-avatar-primary-background-hover',
          'text-avatar-primary-text',
          'border border-avatar-primary-border'
        ]
  }
} as const

export type AvatarVariant = 'default' | 'primary'
