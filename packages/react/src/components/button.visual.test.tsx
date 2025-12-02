import { render } from "@testing-library/react"
import { page } from "@vitest/browser/context"
import { expect, test } from "vitest"
import { Button } from "./button.tsx"

test.describe("Button Visual Tests", () => {
  test("renders default button", async () => {
    render(<Button>Click me</Button>)
    await expect.element(page.getByRole("button")).toMatchScreenshot("button-default.png")
  })

  test("renders button with custom className", async () => {
    render(<Button className="custom-class">Custom Button</Button>)
    await expect.element(page.getByRole("button")).toMatchScreenshot("button-custom-class.png")
  })

  test("renders disabled button", async () => {
    render(<Button disabled>Disabled Button</Button>)
    await expect.element(page.getByRole("button")).toMatchScreenshot("button-disabled.png")
  })

  test("renders submit button", async () => {
    render(<Button type="submit">Submit</Button>)
    await expect.element(page.getByRole("button")).toMatchScreenshot("button-submit.png")
  })

  test("renders reset button", async () => {
    render(<Button type="reset">Reset</Button>)
    await expect.element(page.getByRole("button")).toMatchScreenshot("button-reset.png")
  })
})
