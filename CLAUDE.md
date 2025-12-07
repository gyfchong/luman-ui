# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

luman-ui is a Turborepo monorepo for building a React component library with design tokens-driven development. The project focuses on building accessible, tree-shakeable React components with Base-UI primitives, styled using Tailwind v4 and powered by an automated design tokens system.

## Commands

### Build & Development

- `pnpm build` - Build all packages in dependency order
- `pnpm dev` - Start development servers for all packages in watch mode
- `pnpm lint` - Run oxlint linting across all packages
- `pnpm check-types` - Run TypeScript type checking across all packages
- `pnpm format` - Format all TypeScript, JavaScript, JSON, Markdown, and CSS files with Prettier
- `pnpm format:check` - Check formatting without making changes

### Design Tokens

The design tokens system is the core of the component styling workflow:

- `pnpm exec design-tokens init` - Initialize design tokens configuration and create starter tokens file
- `pnpm exec design-tokens build` - Build tokens and generate TypeScript types, Tailwind theme, and CVA variants
- `pnpm exec design-tokens build --watch` - Watch mode for development (auto-rebuild on changes)
- `pnpm exec design-tokens build --config <path>` - Build with custom config file

Within the `@luman-ui/core` package:
- `pnpm build:tokens` - Build design tokens for the core package
- `pnpm dev:tokens` - Watch mode for design tokens

### Testing

Within the `@luman-ui/core` package:
- `pnpm test` - Run unit tests with Vitest
- `pnpm test:ui` - Run tests with Vitest UI
- `pnpm test:coverage` - Run tests with coverage reporting

### Working with Specific Packages

Use Turbo filters to target specific packages:

```bash
# Build only the core package
pnpm build --filter=@luman-ui/core

# Run tests in the core package
pnpm test --filter=@luman-ui/core

# Dev mode for design-tokens package
pnpm dev --filter=@luman-ui/design-tokens
```

## Architecture

### Monorepo Structure

The project includes the following packages:

- **@luman-ui/design-tokens** - Design tokens build system for generating TypeScript types, Tailwind CSS config, and CVA variants from W3C Design Tokens
- **@luman-ui/core** - Core React component library built on Base-UI primitives

**Note:** There are currently no apps in this monorepo. The structure is focused on package development.

### Design Tokens System

The design tokens package (`@luman-ui/design-tokens`) provides a comprehensive build system for managing design tokens following the W3C Design Tokens specification. This is the cornerstone of the component library's styling system.

#### Key Features

