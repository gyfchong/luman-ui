# luman-ui MCP Server

Model Context Protocol (MCP) server for the luman-ui design system. This server wraps the luman-ui CLI's programmatic API and exposes it through MCP tools for AI-assisted development.

## Philosophy: Code Mode First

This MCP server is designed for **code mode** where LLMs write TypeScript code that executes locally, rather than making direct tool calls. This approach is more powerful because:

1. LLMs are better at writing code than making tool calls
2. Code can be composed and reused
3. No round-trip overhead for complex operations
4. Full access to TypeScript type safety

## Installation

```bash
npm install @repo/mcp-server
# or
pnpm add @repo/mcp-server
```

## Usage

### Configure as MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

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

### Use via TypeScript (Code Mode)

Import the CLI API directly and write TypeScript code:

```typescript
import * as luman from '@repo/cli/api';

// List components
const components = await luman.listComponents();

// Add components
const result = await luman.addComponent('button');

// Get pattern guidance
const pattern = await luman.getPattern('form-accessibility');
```

## Core API

All API functions return consistent response types with `success` boolean and either `data` or error information.

### Component Discovery

#### `listComponents()`

List all available components from the registry.

```typescript
const { components } = await luman.listComponents();
// Returns: { components: ['button', 'input', 'card', ...] }
```

#### `getComponentDetails(name: string)`

Get detailed information about a specific component.

```typescript
const details = await luman.getComponentDetails('button');
// Returns: {
//   component: { name, type, files, dependencies, ... },
//   dependencies: [...] // Registry dependencies
// }
```

### Component Installation

#### `addComponent(name: string, cwd?: string)`

Add a component to the project (installs component + npm dependencies).

```typescript
const result = await luman.addComponent('button');
// Returns: {
//   success: true,
//   installed: ['button'],
//   filesWritten: ['/path/to/button.tsx']
// }
```

#### `removeComponent(name: string, cwd?: string)`

Remove a component from the project.

```typescript
const result = await luman.removeComponent('button');
// Returns: {
//   success: true,
//   removed: ['button'],
//   filesDeleted: ['/path/to/button.tsx']
// }
```

### Composition & Preview

#### `previewComposition(componentNames: string[])`

Preview what will be installed without actually installing.

```typescript
const preview = await luman.previewComposition(['button', 'card', 'dialog']);
// Returns: {
//   components: ['button', 'card', 'dialog'],
//   files: [{ path: 'ui/button.tsx', type: 'registry:component' }, ...],
//   dependencies: ['class-variance-authority', ...]
// }
```

Use this to understand dependencies before installation.

### Pattern Guidance

#### `getPattern(patternName: string)`

Get pattern documentation for LLM guidance on accessibility and composition. Returns structured data (not raw markdown) for machine readability.

**Available patterns:**
- `form-accessibility` - Accessible form patterns (WCAG 2.1 AA)
- `form-composition` - How to compose form components

```typescript
const { pattern } = await luman.getPattern('form-accessibility');
// Returns: {
//   pattern: {
//     name: 'form-accessibility',
//     category: 'accessibility',
//     relatedComponents: ['form', 'input', 'label', 'button'],
//     overview: 'This pattern ensures forms are accessible...',
//     principles: [
//       {
//         title: '1. Every Input Must Have a Label',
//         description: 'Always pair inputs with labels...',
//         codeExamples: [
//           { language: 'tsx', code: '<Label htmlFor="email">...' }
//         ]
//       },
//       // ... more principles
//     ],
//     completeExample: {
//       language: 'tsx',
//       code: 'export default function ContactForm() {...}'
//     },
//     testingChecklist: [
//       'All inputs have visible labels',
//       'Required fields are marked',
//       // ...
//     ],
//     wcagCompliance: [
//       '1.3.1 Info and Relationships (A)',
//       '3.3.2 Labels or Instructions (A)',
//       // ...
//     ]
//   }
// }
```

Pattern data is structured JSON for easy programmatic access by LLMs.

### Project Analysis

#### `analyzeProject(cwd?: string)`

Analyze project to detect framework and package manager (used during initialization).

```typescript
const analysis = await luman.analyzeProject();
// Returns: {
//   framework: 'next' | 'vite' | 'remix' | 'unknown',
//   packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun',
//   hasConfig: boolean
// }
```

