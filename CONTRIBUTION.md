# Contributing to luman-ui

Thank you for your interest in contributing to luman-ui! This guide will help you set up your development environment and understand the project workflow.

## Prerequisites

- Node.js >= 22
- pnpm v10.24.0 or later

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Project Structure

This is a Turborepo monorepo focused on building a React component library with design tokens-driven development:

- **packages/design-tokens** (`@luman-ui/design-tokens`) - Design tokens build system for generating TypeScript types, Tailwind CSS config, and CVA variants from W3C Design Tokens
- **packages/core** (`@luman-ui/core`) - Core React component library built on Base-UI primitives

## Development Workflow

### Important: ESM File Extensions

This project uses ES Modules (ESM). **You must include file extensions on all local imports** in TypeScript source files:

```typescript
// ✅ Correct - use .ts for TypeScript files
import { foo } from "./utils/helper.ts"
import type { Bar } from "./types.ts"

// ❌ Wrong - omitting extensions will fail
import { foo } from "./utils/helper"
```

**How it works:**

1. You write `.ts` extensions in your source files
2. TypeScript allows this via `allowImportingTsExtensions: true`
3. The bundler (`tsdown`) automatically rewrites them to `.js` in the build output
4. Node.js receives the correct `.js` extensions at runtime

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@luman-ui/core
pnpm build --filter=@luman-ui/design-tokens
```

**Always test the built output**, not just TypeScript compilation.

### Running in Watch Mode

```bash
# Watch mode for all packages
pnpm dev

# Watch mode for design tokens in core package
pnpm dev:tokens --filter=@luman-ui/core
```

### Code Quality

```bash
# Run linting (oxlint)
pnpm lint

# Format code (Prettier)
pnpm format

# Check formatting without changes
pnpm format:check

# Type checking
pnpm check-types
```

## Working with Design Tokens

The design tokens system is the core of the component styling workflow. Tokens follow the [W3C Design Tokens specification](https://designtokens.org/).

### Token Commands

```bash
# Initialize design tokens (creates config and starter tokens file)
pnpm exec design-tokens init

# Build tokens (generates TypeScript types, Tailwind theme, CVA variants)
pnpm exec design-tokens build

# Watch mode for development
pnpm exec design-tokens build --watch

# Within @luman-ui/core package:
pnpm build:tokens --filter=@luman-ui/core    # Build tokens
pnpm dev:tokens --filter=@luman-ui/core      # Watch mode
```

### Generated Outputs

The build system generates three types of files:

1. **TypeScript Types** - `src/components/component-types.ts`
   - Component variant types (e.g., `ButtonVariant = 'primary' | 'secondary'`)
   - Const arrays of valid values for runtime validation

2. **Tailwind v4 Theme** - `src/tailwind.css`
   - CSS custom properties with `@theme` directive
   - Import this file in your main CSS/entry point

3. **CVA Variants** - `src/components/{ComponentName}/{componentName}.variants.ts`
   - CVA variant definitions for each component
   - Auto-mapped from design tokens to Tailwind utility classes

**IMPORTANT**: Never manually edit generated files (files with `.gen.ts` or `.generated.ts` suffix). They will be overwritten on the next build.

### Token Reference Resolution

The system supports W3C token references for reusability:

```json
{
  "color": {
    "brand": {
      "600": { "$value": "#2563eb", "$type": "color" }
    }
  },
  "component": {
    "button": {
      "variant": {
        "primary": {
          "background": {
            "default": { "$value": "{color.brand.600}", "$type": "color" }
          }
        }
      }
    }
  }
}
```

The `{color.brand.600}` reference automatically resolves to `#2563eb`.

## Adding New Components

When adding components to `@luman-ui/core`:

1. **Define variants in design tokens** - Edit `src/design-tokens.json` and add component variants under `component.{componentName}.variant`

2. **Generate tokens** - Run `pnpm build:tokens` to generate types and CVA variants

3. **Create component file** - Create `src/components/{ComponentName}/{ComponentName}.tsx`

4. **Import generated code**:

   ```typescript
   import { {componentName}VariantClasses } from './{componentName}.variants.ts'
   import type { {ComponentName}Variant } from '../component-types.ts'
   ```

