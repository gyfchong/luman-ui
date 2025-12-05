# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

luman-ui is a Turborepo monorepo for building a React component library. The project is in early stages with placeholder packages and empty apps.

## Commands

### Build & Development

- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start development servers for all apps
- `pnpm lint` - Run oxlint linting across all packages and apps
- `pnpm check-types` - Run TypeScript type checking across all packages and apps

### Design Tokens

- `pnpm exec design-tokens init` - Initialize design tokens configuration and create starter tokens file
- `pnpm exec design-tokens build` - Build tokens and generate TypeScript types, Tailwind theme, and CVA variants
- `pnpm exec design-tokens build --watch` - Watch mode for development (auto-rebuild on changes)
- `pnpm exec design-tokens build --config <path>` - Build with custom config file

### Working with Specific Packages

Use Turbo filters to target specific packages:

## Architecture

### Monorepo Structure

The project includes the following packages:

- **@luman-ui/design-tokens** - Design tokens build system for generating TypeScript types, Tailwind CSS config, and CVA variants from W3C Design Tokens
- **@luman-ui/core** - Core component library
- **@luman-ui/cli** - CLI tooling

### Design Tokens System

The design tokens package (`@luman-ui/design-tokens`) provides a comprehensive build system for managing design tokens following the W3C Design Tokens specification.

#### Key Features

- **W3C Standards Compliant** - Follows the [W3C Design Tokens specification](https://designtokens.org/)
- **Type Safety** - Auto-generates TypeScript component types from token definitions
- **Tailwind v4 Integration** - Generates CSS theme files with `@theme` directive
- **CVA Variants** - Auto-generates CVA (Class Variance Authority) variant files for components
- **Watch Mode** - Development-friendly file watching for rapid iteration
- **Both API and CLI** - Use as a library or command-line tool

#### Configuration

Design tokens are configured via `design-tokens.config.ts` in each package. The configuration defines:

- `tokenSchema` - Path to design tokens JSON file (default: `"src/design-tokens.json"`)
- `styleSystem` - Style system for theme generation (currently only `"tailwind"`)
- `outputs.css` - CSS output file path (default: `"src/tailwind.css"`)
- `outputs.components` - Components directory for types and variants (default: `"src/components"`)

Example configuration:

```typescript
import { defineConfig } from "@luman-ui/design-tokens"

export default defineConfig({
  tokenSchema: "src/design-tokens.json",
  styleSystem: "tailwind",
  outputs: {
    css: "src/tailwind.css",
    components: "src/components",
  },
})
```

#### Generated Outputs

The build system generates three types of files:

1. **TypeScript Types** - `{components}/component-types.ts`
   - Component variant types (e.g., `ButtonVariant = 'primary' | 'secondary'`)
   - Const arrays of valid values for runtime validation

2. **Tailwind v4 Theme** - `{css}` (e.g., `src/tailwind.css`)
   - CSS custom properties with `@theme` directive
   - Includes all design token values as CSS variables
   - Import this file in your main CSS/entry point

3. **CVA Variants** - `{components}/{ComponentName}/{componentName}.variants.ts`
   - CVA variant definitions for each component
   - Auto-mapped from design tokens to Tailwind utility classes
   - Property mapping: `background` → `bg`, `text` → `text`, `border` → `border`

#### CLI Commands

The package provides a `design-tokens` CLI with the following commands:

- `pnpm exec design-tokens init` - Initialize configuration and create starter tokens file
- `pnpm exec design-tokens build` - Build tokens and generate outputs
- `pnpm exec design-tokens build --watch` - Watch mode for development (rebuilds on file changes)
- `pnpm exec design-tokens build --config <path>` - Use custom config file

#### Workflow

1. Define design tokens in `design-tokens.json` following W3C spec
2. Run `pnpm exec design-tokens build` to generate TypeScript types, Tailwind theme, and CVA variants
3. Use generated types and variants in components
4. During development, run `pnpm exec design-tokens build --watch` for automatic rebuilds

#### Token Reference Resolution

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

#### Integration with Build Pipeline

Design tokens generation is integrated into the package build process. Generated files are treated as build artifacts and should not be committed to version control (add to `.gitignore`).

**IMPORTANT**: All generated files from design tokens have a `.gen.ts` suffix or are placed in designated output directories. Do not manually edit these files - they will be overwritten on the next build.

### Package Manager

Uses **pnpm** with workspace protocol for internal dependencies. Node.js >=18 required.

### TypeScript Configuration

Each package manages its own TypeScript configuration independently using recommended TypeScript defaults:

- **apps/docs** - Vite-optimized config with bundler resolution, React JSX transform
- **packages/cli** - Strict ESNext config with bundler resolution for tsdown

All configs use strict type checking, ES2022 target, and modern module resolution.

**IMPORTANT - ESM Import Extensions:**
All local imports MUST include `.ts` extensions in TypeScript source files:

```typescript
import { foo } from "./utils/helper.ts" // ✅ Correct
import { foo } from "./utils/helper" // ❌ Wrong
```

The bundler (tsdown/tsup) automatically rewrites `.ts` to `.js` in the build output. This is required because:

- TypeScript configs use `allowImportingTsExtensions: true`
- Node.js ESM requires explicit file extensions at runtime
- The build tools handle the transformation automatically

### oxlint Configuration

oxlint is configured at the workspace root (`.oxlintrc.json`) for fast linting:

- Uses correctness and suspicious rules as errors
- Performance rules as warnings
- Ignores node_modules, dist, .output, .next, and generated files

All packages use the shared oxlint configuration.

### Turborepo Pipeline

Configured in `turbo.json`:

- `build` - Depends on upstream builds, outputs to `.next/**` (excluding cache)
- `lint` - Depends on upstream lint tasks
- `check-types` - Depends on upstream type checks
- `dev` - No caching, persistent task for dev servers

## Development Notes

### Current State

The project uses a design tokens system to generate TypeScript types, Tailwind themes, and CVA variants from W3C Design Tokens specifications.

### Working with Design Tokens

When adding or modifying design tokens:

1. Edit `design-tokens.json` in the relevant package (e.g., `packages/core/src/design-tokens.json`)
2. Follow the W3C Design Tokens specification format
3. Run `pnpm exec design-tokens build` or use watch mode during development
4. Generated files will be created in the configured output directories:
   - `src/components/component-types.ts` - TypeScript types
   - `src/components/{ComponentName}/{componentName}.variants.ts` - CVA variants
   - `src/tailwind.css` - Tailwind v4 theme with CSS custom properties

**IMPORTANT**: Never manually edit generated files (files with `.gen.ts` suffix or in designated output directories). They will be overwritten on the next build.

### Adding New Components

When adding components:

1. Define component variants in `design-tokens.json` under `component.{componentName}.variant`
2. Run `pnpm exec design-tokens build` to generate types and CVA variants
3. Import the generated types and variants in your component implementation
4. Use the CVA variants for styling consistency

Example:

```typescript
import { buttonVariants } from './Button/button.variants.ts'
import type { ButtonVariant } from '../component-types.ts'

export interface ButtonProps {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return <button className={buttonVariants({ variant })} />
}
```

### Using Components

Components use auto-generated CVA variants based on design tokens. The type system ensures only valid variant values can be used.

### Workspace Dependencies

Internal packages use `workspace:*` protocol in package.json. When adding dependencies between workspaces, use this protocol.
