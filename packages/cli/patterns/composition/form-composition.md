# Form Composition Pattern

components: [form, input, label, button, textarea, select, checkbox, radio-group]

## Overview

This pattern demonstrates how to compose form components from the Luman UI library to create functional, accessible forms.

## Basic Form Structure

The fundamental pattern for all forms:

```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function BasicForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="field">Field Label</Label>
        <Input id="field" name="field" type="text" />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

**Key composition principles:**
- Use `space-y-6` for vertical spacing between form sections
- Use `space-y-2` for spacing between label and input
- Always wrap label + input in a `div` for proper grouping

## Field Types

### Text Input

```tsx
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input id="username" name="username" type="text" placeholder="Enter username" />
</div>
```

### Email Input

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" name="email" type="email" placeholder="you@example.com" />
</div>
```

### Password Input

```tsx
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input id="password" name="password" type="password" />
</div>
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/textarea'

<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" name="bio" rows={4} placeholder="Tell us about yourself" />
</div>
```

### Select Dropdown

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select name="country">
    <SelectTrigger id="country">
      <SelectValue placeholder="Select a country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="ca">Canada</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox'

<div className="flex items-center space-x-2">
  <Checkbox id="terms" name="terms" />
  <Label htmlFor="terms" className="text-sm font-normal">
    I agree to the terms and conditions
  </Label>
</div>
```

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<div className="space-y-2">
  <Label>Notification Preference</Label>
  <RadioGroup name="notifications" defaultValue="email">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="email" id="email" />
      <Label htmlFor="email" className="font-normal">Email</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="sms" id="sms" />
      <Label htmlFor="sms" className="font-normal">SMS</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="none" id="none" />
      <Label htmlFor="none" className="font-normal">None</Label>
    </div>
  </RadioGroup>
</div>
```

## Multi-Column Layout

For side-by-side fields on larger screens:

```tsx
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label htmlFor="firstName">First Name</Label>
      <Input id="firstName" name="firstName" type="text" />
    </div>

    <div className="space-y-2">
      <Label htmlFor="lastName">Last Name</Label>
      <Input id="lastName" name="lastName" type="text" />
    </div>
  </div>

  <Button type="submit">Submit</Button>
</form>
```

## Form Actions

### Primary Action Only

```tsx
<div className="pt-4">
  <Button type="submit">Submit</Button>
</div>
```

### Primary and Secondary Actions

```tsx
<div className="flex items-center gap-4 pt-4">
  <Button type="submit">Save Changes</Button>
  <Button type="button" variant="outline">Cancel</Button>
</div>
```

### With Loading State

```tsx
'use client'

import { useState } from 'react'

export default function FormWithLoading() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Submit logic
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

## Complete Contact Form Example

```tsx
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // Submit to your API
    console.log(data)

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="text-muted-foreground">
          Fill out the form below and we'll get back to you soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" type="text" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" type="text" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select name="subject" required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Type your message here..."
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        <Button type="reset" variant="outline" disabled={isSubmitting}>
          Clear
        </Button>
      </div>
    </form>
  )
}
```

## Styling Guidelines

### Spacing
- `space-y-6` - Between form sections/groups
- `space-y-4` - Between related fields in a group
- `space-y-2` - Between label and input
- `gap-4` - For grid layouts

### Layout
- `max-w-2xl mx-auto` - Center form with max width
- `grid grid-cols-1 md:grid-cols-2 gap-4` - Responsive columns

### Typography
- Form headings: `text-2xl font-bold`
- Field labels: Use `<Label>` component (already styled)
- Helper text: `text-sm text-muted-foreground`

## Component Dependencies

To build forms, you'll need:

**Essential:**
- `label` - Field labels
- `input` - Text inputs
- `button` - Form actions

**Common:**
- `textarea` - Multi-line text
- `select` - Dropdown menus
- `checkbox` - Single checkboxes
- `radio-group` - Radio button groups

**Advanced:**
- `form` - Full form component with validation
- `switch` - Toggle switches
- `slider` - Range inputs
- `calendar` - Date pickers

## Next Steps

1. **Add validation** - See the `form-accessibility.md` pattern for validation patterns
2. **Add error handling** - Implement error states with `aria-invalid` and error messages
3. **Add success states** - Show confirmation after successful submission
4. **Integrate with form libraries** - Works great with React Hook Form, Formik, etc.
