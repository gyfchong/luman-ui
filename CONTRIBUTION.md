# Contributing to luman-ui

Thank you for your interest in contributing to luman-ui! This guide will help you set up your development environment and test your changes.

## Prerequisites

- Node.js >= 18
- pnpm (package manager)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

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
# Build all packages and apps
pnpm build

# Build specific package
pnpm build --filter=@repo/cli
pnpm build --filter=@repo/mcp-server
```

**Always test the built output**, not just TypeScript compilation.

### Running in Watch Mode

```bash
# Watch mode for CLI (auto-rebuilds on changes)
pnpm dev --filter=@repo/cli

# Watch mode for MCP server
pnpm dev --filter=@repo/mcp-server
```

### Code Quality

```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types
```

## Testing the CLI

### 1. Build the CLI

```bash
pnpm build --filter=@repo/cli
```

### 2. Run the CLI directly

```bash
# Run the main command (shows help)
node packages/cli/dist/index.js

# Test specific commands
node packages/cli/dist/index.js list
node packages/cli/dist/index.js add button
node packages/cli/dist/index.js init
```

### 3. Test as a global command (optional)

To test the `luman` command as it would be used by end users:

```bash
# From the CLI package directory
cd packages/cli
npm link

# Now you can use it globally
luman
luman list
luman add button

# When done testing, unlink
npm unlink -g @repo/cli
cd ../..
```

### 4. Watch mode for development

```bash
pnpm dev --filter=@repo/cli
```

This rebuilds automatically when you change source files.

### 5. Testing with the Playground App

The `apps/playground/` directory provides a realistic test environment for CLI commands. It's a standalone Vite + React + TypeScript app where you can test component installation in isolation.

**Setup:**

```bash
# Install playground dependencies (if not already installed)
pnpm install

# Build the CLI first
pnpm build --filter=@repo/cli
```

**Testing component installation:**

```bash
# Navigate to the playground directory
cd apps/playground

# Initialize luman-ui configuration (if not already done)
node ../../packages/cli/dist/index.js init

# Add components to test installation
node ../../packages/cli/dist/index.js add button
node ../../packages/cli/dist/index.js add input

# List available components
node ../../packages/cli/dist/index.js list
```

**Verify installation:**

```bash
# Check that components were installed correctly
ls src/components/ui/  # Should show button.tsx, input.tsx, etc.

# Start the dev server to test components visually
pnpm dev
```

**Import and use components in `src/App.tsx`:**

```typescript
import { Button } from "./components/ui/button"

function App() {
  return (
    <div>
      <Button>Test Button</Button>
    </div>
  )
}
```

**Testing workflow:**

1. Make changes to the CLI source code
2. Rebuild: `pnpm build --filter=@repo/cli` (or use watch mode)
3. Run CLI commands in the playground to test your changes
4. Verify components install correctly and work in the app
5. Clear installed components and test again if needed

**Cleanup:**

To reset the playground for fresh testing:

```bash
# Remove installed components
rm -rf src/components

# Remove configuration (if testing init command)
rm -f components.json
```

**Tips:**

- Generated files (`components.json`, `src/components/`) are excluded from git, so feel free to experiment
- Use the playground to test edge cases like conflicting dependencies
- Test both successful installations and error scenarios
- Verify that TypeScript compilation works after component installation

## Testing the MCP Server

### 1. Build the MCP server

```bash
pnpm build --filter=@repo/mcp-server
```

### 2. Test the MCP server directly

The MCP server communicates via stdio, so you can test it manually:

```bash
node packages/mcp-server/dist/index.js
```

You should see: `luman-ui MCP server running on stdio` in stderr.

### 3. Configure in Claude Desktop

To properly test the MCP server with Claude:

1. Edit your Claude Desktop config:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the MCP server (update the path to match your local setup):

   ```json
   {
     "mcpServers": {
       "luman-ui": {
         "command": "node",
         "args": ["/absolute/path/to/luman-ui/packages/mcp-server/dist/index.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop

4. The server provides these tools:
   - `list_components` - List available components
   - `get_component_details` - Get details about a specific component
   - `add_component` - Add a component to a project
   - `preview_composition` - Preview component compositions
   - `get_pattern` - Get design patterns
   - `analyze_project` - Analyze project structure

### 4. Watch mode for development

```bash
pnpm dev --filter=@repo/mcp-server
```

**Note**: After rebuilding in watch mode, you'll need to restart Claude Desktop to pick up the changes.

### 5. Using with Claude Code

To test the MCP server with Claude Code itself, you have two options:

#### Option A: Project-scoped (Recommended for Development)

Create `.mcp.json` at the project root:

```bash
# From the repository root
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "luman-ui": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/luman-ui/packages/mcp-server/dist/index.js"]
    }
  }
}
EOF
```

Replace `/absolute/path/to/luman-ui` with your actual project path. This configuration can be committed to git for team sharing.

#### Option B: User-scoped

Create or edit the user config file:
- Linux: `~/.config/claude-code/mcp.json`
- macOS: `~/Library/Application Support/ClaudeCode/mcp.json`
- Windows: `%APPDATA%\ClaudeCode\mcp.json`

Use the same JSON format as Option A.

#### After Configuration

1. **Completely exit** Claude Code (close all windows)
2. **Restart** Claude Code
3. Use `/mcp` command to verify the server is loaded
4. The `luman-ui` MCP server tools should now be available

**Note**: Configuration changes require a full restart of Claude Code. After rebuilding the MCP server in watch mode, you'll need to restart Claude Code to pick up the changes.

## Testing Both Together

Since the MCP server depends on the CLI package, you may want to build both:

```bash
# Build both packages
pnpm build --filter=@repo/cli --filter=@repo/mcp-server

# Or build everything
pnpm build
```

## Adding New Components

When adding components to the registry:

1. Create component files in `apps/docs/registry/default/ui/` (or `lib/`, `hooks/`, `blocks/`)
2. Follow existing TypeScript and Biome configurations
3. Test components in the docs app with `pnpm dev --filter=docs`
4. Add corresponding metadata in `registry/items/` with:
   - Component dependencies (npm packages)
   - File paths (relative to project root)
   - Registry dependencies (other components from registry)
5. Update `registry/index.json` to include the new component

## Project Structure

- `apps/docs` - Documentation and showcase app (TanStack Start)
  - `registry/default/` - Component source code
- `packages/cli` - CLI tooling for installing components
- `packages/mcp-server` - MCP server integration
- `registry/` - Registry metadata (JSON files)

## Pull Request Guidelines

1. Ensure all tests pass: `pnpm check-types`
2. Ensure code is properly formatted: `pnpm format`
3. Ensure no linting errors: `pnpm lint`
4. Build succeeds: `pnpm build`
5. Provide clear description of changes

## Questions?

If you have questions or need help, please open an issue on GitHub.
