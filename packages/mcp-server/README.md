# luman-ui MCP Server

Model Context Protocol (MCP) server for the luman-ui design system. This server wraps the luman-ui CLI's programmatic API and exposes it through MCP tools for AI-assisted development.

## Installation

```bash
npm install @repo/mcp-server
# or
pnpm add @repo/mcp-server
```

## Usage

### As an MCP Server

Configure in your MCP client (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "luman-ui": {
      "command": "npx",
      "args": ["@repo/mcp-server"]
    }
  }
}
```

### As a TypeScript Library (Code Mode)

The MCP server is designed for "code mode" where LLMs write TypeScript code that executes locally:

```typescript
import * as luman from '@repo/cli/api';

// List all components
const components = await luman.list();
console.log(components.data);

// Add components to project
const result = await luman.addComponent(['button', 'card']);
console.log('Installed:', result.data?.installed);

// Scaffold a feature
const feature = await luman.scaffoldFeature('user-management', 'crud-feature');
console.log('Created files:', feature.data?.files);

// Scaffold a page
const page = await luman.scaffoldPage('dashboard', '/dashboard', ['card', 'chart']);
console.log('Created:', page.data?.file);
```

## Available Tools

All tools return structured JSON responses in the format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```

### 1. list_components

List all available components from the registry.

**Parameters:**
- `category?: string` - Filter by category
- `tag?: string` - Filter by tag
- `registry?: string` - Custom registry URL

**Returns:**
```typescript
{
  success: true,
  data: Array<{
    name: string;
    type: 'registry:ui' | 'registry:block' | 'registry:page' | 'registry:hook';
    description?: string;
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{ path: string; type: string }>;
    category?: string;
    tags?: string[];
  }>
}
```

**Example:**
```typescript
const result = await luman.list({ category: 'forms' });
```

### 2. get_component_details

Get detailed information about a specific component.

**Parameters:**
- `name: string` - Component name (required)
- `registry?: string` - Custom registry URL

**Returns:**
```typescript
{
  success: true,
  data: {
    name: string;
    type: string;
    description?: string;
    dependencies?: string[];
    registryDependencies?: string[];
    files: Array<{ path: string; type: string }>;
    category?: string;
    tags?: string[];
  }
}
```

**Example:**
```typescript
const result = await luman.getComponentDetails('button');
```

### 3. add_component

Add one or more components to the project.

**Parameters:**
- `components: string[]` - Component names to add (required)
- `overwrite?: boolean` - Overwrite existing files
- `cwd?: string` - Working directory

**Returns:**
```typescript
{
  success: true,
  data: {
    installed: string[];
    dependencies: string[];
  }
}
```

**Example:**
```typescript
const result = await luman.addComponent(['button', 'card', 'dialog']);
```

### 4. scaffold_feature

Scaffold a complete feature using a template.

**Parameters:**
- `name: string` - Feature name (required)
- `template: string` - Template name (required)
  - `'crud-feature'` - CRUD with list, create, edit pages
  - `'auth-feature'` - Login, signup, password reset
  - `'dashboard-page'` - Dashboard with charts and metrics
- `cwd?: string` - Working directory
- `installComponents?: boolean` - Install required components (default: true)

**Returns:**
```typescript
{
  success: true,
  data: {
    files: string[];
    components: string[];
  }
}
```

**Example:**
```typescript
const result = await luman.scaffoldFeature(
  'user-management',
  'crud-feature',
  { installComponents: true }
);
```

### 5. scaffold_page

Scaffold a new page with specified components.

**Parameters:**
- `name: string` - Page name (required)
- `path: string` - Route path (required)
- `components: string[]` - Components to include (required)
- `layout?: string` - Layout component
- `cwd?: string` - Working directory
- `installComponents?: boolean` - Install required components (default: true)

**Returns:**
```typescript
{
  success: true,
  data: {
    file: string;
    components: string[];
  }
}
```

**Example:**
```typescript
const result = await luman.scaffoldPage(
  'dashboard',
  '/dashboard',
  ['card', 'chart', 'stat-card']
);
```