- **W3C Standards Compliant** - Follows the [W3C Design Tokens specification](https://designtokens.org/)
- **Type Safety** - Auto-generates TypeScript component types from token definitions
- **Tailwind v4 Integration** - Generates CSS theme files with `@theme` directive
- **CVA Variants** - Auto-generates CVA (Class Variance Authority) variant files for components
- **Convention over Configuration** - Works with zero config, fully customizable when needed
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

Design tokens generation is integrated into the package build process via the `build:tokens` npm script. In `@luman-ui/core`, the build script runs `pnpm build:tokens && tsdown` to ensure tokens are generated before building components.

Generated files are treated as build artifacts and are included in `.gitignore` and `.prettierignore`.

**IMPORTANT**: All generated files from design tokens have a `.gen.ts` or `.generated.ts` suffix or are placed in designated output directories. Do not manually edit these files - they will be overwritten on the next build.

### Core Component Library

The `@luman-ui/core` package provides React components with the following characteristics:

- **Tree-shakeable** - Export individual components for optimal bundle sizes
- **Accessible** - Built on Base-UI primitives with ARIA compliance
- **Well-tested** - Comprehensive test coverage with Vitest and jsdom
- **TypeScript-first** - Full type safety with generated types from design tokens
- **Unstyled primitives** - Styled using Tailwind v4 classes driven by design tokens

#### Component Architecture

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

### Package Manager

Uses **pnpm** (v10.24.0) with workspace protocol for internal dependencies. Node.js >=22 required.

### TypeScript Configuration

Each package manages its own TypeScript configuration independently using recommended TypeScript defaults. Both packages use identical, strict configurations:

**Common TypeScript Settings:**
- `strict: true` with additional strict checks (`noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitOverride`)
- `module: "ESNext"` with `moduleResolution: "bundler"`
- `target: "ES2022"` with `lib: ["ES2022"]` (core also includes `"DOM"` and `"DOM.Iterable"`)
- `jsx: "react-jsx"` (core only, for React components)
- `allowImportingTsExtensions: true` for ESM compatibility
- `verbatimModuleSyntax: true` for explicit imports/exports
- `noEmit: true` (build handled by tsdown)

**IMPORTANT - ESM Import Extensions:**
All local imports MUST include `.ts` extensions in TypeScript source files:

```typescript
import { foo } from "./utils/helper.ts" // ✅ Correct
import { foo } from "./utils/helper" // ❌ Wrong
```

The bundler (tsdown) automatically rewrites `.ts` to `.js` in the build output. This is required because:

- TypeScript configs use `allowImportingTsExtensions: true`
- Node.js ESM requires explicit file extensions at runtime
- The build tools handle the transformation automatically

### Build System (tsdown)

The project uses **tsdown** for building packages. tsdown is a TypeScript bundler that:

- Generates ESM output
- Produces TypeScript declaration files (`.d.mts`)
- Handles external dependencies
- Automatically rewrites `.ts` extensions to `.js` in output

Configuration example (`packages/core/tsdown.config.ts`):

```typescript
import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/components/Button/Button.tsx"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "@base-ui-components/react", "clsx", "tailwind-merge"],
})
```

### Testing Infrastructure

The core package uses Vitest with the following setup:

- **Test runner**: Vitest with globals enabled
- **Environment**: jsdom for DOM testing
- **Utilities**: @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
- **Coverage**: Vitest coverage (v8 provider)
- **Browser testing**: Playwright for visual regression tests

Configuration is in `vitest.config.ts` and setup file is `setup.ts`.

### Code Quality Tools

#### oxlint Configuration

oxlint is configured at the workspace root (`.oxlintrc.json`) for fast linting:

- Uses correctness and suspicious rules as errors
- Performance rules as warnings
- TypeScript-specific rules: `no-explicit-any` and `no-unsafe-call` as errors
- Ignores `node_modules`, `dist`, `*.gen.ts`, and `*.generated.ts`

All packages use the shared oxlint configuration.

#### Prettier Configuration

Prettier is configured at the workspace root (`.prettierrc`):

- No semicolons (`semi: false`)
- Double quotes (`singleQuote: false`)
- 2-space indentation (`tabWidth: 2`)
- ES5 trailing commas (`trailingComma: "es5"`)
- 80 character line width (`printWidth: 80`)
- Always use arrow function parentheses (`arrowParens: "always"`)
- LF line endings (`endOfLine: "lf"`)

Ignored files (`.prettierignore`): dependencies, build outputs, generated files, lock files, cache directories, and logs.

### Turborepo Pipeline

Configured in `turbo.json`:

- `build` - Depends on upstream builds (`^build`), outputs to `dist/**` and `.output/**`
- `lint` - Depends on upstream lint tasks (`^lint`)
- `check-types` - Depends on upstream type checks (`^check-types`)
- `dev` - No caching, persistent task for dev servers

All tasks use the new TUI interface (`"ui": "tui"`).

## Development Notes

### Current State

The project is in active development with:

- ✅ Design tokens build system fully implemented
- ✅ Core package with Button component as reference implementation
- ✅ Testing infrastructure with Vitest
- ✅ Build pipeline with tsdown
- ✅ Code quality tools (oxlint, Prettier)
- 🚧 Component library expansion in progress
- 🚧 Registry system planned (referenced in root package.json but not yet implemented)

### Working with Design Tokens

When adding or modifying design tokens:

1. Edit `design-tokens.json` in the relevant package (e.g., `packages/core/src/design-tokens.json`)
2. Follow the W3C Design Tokens specification format
3. Run `pnpm exec design-tokens build` or use watch mode during development (`pnpm dev:tokens` in core package)
4. Generated files will be created in the configured output directories:
   - `src/components/component-types.ts` - TypeScript types
   - `src/components/{ComponentName}/{componentName}.variants.ts` - CVA variants
   - `src/tailwind.css` - Tailwind v4 theme with CSS custom properties

**IMPORTANT**: Never manually edit generated files (files with `.gen.ts` or `.generated.ts` suffix or in designated output directories). They will be overwritten on the next build.

### Adding New Components

When adding components to `@luman-ui/core`:

1. **Define variants in design tokens** - Edit `src/design-tokens.json` and add component variants under `component.{componentName}.variant`

2. **Generate tokens** - Run `pnpm build:tokens` to generate types and CVA variants

3. **Create component file** - Create `src/components/{ComponentName}/{ComponentName}.tsx`

4. **Import generated code**:
   ```typescript
   import { {componentName}VariantClasses, type {ComponentName}Variant } from './{componentName}.variants.ts'
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

Example workflow:

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

### Using Components

Components use auto-generated CVA variants based on design tokens. The type system ensures only valid variant values can be used:

```typescript
import { Button } from "@luman-ui/core/button"

// ✅ TypeScript knows about valid variants
<Button variant="primary">Click me</Button>
<Button variant="destructive">Delete</Button>

// ❌ TypeScript error - invalid variant
<Button variant="invalid">Error</Button>
```

### Workspace Dependencies

Internal packages use `workspace:*` protocol in package.json. When adding dependencies between workspaces, use this protocol:

```json
{
  "devDependencies": {
    "@luman-ui/design-tokens": "workspace:*"
  }
}
```

### Git Workflow

The project uses conventional commits and standard git workflow:

- Main branch: `main`
- Feature branches: Create feature branches for new work
- Pull requests: Use `gh pr create` for creating pull requests
- Commits: Follow conventional commit format when possible

### File Naming Conventions

- **Components**: PascalCase for files and exports (`Button.tsx`, `export const Button`)
- **Utilities**: camelCase for files and exports (`cn.ts`, `export function cn`)
- **Types**: PascalCase for type names, `.ts` extension for type-only files
- **Tests**: Same name as component with `.test.tsx` suffix (`Button.test.tsx`)
- **Config files**: kebab-case with extension (`design-tokens.config.ts`, `tsdown.config.ts`)
- **Generated files**: `.gen.ts` or `.generated.ts` suffix (automatically ignored by linters)

### Import Organization

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

### Performance Considerations

- **Tree-shaking**: Export components individually, not as barrel exports
- **Bundle size**: Keep dependencies minimal, mark React/React DOM as peer dependencies
- **Runtime**: Avoid runtime styling calculations, use design tokens to generate static classes
- **Build time**: Use watch mode during development, full builds for production

### Documentation

Each package should maintain:

- **README.md** - Package overview, installation, usage examples, API documentation
- **TOKENS.md** (core package) - Design tokens usage guide specific to the package
- Component-level JSDoc comments for props and usage

The root **CLAUDE.md** (this file) serves as the source of truth for the overall project architecture and development workflow.

## Troubleshooting

### MODULE_NOT_FOUND error for design-tokens CLI

**Error:**
```
Error: Cannot find module '@luman-ui/design-tokens/dist/cli.mjs'
```

**Cause**: The design-tokens package hasn't been built yet. This can happen if:
- You run `pnpm dev` immediately after a fresh `pnpm install`
- The `dist` folder was deleted or cleaned
- Workspace dependencies weren't built in the correct order

**Prevention**: The Turbo `dev` task has `dependsOn: ["^build"]` which ensures dependencies are built first. The `postinstall` hook also builds design-tokens automatically.

**Manual Fix** (if needed):
```bash
# Build just design-tokens
pnpm --filter=@luman-ui/design-tokens build

# Or rebuild everything
pnpm build
```

**Why this happens**: The `@luman-ui/core` package's dev script uses the `design-tokens` CLI command. This CLI is only available after the design-tokens package is built (it's in `dist/cli.mjs`). Without the Turbo dependency, core's dev script could start before design-tokens finishes building.
