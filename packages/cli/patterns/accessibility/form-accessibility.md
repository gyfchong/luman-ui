# Form Accessibility Pattern

components: [form, input, label, button]

## Overview

This pattern ensures forms are accessible to all users, including those using screen readers, keyboard navigation, and other assistive technologies.

## Core Principles

### 1. Every Input Must Have a Label

**Always pair inputs with labels using `htmlFor` and `id`:**

```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" name="email" />
```

**Never use placeholder-only inputs** - placeholders disappear and aren't announced by screen readers.

### 2. Error States and Validation

Use `aria-invalid` and `aria-describedby` to communicate errors:

```tsx
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
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
```

**Key attributes:**
- `aria-invalid="true"` - Indicates the field has an error
- `aria-describedby` - Links the error message to the input
- `role="alert"` - Announces errors immediately to screen readers

### 3. Required Fields

Mark required fields explicitly:

```tsx
<Label htmlFor="name">
  Full Name <span aria-label="required">*</span>
</Label>
<Input
  id="name"
  name="name"
  required
  aria-required="true"
/>
```

### 4. Form Submission Feedback

Provide clear feedback on form submission:

```tsx
<form onSubmit={handleSubmit}>
  {/* Form fields */}

  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>

  {submitSuccess && (
    <div role="status" aria-live="polite" className="text-green-600">
      Form submitted successfully!
    </div>
  )}
</form>
```

**Use `aria-live` regions** for dynamic status updates.

### 5. Keyboard Navigation

Ensure logical tab order and keyboard interaction:

- Tab order should follow visual flow
- All interactive elements must be keyboard accessible
- Enter key should submit the form
- Escape key should clear focus from inputs (default behavior)

### 6. Focus Management

When validation fails, move focus to the first invalid field:

```tsx
const firstErrorField = document.querySelector('[aria-invalid="true"]')
if (firstErrorField instanceof HTMLElement) {
  firstErrorField.focus()
}
```

## Complete Accessible Form Example

```tsx
'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSubmitSuccess(false)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string

    // Validation
    const newErrors: Record<string, string> = {}
    if (!email) newErrors.email = 'Email is required'
    if (!name) newErrors.name = 'Name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Focus first error
      setTimeout(() => {
        const firstError = document.querySelector('[aria-invalid="true"]')
        if (firstError instanceof HTMLElement) {
          firstError.focus()
        }
      }, 0)
      return
    }

    setIsSubmitting(true)
    // Submit logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setSubmitSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">
          Full Name <span aria-label="required">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">
          Email Address <span aria-label="required">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-600 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>

      {submitSuccess && (
        <div role="status" aria-live="polite" className="text-green-600">
          Form submitted successfully!
        </div>
      )}
    </form>
  )
}
```

## Testing Checklist

- [ ] All inputs have visible labels
- [ ] Required fields are marked
- [ ] Error messages are linked with `aria-describedby`
- [ ] Form can be completed using keyboard only
- [ ] Error messages are announced by screen readers
- [ ] Focus moves to first error on validation failure
- [ ] Submit button shows loading state
- [ ] Success message is announced

## WCAG 2.1 Level AA Compliance

This pattern meets:
- **1.3.1 Info and Relationships** (A)
- **2.1.1 Keyboard** (A)
- **3.2.2 On Input** (A)
- **3.3.1 Error Identification** (A)
- **3.3.2 Labels or Instructions** (A)
- **3.3.3 Error Suggestion** (AA)
- **4.1.3 Status Messages** (AA)