### 6. preview_composition

Preview what files and dependencies will be installed without actually installing.

**Parameters:**
- `components: string[]` - Components to preview (required)
- `registry?: string` - Custom registry URL
- `cwd?: string` - Working directory

**Returns:**
```typescript
{
  success: true,
  data: {
    files: Array<{
      path: string;
      content: string;
      action: 'create' | 'update';
    }>;
    dependencies: string[];
    registryDependencies: string[];
    structure: string;
  }
}
```

**Example:**
```typescript
const result = await luman.previewComposition(['button', 'card', 'dialog']);
```

### 7. update_component

Update existing components from the registry.

**Parameters:**
- `components: string[]` - Component names to update (required)
- `backup?: boolean` - Create backup of existing files (default: true)
- `cwd?: string` - Working directory

**Returns:**
```typescript
{
  success: true,
  data: {
    updated: string[];
  }
}
```

**Example:**
```typescript
const result = await luman.updateComponent(['button', 'card'], { backup: true });
```

### 8. get_templates

Get list of available feature templates.

**Parameters:** None

**Returns:**
```typescript
{
  success: true,
  data: Array<{
    name: string;
    type: 'feature' | 'page' | 'component';
    description?: string;
    structure: Array<{ type: 'file' | 'directory'; path: string }>;
    dependencies?: string[];
    registryDependencies?: string[];
  }>
}
```

**Example:**
```typescript
const result = await luman.getTemplates();
```

### 9. analyze_project

Analyze project to detect framework, package manager, and configuration.

**Parameters:**
- `cwd?: string` - Working directory

**Returns:**
```typescript
{
  success: true,
  data: {
    framework: 'next' | 'vite' | 'remix' | 'astro' | 'unknown';
    packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
    hasConfig: boolean;
    existingComponents: string[];
    tailwindConfig?: string;
    tsconfig?: string;
  }
}
```

**Example:**
```typescript
const result = await luman.analyze();
```

## Code Mode Workflow

The recommended workflow for AI-assisted development:

```typescript
import * as luman from '@repo/cli/api';

// 1. Analyze the project
const analysis = await luman.analyze();
if (!analysis.success) {
  console.error('Project analysis failed:', analysis.error);
  process.exit(1);
}

console.log('Framework:', analysis.data.framework);
console.log('Package Manager:', analysis.data.packageManager);

// 2. List available templates
const templates = await luman.getTemplates();
console.log('Available templates:', templates.data?.map(t => t.name));

// 3. Preview what will be installed
const preview = await luman.previewComposition(['button', 'form', 'input']);
console.log('Files to create:', preview.data?.files.length);
console.log('Dependencies:', preview.data?.dependencies);

// 4. Scaffold the feature
const feature = await luman.scaffoldFeature('contact-form', 'crud-feature', {
  installComponents: true
});

if (feature.success) {
  console.log('Created files:', feature.data?.files);
  console.log('Installed components:', feature.data?.components);
} else {
  console.error('Scaffolding failed:', feature.error);
}
```

## Design Principles

1. **Zero Business Logic**: The MCP server is a thin wrapper around the CLI API with no business logic.

2. **Structured JSON Responses**: All responses are structured JSON, never markdown prose, optimized for programmatic consumption.

3. **Code Mode First**: Designed for LLMs to write TypeScript code that executes locally, not for direct tool calls.

4. **Composition Over Configuration**: Tools are designed to be composed together for complex workflows.

5. **Graceful Degradation**: All features work offline without backend dependencies.

## Error Handling

All API calls return a response object with a `success` field:

```typescript
const result = await luman.addComponent(['button']);

if (!result.success) {
  console.error('Error:', result.error);
  // Handle error
} else {
  console.log('Success:', result.data);
  // Use data
}
```

## TypeScript Types

Import types for full type safety:

```typescript
import type {
  ApiResponse,
  Component,
  Template,
  ProjectAnalysis,
  CompositionPreview,
} from '@repo/cli/api';

const components: ApiResponse<Component[]> = await luman.list();
```

## License

MIT
