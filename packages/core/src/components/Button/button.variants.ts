/**
 * Auto-generated variant classes for button
 * DO NOT EDIT MANUALLY
 *
 * Generated from design-tokens.json
 *
 * Usage in your component:
 * ```tsx
 * import { cva } from 'class-variance-authority'
 * import { buttonVariantClasses } from './Button.variants.ts'
 *
 * const buttonVariants = cva(
 *   'your-base-classes-here', // Define your own base classes
 *   {
 *     variants: buttonVariantClasses,
 *     defaultVariants: { variant: 'primary' }
 *   }
 * )
 * ```
 */
export const buttonVariantClasses = {
  variant: {
        primary: [
          'bg-blue-600',
          'hover:bg-blue-700',
          'text-white',
          'border border-transparent'
        ],
        secondary: [
          'bg-gray-100',
          'hover:bg-gray-100',
          'text-gray-900',
          'border border-transparent'
        ],
        outline: [
          'bg-transparent',
          'hover:bg-gray-50',
          'text-gray-900',
          'border border-gray-300'
        ],
        ghost: [
          'bg-transparent',
          'hover:bg-gray-100',
          'text-gray-900',
          'border border-transparent'
        ],
        destructive: [
          'bg-red-600',
          'hover:bg-red-700',
          'text-white',
          'border border-transparent'
        ]
  }
} as const

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