5. **Build component** - Use Base-UI primitive, apply CVA with base classes, combine with generated variants

6. **Add tests** - Create `{ComponentName}.test.tsx` with comprehensive test coverage

7. **Export component** - Add to `src/components/index.ts`

8. **Update package.json exports** - Add export path for tree-shaking:

   ```json
   {
     "exports": {
       "./{componentName}": {
         "types": "./dist/{ComponentName}.d.mts",
         "import": "./dist/{ComponentName}.mjs"
       }
     }
   }
   ```

9. **Update tsdown config** - Add entry point to `tsdown.config.ts`

### Example Workflow

```bash
# 1. Edit design tokens
vim packages/core/src/design-tokens.json

# 2. Generate types and variants
cd packages/core && pnpm build:tokens

# 3. Create component
mkdir -p src/components/Input
vim src/components/Input/Input.tsx

# 4. Test
pnpm test

# 5. Build
pnpm build
```

### Component Architecture

Components follow this pattern:

1. Import Base-UI primitive component
2. Import generated variant types and CVA classes from design tokens
3. Define component-specific base classes (structural, interactive styles)
4. Combine CVA variants with base classes
5. Export typed component with variant props

Example (Button component):

```typescript
import * as React from "react"
import { Button as BaseButton, type ButtonProps } from "@base-ui-components/react"
import { cva } from "class-variance-authority"
import { cn } from "../../utils/cn.ts"
import { buttonVariantClasses, type ButtonVariant } from "./button.variants.ts"

const buttonVariants = cva(
  // Base classes - structural and interactive styles
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    // Variant classes - visual styling from design tokens
    variants: buttonVariantClasses,
    defaultVariants: {
      variant: "primary",
    },
  }
)

export const Button: React.ForwardRefExoticComponent<
  ButtonProps & { variant?: ButtonVariant }
> = React.forwardRef<HTMLButtonElement, ButtonProps & { variant?: ButtonVariant }>(
  ({ variant = "primary", className, children, ...props }, ref) => {
    return (
      <BaseButton ref={ref} {...props} className={cn(buttonVariants({ variant }), className)}>
        {children}
      </BaseButton>
    )
  }
)

Button.displayName = "Button"
```

## Testing

Within the `@luman-ui/core` package:

```bash
# Run unit tests with Vitest
pnpm test

# Run tests with Vitest UI
pnpm test:ui

# Run tests with coverage reporting
pnpm test:coverage
```

The testing setup uses:

- **Test runner**: Vitest with globals enabled
- **Environment**: jsdom for DOM testing
- **Utilities**: @testing-library/react, @testing-library/user-event, @testing-library/jest-dom

## Import Organization

Organize imports in this order:

1. External dependencies (React, third-party libraries)
2. Internal workspace packages (`@luman-ui/*`)
3. Relative imports (components, utilities, types)
4. Type-only imports (keep separate with `import type`)

Example:

```typescript
import * as React from "react"
import { Button as BaseButton } from "@base-ui-components/react"
import { cva } from "class-variance-authority"

import { cn } from "../../utils/cn.ts"
import { buttonVariantClasses } from "./button.variants.ts"

import type { ButtonProps } from "@base-ui-components/react"
import type { ButtonVariant } from "../component-types.ts"
```

## File Naming Conventions

- **Components**: PascalCase for files and exports (`Button.tsx`, `export const Button`)
- **Utilities**: camelCase for files and exports (`cn.ts`, `export function cn`)
- **Types**: PascalCase for type names, `.ts` extension for type-only files
- **Tests**: Same name as component with `.test.tsx` suffix (`Button.test.tsx`)
- **Config files**: kebab-case with extension (`design-tokens.config.ts`, `tsdown.config.ts`)
- **Generated files**: `.gen.ts` or `.generated.ts` suffix (automatically ignored by linters)

## Pull Request Guidelines

1. Ensure all tests pass: `pnpm test --filter=@luman-ui/core`
2. Ensure type checking passes: `pnpm check-types`
3. Ensure code is properly formatted: `pnpm format`
4. Ensure no linting errors: `pnpm lint`
5. Build succeeds: `pnpm build`
6. Provide clear description of changes

## Questions?

If you have questions or need help, please open an issue on GitHub.
