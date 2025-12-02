import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers"
import type { JestAxeMatchers } from "jest-axe/dist/matchers"

declare module "vitest" {
  interface Assertion<T = unknown>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void>,
      JestAxeMatchers {}
  interface AsymmetricMatchersContaining extends JestAxeMatchers {}
}
