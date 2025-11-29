# Playground App

A minimal Vite + React + TypeScript application for testing the luman-ui CLI in a realistic environment.

## Purpose

This playground app serves as a testing ground for:
- Testing CLI component installation (`luman add`)
- Verifying component integration in a real React app
- Testing the `luman init` configuration workflow
- Validating component functionality and TypeScript compilation
- Testing edge cases and error scenarios

## Setup

```bash
# Install dependencies (from repository root)
pnpm install

# Build the CLI first
pnpm build --filter=@repo/cli
```

## Testing the CLI

```bash
# Navigate to this directory
cd apps/playground

# Initialize luman-ui configuration
node ../../packages/cli/dist/index.js init

# Add components
node ../../packages/cli/dist/index.js add button
node ../../packages/cli/dist/index.js add input

# List available components
node ../../packages/cli/dist/index.js list
```

## Running the App

```bash
# Start the dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Features

- **React 19** with React Compiler enabled
- **Vite 7** (rolldown-vite for faster builds)
- **TypeScript** with strict type checking
- **ESLint** for code quality

## Notes

- Generated files (`components.json`, `src/components/`) are excluded from git
- Feel free to experiment and test CLI features here
- Reset to clean state by removing `components.json` and `src/components/`
- See [CONTRIBUTION.md](../../CONTRIBUTION.md) for detailed testing instructions
