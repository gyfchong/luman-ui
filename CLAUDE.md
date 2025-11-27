# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

luman-ui is a Turborepo monorepo for building a React component library. The project is in early stages with placeholder packages and empty apps.

## Commands

### Build & Development

- `pnpm build` - Build all packages and apps
- `pnpm dev` - Start development servers for all apps
- `pnpm lint` - Run ESLint across all packages
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Run TypeScript type checking

### Working with Specific Packages

Use Turbo filters to target specific packages:

- `pnpm build --filter=@repo/ui` - Build only the UI package
- `pnpm dev --filter=docs` - Run dev server for docs app
- `pnpm lint --filter=@repo/ui` - Lint only the UI package

### UI Package Commands

From `packages/ui`:

- `pnpm generate:component` - Generate a new React component using Turbo generators

## Architecture

### Monorepo Structure

This is a Turborepo monorepo with the following workspaces:

**Packages** (`packages/`):

- `@repo/ui` - React component library (shared components)
- `@repo/eslint-config` - Shared ESLint configurations
- `@repo/typescript-config` - Shared TypeScript configurations
- `cli` - CLI tooling (in development)
- `mcp-server` - MCP server integration (placeholder)

**Apps** (`apps/`):

- `docs` - Next.js documentation site (placeholder)
- `playground` - Development/testing playground (placeholder)

### Package Manager

Uses **pnpm** with workspace protocol for internal dependencies. Node.js >=18 required.

### TypeScript Configuration

Three shared tsconfig presets in `@repo/typescript-config`:

- `base.json` - Base config with strict settings, NodeNext modules, ES2022 target
- `react-library.json` - Extends base, adds `jsx: "react-jsx"` for React libraries
- `nextjs.json` - Extends base, configures Next.js with ESNext modules, bundler resolution

Packages reference these via `"extends": "@repo/typescript-config/[preset].json"`

### ESLint Configuration

Three shared ESLint configs in `@repo/eslint-config`:

- `base` - Base config with TypeScript, Prettier, Turbo plugin
- `react-internal` - For React libraries (adds React + React Hooks rules)
- `next-js` - For Next.js apps (adds Next.js plugin + React rules)

All configs use flat config format and `eslint-plugin-only-warn` to convert errors to warnings.

### Turborepo Pipeline

Configured in `turbo.json`:

- `build` - Depends on upstream builds, outputs to `.next/**` (excluding cache)
- `lint` - Depends on upstream lint tasks
- `check-types` - Depends on upstream type checks
- `dev` - No caching, persistent task for dev servers

### UI Package Structure

The `@repo/ui` package exports components from `src/` directory:

- `src/components/` - React components
- `src/registry/` - Component registry (purpose TBD)
- Exports configured as `"./*": "./src/*.tsx"` for direct component imports

## Development Notes

### Current State

The repository is in early development:

- UI package has directory structure but no implemented components
- Apps (docs/playground) are empty placeholders
- CLI and MCP server packages are stubs

### Adding New Components

When adding components to `@repo/ui`:

1. Create component files in `packages/ui/src/components/`
2. Follow existing TypeScript and ESLint configurations
3. Use `pnpm generate:component` for scaffolding
4. Ensure components are exportable via package exports pattern

### Importing from UI Package

Apps can import components as:

```typescript
import { ComponentName } from "@repo/ui/ComponentName";
```

### Workspace Dependencies

Internal packages use `workspace:*` protocol in package.json. When adding dependencies between workspaces, use this protocol.

Always use pnpm filters to run per package commands
