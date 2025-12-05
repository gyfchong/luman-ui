# Design Tokens System

This package uses the `@luman-ui/design-tokens` system that auto-generates TypeScript types, Tailwind configuration, and CVA variants from a single source of truth.

For full documentation, see the [@luman-ui/design-tokens README](../design-tokens/README.md).

## Quick Start

### Build Tokens

```bash
# Build tokens once (runs design-tokens build)
pnpm build:tokens

# Watch mode (auto-rebuild on changes)
pnpm dev:tokens
```

The token build is powered by `@luman-ui/design-tokens` CLI. Configuration is in `design-tokens.config.ts` at the package root.

### Using Generated Types in Components

The Button component demonstrates the pattern:

```tsx
import type { ButtonVariant } from './component-types.gen.ts'

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
- ✅ CVA variants: Complete `button.variants.ts` with all class mappings

### 3. Use It!

```tsx
<Button variant="success">Save Changes</Button>
```

**That's it!** The component automatically uses the generated CVA file. TypeScript will autocomplete the new variant! ✨

No manual CVA mapping needed - everything is derived from tokens.

## File Structure

```
packages/core/
├── design-tokens.config.ts              # Design tokens config
├── src/
│   ├── design-tokens.json               # Source of truth
│   ├── theme.css                        # ✨ Generated Tailwind v4 theme
│   └── components/
│       ├── component-types.gen.ts       # ✨ Generated types
│       ├── button.tsx                   # Uses generated types
│       └── button.variants.ts           # ✨ Auto-generated CVA
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
- ✅ **Zero manual mapping** - CVA variants auto-generated from tokens
- ✅ **Designer-friendly** - Export from Figma → types + styles update automatically
