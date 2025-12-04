# @luman-ui/design-tokens

Design tokens build system for generating TypeScript types, Tailwind CSS configuration, and CVA (Class Variance Authority) variants from W3C Design Tokens JSON files.

## Features

- ✅ **W3C Standards Compliant** - Follows the [W3C Design Tokens specification](https://designtokens.org/)
- ✅ **Type Safety** - Auto-generates TypeScript types from token definitions
- ✅ **Tailwind v4 Integration** - Generates CSS theme files with `@theme` directive
- ✅ **CVA Variants** - Auto-generates CVA variant files for components
- ✅ **Convention over Configuration** - Works with zero config, fully customizable when needed
- ✅ **Watch Mode** - Development-friendly file watching for rapid iteration
- ✅ **Both API and CLI** - Use as a library or command-line tool

## Installation

```bash
pnpm add -D @luman-ui/design-tokens
```

## Quick Start

### 1. Initialize

```bash
pnpm exec design-tokens init
```

This creates:
- `design-tokens.config.ts` - Configuration file
- `design-tokens.json` - Starter tokens file

### 2. Define Your Tokens

Edit `design-tokens.json`:

```json
{
  "$schema": "https://designtokens.org/specs/2025.10/schema.json",
  "color": {
    "brand": {
      "500": { "$value": "#3b82f6", "$type": "color" },
      "600": { "$value": "#2563eb", "$type": "color" },
      "700": { "$value": "#1d4ed8", "$type": "color" }
    }
  },
  "component": {
    "button": {
      "variant": {
        "primary": {
          "background": {
            "default": { "$value": "{color.brand.600}", "$type": "color" },
            "hover": { "$value": "{color.brand.700}", "$type": "color" }
          },
          "text": { "$value": "#ffffff", "$type": "color" }
        }
      }
    }
  }
}
```

### 3. Build

```bash
# Build once
pnpm exec design-tokens build

# Watch mode (rebuilds on changes)
pnpm exec design-tokens build --watch
```

## Generated Outputs

### TypeScript Types

`generated/component-types.ts`:

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'outline'
export const BUTTON_VARIANT_VALUES = ['primary', 'secondary', 'outline'] as const
```

### Tailwind v4 Theme

`src/app.css`:

```css
@import 'tailwindcss';

@theme {
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-button-primary-background-default: #2563eb;
  --color-button-primary-background-hover: #1d4ed8;
  /* ... */
}
```

### CVA Variants

`components/button.variants.ts`:

```typescript
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2',
  {
    variants: {
      variant: {
        primary: ['bg-button-primary-background-default', 'hover:bg-button-primary-background-hover', 'text-button-primary-text']
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
)
```

## Configuration

### Zero Config (Default Behavior)

```bash
design-tokens build
```

Uses these defaults:
- Input: `design-tokens.json` in current directory
- Types output: `generated/component-types.ts`
- Tailwind output: `src/app.css` (Tailwind v4 theme)
- CVA output: `components/` directory

### Custom Configuration

`design-tokens.config.ts`:

```typescript
import { defineConfig } from '@luman-ui/design-tokens'

export default defineConfig({
  input: 'src/tokens/design-tokens.json',

  outputs: {
    types: {
      enabled: true,
      path: 'src/generated/component-types.ts'
    },

    tailwind: {
      enabled: true,
      path: 'src/app.css' // Tailwind v4 theme file
    },

    cva: {
      enabled: true,
      path: 'src/components',

      // Base classes for CVA
      baseClasses: {
        // Default for all components
        default: 'inline-flex items-center justify-center',

        // Component-specific overrides
        button: 'inline-flex items-center gap-2 rounded-md px-4 py-2 text-base font-medium transition-colors',
        input: 'block w-full rounded-md border px-3 py-2'
      },

      // Property to Tailwind utility mapping
      propertyMapping: {
        background: 'bg',
        text: 'text',
        border: 'border',
        shadow: 'shadow'
      }
    }
  }
})
```

## CLI Commands

### build

Build tokens and generate outputs.

```bash
design-tokens build [options]
```

**Options:**
- `--watch, -w` - Watch for changes and rebuild
- `--config, -c <path>` - Path to config file

**Examples:**

```bash
# Build once with default config
design-tokens build

# Watch mode
design-tokens build --watch

# Custom config file
design-tokens build --config my-config.ts
```

### init

Initialize design tokens configuration.

```bash
design-tokens init
```

Creates starter `design-tokens.config.ts` and `design-tokens.json` files.

## Node.js API

```typescript
import { buildTokens, defineConfig, loadConfigWithPaths } from '@luman-ui/design-tokens'

// Simple usage
await buildTokens()

// With config path
await buildTokens('./my-config.ts')

// Advanced usage
import { build } from '@luman-ui/design-tokens'

const config = loadConfigWithPaths()
const result = await build(config)

if (result.success) {
  console.log('Generated files:', result.filesGenerated)
} else {
  console.error('Errors:', result.errors)
}
```

## CVA Base Classes

### Three-Tier Resolution

Base classes are resolved in this order:

1. **Token metadata** - Per-component in tokens JSON
2. **Config** - Component-specific in config file
3. **Default** - Fallback from config

### Token Metadata (Highest Priority)

```json
{
  "component": {
    "button": {
      "$extensions": {
        "cva": {
          "baseClasses": "inline-flex items-center gap-2 rounded-md px-4 py-2"
        }
      },
      "variant": { /* ... */ }
    }
  }
}
```

### Config (Medium Priority)

```typescript
export default defineConfig({
  outputs: {
    cva: {
      baseClasses: {
        button: 'custom button classes'
      }
    }
  }
})
```

### Default (Lowest Priority)

```typescript
export default defineConfig({
  outputs: {
    cva: {
      baseClasses: {
        default: 'inline-flex items-center justify-center'
      }
    }
  }
})
```

## Property Mapping

Map token properties to Tailwind utility prefixes:

```typescript
export default defineConfig({
  outputs: {
    cva: {
      propertyMapping: {
        background: 'bg',
        text: 'text',
        border: 'border',
        borderRadius: 'rounded',
        padding: 'p',
        margin: 'm',
        shadow: 'shadow',
        ring: 'ring'
      }
    }
  }
})
```

Token properties in `design-tokens.json` will map to these Tailwind utilities.

## Token Reference Resolution

Supports W3C token references:

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

The `{color.brand.600}` reference resolves to `#2563eb`.

## Package Scripts Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "build": "design-tokens build && your-build-command",
    "build:tokens": "design-tokens build",
    "dev": "design-tokens build --watch & your-dev-command",
    "dev:tokens": "design-tokens build --watch"
  },
  "devDependencies": {
    "@luman-ui/design-tokens": "workspace:*"
  }
}
```

## Advanced Usage

### Individual Generators

```typescript
import { generateComponentTypes, generateTailwindConfig, generateCVA } from '@luman-ui/design-tokens'
import type { DesignTokens } from '@luman-ui/design-tokens'

const tokens: DesignTokens = JSON.parse(/* ... */)

// Generate only types
const types = generateComponentTypes(tokens)

// Generate only Tailwind config
const tailwindConfig = generateTailwindConfig(tokens)

// Generate only CVA variants
const cvaConfig = { /* your config */ }
const cvaFiles = generateCVA(tokens, cvaConfig)
```

### Custom Path Resolution

```typescript
import { createPathContext, resolveInputPath, resolveOutputPath } from '@luman-ui/design-tokens'

const context = createPathContext('/path/to/config.ts')
const inputPath = resolveInputPath('tokens.json', context)
const outputPath = resolveOutputPath('generated/types.ts', context)
```

## TypeScript Types

All types are exported:

```typescript
import type {
  DesignTokens,
  DesignTokensConfig,
  ResolvedConfig,
  ResolvedConfigWithPaths,
  TypesOutputConfig,
  TailwindOutputConfig,
  CVAOutputConfig,
  BuildResult
} from '@luman-ui/design-tokens'
```

## License

MIT
