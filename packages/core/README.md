# @luman-ui/core

React component library with tree-shakeable components built on Base-UI and powered by design tokens.

## Features

- **Tree-shakeable**: Import only the components you need
- **Accessible**: Built on Base-UI primitives with ARIA compliance
- **Design Tokens**: Styling powered by W3C-compliant design tokens
- **Theme Support**: Built-in light/dark mode with `useTheme` hook
- **TypeScript**: Full type safety with auto-generated variant types
- **Tailwind v4**: Styled using Tailwind v4 with CSS custom properties

## Installation

```bash
pnpm add @luman-ui/core
```

### Peer Dependencies

```bash
pnpm add react react-dom
```

## Setup

Import the Tailwind CSS theme in your app's entry point:

```tsx
import "@luman-ui/core/luman-tailwind.css"
```

This provides all the CSS custom properties for theming and component styling.

## Usage

Import individual components for optimal tree-shaking:

```tsx
import { Button } from "@luman-ui/core"

function App() {
  return (
    <Button variant="primary" onClick={() => console.log("clicked")}>
      Click me
    </Button>
  )
}
```

### Theme Management

Use the `useTheme` hook to manage light/dark mode:

```tsx
import { useTheme } from "@luman-ui/core/use-theme"

function ThemeToggle() {
  const { mode, setMode, resolvedTheme } = useTheme()

  return (
    <div>
      <button onClick={() => setMode("light")}>Light</button>
      <button onClick={() => setMode("dark")}>Dark</button>
      <button onClick={() => setMode("system")}>System</button>
      <p>Current theme: {resolvedTheme}</p>
    </div>
  )
}
```

The hook provides:
- `mode`: Current setting (`"light"` | `"dark"` | `"system"`)
- `setMode`: Function to change the mode
- `resolvedTheme`: Actual applied theme (`"light"` | `"dark"`)

Features:
- localStorage persistence
- SSR-safe with proper hydration
- Listens to system preference changes
- Sets `data-theme` attribute on `<html>` for CSS theming

## Components

### Form Controls

| Component | Variants | Description |
|-----------|----------|-------------|
| **Button** | `primary`, `secondary`, `outline`, `ghost`, `destructive` | Interactive button with multiple visual styles |
| **Input** | `default`, `error` | Text input field |
| **Checkbox** | `default`, `primary` | Single checkbox with optional indeterminate state |
| **CheckboxGroup** | `default` | Group of related checkboxes |
| **Radio** | `default`, `primary` | Radio button for single selection |
| **Switch** | `default`, `primary` | Toggle switch for on/off states |
| **Select** | `default` | Dropdown select menu |
| **NumberField** | `default` | Numeric input with increment/decrement |
| **Field** | `default` | Form field wrapper with label and validation |
| **Fieldset** | `default` | Group related form fields |
| **Form** | `default` | Form wrapper with error handling |
| **Slider** | `default` | Range slider input |
| **Combobox** | `default` | Input with filterable dropdown options |
| **Autocomplete** | `default` | Text input with suggestions |

### Overlays & Dialogs

| Component | Variants | Description |
|-----------|----------|-------------|
| **Dialog** | `default` | Modal dialog window |
| **AlertDialog** | `default` | Confirmation dialog requiring user action |
| **Popover** | `default` | Floating content anchored to a trigger |
| **Tooltip** | `default` | Informational hint on hover/focus |
| **Toast** | `default`, `success`, `error` | Notification messages |
| **PreviewCard** | `default` | Link preview on hover |

### Navigation & Menus

| Component | Variants | Description |
|-----------|----------|-------------|
| **Menu** | `default` | Dropdown action menu |
| **ContextMenu** | `default` | Right-click context menu |
| **Menubar** | `default` | Horizontal menu bar |
| **NavigationMenu** | `default` | Site navigation with submenus |
| **Tabs** | `default` | Tabbed content panels |

### Layout & Display

| Component | Variants | Description |
|-----------|----------|-------------|
| **Accordion** | `default` | Collapsible content sections |
| **Collapsible** | `default` | Single collapsible panel |
| **ScrollArea** | `default` | Custom scrollable container |
| **Separator** | `default` | Visual divider |
| **Avatar** | `default`, `primary` | User avatar with fallback |
| **Progress** | `default` | Progress bar indicator |
| **Meter** | `default` | Meter/gauge display |

### Actions & Toggles

| Component | Variants | Description |
|-----------|----------|-------------|
| **Toggle** | `default`, `primary` | Two-state toggle button |
| **ToggleGroup** | `default` | Group of toggle buttons |
| **Toolbar** | `default` | Horizontal toolbar container |

## Component Examples

### Button

```tsx
import { Button } from "@luman-ui/core"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button disabled>Disabled</Button>
```

### Form with Field

```tsx
import { Form, Field, Input, Button } from "@luman-ui/core"

<Form onSubmit={handleSubmit}>
  <Field.Root>
    <Field.Label>Email</Field.Label>
    <Input type="email" placeholder="you@example.com" />
    <Field.Error>Please enter a valid email</Field.Error>
  </Field.Root>
  <Button type="submit">Submit</Button>
</Form>
```

### Dialog

```tsx
import { Dialog, Button } from "@luman-ui/core"

<Dialog.Root>
  <Dialog.Trigger render={<Button>Open Dialog</Button>} />
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Popup>
      <Dialog.Title>Confirm Action</Dialog.Title>
      <Dialog.Description>Are you sure you want to proceed?</Dialog.Description>
      <Dialog.Close render={<Button variant="outline">Cancel</Button>} />
      <Button>Confirm</Button>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

### Toast

```tsx
import { Toast } from "@luman-ui/core"

<Toast.Provider>
  <Toast.Viewport />
  {/* In your component */}
  <Toast.Root variant="success">
    <Toast.Title>Success!</Toast.Title>
    <Toast.Description>Your changes have been saved.</Toast.Description>
  </Toast.Root>
</Toast.Provider>
```

## Development

### Build

```bash
pnpm build                # Build components and design tokens
pnpm build:tokens         # Build design tokens only
```

### Development Mode

```bash
pnpm dev                  # Watch mode for components and tokens
pnpm dev:tokens           # Watch mode for design tokens only
```

### Test

```bash
pnpm test                 # Run unit tests
pnpm test:ui              # Run tests with Vitest UI
pnpm test:coverage        # Run tests with coverage
```

### Type Check

```bash
pnpm check-types
```

## Design Tokens

Components are styled using design tokens defined in `design-tokens.json`. The build system generates:

- **TypeScript types**: Variant types for type-safe props
- **CVA variants**: Class Variance Authority variant classes
- **Tailwind CSS**: Theme with CSS custom properties

See the main project CLAUDE.md for details on the design tokens workflow.

## License

Private package
