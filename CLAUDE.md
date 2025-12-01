# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

luman-ui is a Turborepo monorepo for building a React component library. The project is in early stages with placeholder packages and empty apps.

## Commands

### Build & Development
- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start development servers for all apps
- `pnpm lint` - Run Biome linting across all packages and apps
- `pnpm format` - Format code with Biome
- `pnpm check-types` - Run TypeScript type checking across all packages and apps

### Working with Specific Packages
Use Turbo filters to target specific packages:
- `pnpm build --filter=@repo/cli` - Build only the CLI package
- `pnpm dev --filter=playground` - Run dev server for playground app
- `pnpm lint --filter=@repo/cli` - Lint only the CLI package

## Architecture

### Monorepo Structure
This is a Turborepo monorepo following the shadcn/ui model:

**Apps** (`apps/`):
- `docs` - Documentation and showcase app (TanStack Start)
  - `registry/default/` - Component source code
    - `ui/` - UI components (button, input, etc.)
    - `lib/` - Utility functions
    - `hooks/` - Custom React hooks
    - `blocks/` - Composed components

**Registry Metadata** (`registry/` at root):
- JSON metadata files for CLI distribution
- `items/*.json` - Individual component metadata (dependencies, file paths)
- `index.json` - Registry index
- `schema.ts` - TypeScript schema definitions

**Packages** (`packages/`):
- `@repo/cli` - CLI tooling for installing components

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
import { foo } from "./utils/helper.ts"  // ✅ Correct
import { foo } from "./utils/helper"      // ❌ Wrong
```
The bundler (tsdown/tsup) automatically rewrites `.ts` to `.js` in the build output. This is required because:
- TypeScript configs use `allowImportingTsExtensions: true`
- Node.js ESM requires explicit file extensions at runtime
- The build tools handle the transformation automatically

### Biome Configuration
Biome is configured at the workspace root (`biome.json`) and handles both linting and formatting:
- Uses recommended rules for linting
- Formats with 2-space indentation, 100-character line width
- Double quotes, semicolons as needed, ES5 trailing commas
- VCS integration enabled with git ignore file support

All packages use the shared Biome configuration.

### Turborepo Pipeline
Configured in `turbo.json`:
- `build` - Depends on upstream builds, outputs to `.next/**` (excluding cache)
- `lint` - Depends on upstream lint tasks
- `check-types` - Depends on upstream type checks
- `dev` - No caching, persistent task for dev servers

### Component Registry Structure
Following the shadcn/ui model, components live **inside the docs app**:

**Component Source** (`apps/docs/registry/default/`):
- `ui/` - UI components (e.g., `button.tsx`, `input.tsx`)
- `lib/` - Utility functions (e.g., `utils.ts`)
- `hooks/` - Custom React hooks
- `blocks/` - Larger composed components

**Registry Metadata** (`registry/` at root):
- `items/*.json` - Component metadata with dependencies and file paths
- `index.json` - Registry index pointing to all available components
- `schema.ts` - TypeScript schema for registry validation

**Key Insight**: The docs app serves three purposes:
1. **Development environment** - Build and test components in a real application
2. **Documentation/showcase** - Display components and their usage
3. **Distribution source** - CLI reads metadata and copies files from here

## Development Notes

### Current State
The repository is in early development:
- Component source lives in `apps/docs/registry/default/` with button component example
- Registry metadata system is in place at root level
- CLI package is in development for component installation
- Docs app uses TanStack Start for routing and SSR

### Adding New Components
When adding components:
1. Create component files in `apps/docs/registry/default/ui/` (or `lib/`, `hooks/`, `blocks/`)
2. Follow existing TypeScript and Biome configurations
3. Test components in the docs app with `pnpm dev --filter=docs`
4. Add corresponding metadata in `registry/items/` with:
   - Component dependencies (npm packages)
   - File paths (relative to project root)
   - Registry dependencies (other components from registry)
5. Update `registry/index.json` to include the new component

### Using Components
Components are NOT distributed as npm packages. Instead:
- Users install components via the CLI (e.g., `luman add button`)
- The CLI reads `registry/items/button.json` metadata
- Components are copied from `apps/docs/registry/` into the user's project as source files
- Users have full ownership and can customize components freely
- This follows the shadcn/ui philosophy: own your components, don't import them

### Workspace Dependencies
Internal packages use `workspace:*` protocol in package.json. When adding dependencies between workspaces, use this protocol.
