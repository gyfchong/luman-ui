import * as matchers from "@testing-library/jest-dom/matchers"
import { cleanup } from "@testing-library/react"
import { configureAxe, toHaveNoViolations } from "jest-axe"
import { afterEach, expect } from "vitest"

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Extend Vitest's expect with axe matchers
expect.extend(toHaveNoViolations)

// Configure axe for accessibility testing with disabled color-contrast
// due to jsdom canvas limitations
export const axe = configureAxe({
  rules: {
    "color-contrast": { enabled: false },
  },
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})