### Configuration

#### `getConfig(cwd?: string)`

Get the current project configuration from `components.json`.

```typescript
const config = await luman.getConfig();
// Returns config or null if not found
```

#### `configExists(cwd?: string)`

Check if project has been initialized.

```typescript
const exists = await luman.configExists();
// Returns: boolean
```

## LLM Orchestration Workflow

Here's how an LLM should orchestrate component composition using code mode:

```typescript
import * as luman from '@repo/cli/api';
import { writeFile } from 'fs/promises';

// Step 1: Read relevant patterns (returns structured data, not markdown)
const { pattern: a11yPattern } = await luman.getPattern('form-accessibility');
const { pattern: compositionPattern } = await luman.getPattern('form-composition');

console.log('Loaded accessibility principles:', a11yPattern.principles.length);
console.log('Loaded composition patterns:', compositionPattern.principles.length);

// Step 2: Preview what will be installed
const preview = await luman.previewComposition([
  'label',
  'input',
  'button',
  'form'
]);

console.log('Components to install:', preview.components);
console.log('NPM dependencies:', preview.dependencies);

// Step 3: Install components
for (const component of preview.components) {
  const result = await luman.addComponent(component);
  console.log(`Installed: ${component}`);
}

// Step 4: Generate code following patterns
// The LLM uses structured pattern data (principles, examples, checklist) to generate accessible code
const formCode = `
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
`;

// Step 5: Write the generated code
await writeFile('./app/contact/page.tsx', formCode);
console.log('Created: ./app/contact/page.tsx');
```

**Key points:**
1. Always read relevant patterns first
2. Preview composition to understand dependencies
3. Install components needed
4. Generate code following the patterns
5. Write files to the project

## Design Principles

1. **Zero Business Logic** - The MCP server is a thin wrapper with no business logic
2. **Structured Responses** - All responses are typed TypeScript objects, never markdown prose
3. **Code Mode First** - Designed for LLMs to write code, not make direct tool calls
4. **Composition Over Configuration** - Small primitives that compose together
5. **Offline First** - All features work without backend dependencies

## Error Handling

All API functions follow a consistent pattern:

```typescript
const result = await luman.addComponent('button');

if (!result.success) {
  console.error('Failed:', result); // Contains error info
} else {
  console.log('Success:', result.data);
}
```

Functions that can return `null` (like `getComponentDetails`, `getConfig`) should be null-checked:

```typescript
const details = await luman.getComponentDetails('button');
if (!details) {
  throw new Error('Component not found');
}
```

## TypeScript Types

Import types for full type safety:

```typescript
import type {
  Config,
  RegistryItem,
  ListComponentsResult,
  ComponentDetailsResult,
  AddComponentResult,
  CompositionPreview,
  Pattern,
  PatternPrinciple,
  CodeExample,
} from '@repo/cli/api';
```

## Example: Building a Contact Page

```typescript
import * as luman from '@repo/cli/api';
import { writeFile } from 'fs/promises';

async function buildContactPage() {
  // 1. Get patterns (structured data, not markdown)
  const { pattern: a11yPattern } = await luman.getPattern('form-accessibility');
  const { pattern: compPattern } = await luman.getPattern('form-composition');

  console.log(`Accessibility principles: ${a11yPattern.principles.length}`);
  console.log(`WCAG compliance: ${a11yPattern.wcagCompliance.join(', ')}`);

  // 2. Preview components
  const preview = await luman.previewComposition([
    'label', 'input', 'textarea', 'button'
  ]);

  console.log(`Will install ${preview.components.length} components`);
  console.log(`Dependencies: ${preview.dependencies.join(', ')}`);

  // 3. Install components
  for (const component of ['label', 'input', 'textarea', 'button']) {
    await luman.addComponent(component);
  }

  // 4. Generate page following patterns
  // (LLM generates code based on structured pattern data: principles, examples, checklist)

  // 5. Write file
  await writeFile('./app/contact/page.tsx', generatedCode);

  console.log('Contact page created successfully!');
}
```

## Available Patterns

### Accessibility Patterns
- `form-accessibility` - WCAG 2.1 AA compliant form patterns

### Composition Patterns
- `form-composition` - How to compose form components

More patterns coming soon!

## License

MIT
