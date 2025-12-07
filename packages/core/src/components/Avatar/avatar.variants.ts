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
          'bg-gray-200',
          'hover:bg-gray-200',
          'text-gray-600',
          'border border-transparent'
        ],
        primary: [
          'bg-blue-100',
          'hover:bg-blue-100',
          'text-blue-700',
          'border border-transparent'
        ]
  }
} as const

export type AvatarVariant = 'default' | 'primary'
