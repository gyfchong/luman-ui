# @luman-ui/core

React component library with tree-shakeable components built on Base-UI.

## Features

- 🌳 **Tree-shakeable**: Import only the components you need
- ♿ **Accessible**: Built on Base-UI with accessibility testing
- 🧪 **Well-tested**: Comprehensive test coverage with Vitest
- 📦 **TypeScript**: Full TypeScript support with type definitions
- 🎨 **Unstyled**: Start with no styling, add your own with Tailwind v4

## Installation

This package is currently private and part of the monorepo.

## Usage

Import individual components for optimal tree-shaking:

```tsx
import { Button } from "@luman-ui/core/button";

function App() {
  return (
    <Button onClick={() => console.log("clicked")}>
      Click me
    </Button>
  );
}
```

## Components

### Button

A button component built on Base-UI's button primitive.

**Props:**
- `children`: React.ReactNode - The content of the button
- `disabled`: boolean - If true, the button will be disabled
- `type`: "button" | "submit" | "reset" - The type of the button
- `onClick`: (event: MouseEvent) => void - Click handler
- `className`: string - Additional class name for styling

**Example:**
```tsx
<Button type="submit" onClick={handleSubmit}>
  Submit Form
</Button>
```

## Development

### Build
```bash
pnpm build
```

### Test
```bash
pnpm test                    # Unit tests
pnpm test:coverage           # With coverage
```

### Visual Testing
Visual regression tests use Vitest browser mode with Playwright to capture actual screenshots:

```bash
# Install Playwright browsers (one-time setup)
pnpm exec playwright install chromium

# Run visual tests
pnpm test:visual             # Run visual snapshot tests

# Update snapshots
pnpm test:visual:update      # Update visual snapshots
```

Visual tests run in a real Chromium browser and capture screenshots for:
- Default button rendering
- Custom className styling
- Disabled state appearance
- Button type variations (submit, reset)

### Type Check
```bash
pnpm check-types
```

## License

Private package
