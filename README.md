# luman-ui

Themed [Base UI](https://base-ui.com) components powered by design tokens, ready out of the box.

- **Tree-shakeable**: Import only the components you need
- **Accessible**: Built on [Base UI](https://base-ui.com) primitives with ARIA compliance
- **Design Tokens**: Styling powered by [W3C-compliant](https://www.designtokens.org/tr/2025.10/) design tokens
- **Theme Support**: Built-in light/dark mode with `useTheme` hook
- **TypeScript**: Full type safety with auto-generated variant types
- **Tailwind v4**: Styled using Tailwind v4 with CSS custom properties

## Installation

```bash
pnpm add @luman-ui/core
```

## Quick Start

### 1. Import the CSS

Add the theme CSS to your app's main CSS:

```tsx
// tailwind.css
// @import "tailwind"

@source "../node_modules/@luman-ui/core";
import "@luman-ui/core/luman-tailwind.css"
```

### 2. Use Components

```tsx
import { Button, Input, Field, Dialog } from "@luman-ui/core"

function App() {
  return (
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input placeholder="you@example.com" />
    </Field.Root>
  )
}
```

## Available Components

Checkout [Base UI](https://base-ui.com) for all the components, Luman UI essentially mirrors it for now.

## Theming

Use the `useTheme` hook to toggle between light and dark modes:

```tsx
import { useTheme } from "@luman-ui/core/use-theme"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

## Design Tokens

The styling system is powered by `@luman-ui/design-tokens`, a build tool that generates TypeScript types, Tailwind CSS themes, and CVA variants from W3C Design Tokens.

See the [design-tokens documentation](./packages/design-tokens/README.md) for details on customizing tokens.

## License

MIT
