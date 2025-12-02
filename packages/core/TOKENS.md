# Design Tokens System

This package uses a design tokens system that auto-generates TypeScript types and Tailwind configuration from a single source of truth.

## Quick Start

### Build Tokens

```bash
# Build tokens once
pnpm build:tokens

# Watch mode (auto-rebuild on changes)
pnpm dev:tokens
```

### Using Generated Types in Components

The Button component demonstrates the pattern:

```tsx
import type { ButtonVariant } from '../tokens/generated/component-types.ts'

export interface ButtonProps {
  variant?: ButtonVariant  // ✅ Auto-generated: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  children?: ReactNode
  // ... other props
}
```

## Adding a New Variant

### 1. Update Design Tokens

Edit `src/tokens/design-tokens.json`:

```json
{
  "component": {
    "button": {
      "variant": {
        "success": {
          "background": {
            "default": { "$value": "{color.green.600}", "$type": "color" },
            "hover": { "$value": "{color.green.700}", "$type": "color" }
          },
          "text": { "$value": "#ffffff", "$type": "color" },
          "border": { "$value": "transparent", "$type": "color" }
        }
      }
    }
  }
}
```

### 2. Rebuild Tokens

```bash
pnpm build:tokens
```

This automatically generates:
- ✅ TypeScript type: `ButtonVariant = 'primary' | 'secondary' | ... | 'success'`
- ✅ Tailwind classes: `button-success-background-default`, `button-success-background-hover`, etc.

### 3. Add CVA Mapping

Update the component's CVA definition:

```tsx
const buttonVariants = cva('...', {
  variants: {
    variant: {
      // ... existing variants
      success: 'bg-button-success-background-default text-button-success-text hover:bg-button-success-background-hover'
    }
  }
})
```

### 4. Use It!

```tsx
<Button variant="success">Save Changes</Button>
```

TypeScript will autocomplete the new variant! ✨

## File Structure

```
packages/core/
├── src/
│   ├── tokens/
│   │   ├── design-tokens.json          # Source of truth
│   │   ├── schema.ts                    # TypeScript schema
│   │   ├── build.ts                     # Build script
│   │   ├── builders/
│   │   │   ├── generate-types.ts        # Type generator
│   │   │   └── generate-tailwind.ts     # Tailwind config generator
│   │   └── generated/                   # Auto-generated (git-ignored)
│   │       └── component-types.ts       # ✨ Generated types
│   └── components/
│       └── button.tsx                   # Uses generated types
└── tailwind.config.js                   # ✨ Auto-generated
```

## Design Tokens Format

Follows the [W3C Design Tokens spec](https://designtokens.org/):

```json
{
  "$schema": "https://designtokens.org/specs/2025.10/schema.json",
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

## Benefits

- ✅ **Single source of truth** - Design tokens drive everything
- ✅ **Type safety** - Can't use variants that don't exist
- ✅ **Auto-sync** - Types update when tokens change
- ✅ **Pure tokens** - Just values, no behavior
- ✅ **Tailwind-powered** - No custom CSS to maintain
- ✅ **Designer-friendly** - Export from Figma → types update automatically
