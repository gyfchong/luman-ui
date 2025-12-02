/**
 * Add Command
 *
 * Adds components from the registry to your project. Supports adding single components,
 * multiple components, or all components at once.
 *
 * @example
 * # Interactive mode - shows menu to select components
 * luman add
 *
 * @example
 * # Add a specific component
 * luman add button
 *
 * @example
 * # Add multiple components
 * luman add button card dialog
 *
 * @example
 * # Add all components
 * luman add all
 * luman add --all
 *
 * @example
 * # The interactive menu includes:
 * # - "All components (N)" option at the top
 * # - Individual component list below
 */

import * as p from "@clack/prompts"
import { defineCommand } from "citty"
import colors from "picocolors"
import { addComponent } from "../api"

export default defineCommand({
  meta: {
    name: "add",
    description: "Add a component to your project",
  },
  args: {
    components: {
      type: "positional",
      description: "Component name(s) to add (use 'all' to install all components)",
      required: false,
    },
    all: {
      type: "boolean",
      description: "Install all components",
      default: false,
    },
  },
  async run({ args, rawArgs }) {
    try {
      const { listComponents } = await import("../api")
      const { components } = await listComponents()

      let componentsToInstall: string[] = []

      // Get all positional arguments (component names)
      const componentArgs = rawArgs.filter((arg) => !arg.startsWith("-"))

      // Check if --all flag is used or "all" is in arguments
      if (args.all || componentArgs.includes("all")) {
        componentsToInstall = components
      } else if (componentArgs.length > 0) {
        componentsToInstall = componentArgs
      } else {
        // Interactive mode
        p.intro(colors.bold("Add Component"))

        const selection = (await p.select({
          message: "Which component would you like to add?",
          options: [
            {
              value: "__all__",
              label: colors.cyan("All components") + colors.dim(` (${components.length})`),
            },
            ...components.map((c) => ({ value: c, label: c })),
          ],
        })) as string

        if (p.isCancel(selection)) {
          p.cancel("Operation cancelled")
          process.exit(0)
        }

        if (selection === "__all__") {
          componentsToInstall = components
        } else {
          componentsToInstall = [selection]
        }
      }

      if (componentsToInstall.length === 0) {
        console.log(colors.yellow("No components to install"))
        return
      }

      const spinner = p.spinner()
      const isMultiple = componentsToInstall.length > 1
      spinner.start(
        isMultiple
          ? `Installing ${componentsToInstall.length} component${componentsToInstall.length === 1 ? "" : "s"}`
          : `Installing ${componentsToInstall[0]}`
      )

      const allInstalled: string[] = []
      const allFilesWritten: string[] = []
      const failed: string[] = []

      for (const componentName of componentsToInstall) {
        try {
          const result = await addComponent(componentName)
          allInstalled.push(...result.installed)
          allFilesWritten.push(...result.filesWritten)
        } catch (error) {
          failed.push(componentName)
          console.error(
            colors.dim(
              `\n  Failed to install ${componentName}: ${error instanceof Error ? error.message : error}`
            )
          )
        }
      }

      if (allInstalled.length > 0) {
        spinner.stop(
          isMultiple
            ? `${colors.green("✓")} Successfully installed ${allInstalled.length} component${allInstalled.length === 1 ? "" : "s"}`
            : `${colors.green("✓")} Successfully installed ${componentsToInstall[0]}`
        )

        console.log(`\n${colors.bold("Installed components:")}`)
        for (const comp of allInstalled) {
          console.log(`  ${colors.cyan("•")} ${comp}`)
        }

        console.log(`\n${colors.bold("Files written:")}`)
        for (const file of allFilesWritten) {
          console.log(`  ${colors.dim(file)}`)
        }
      } else {
        spinner.stop(colors.red("No components were installed"))
      }

      if (failed.length > 0) {
        console.log(
          colors.yellow(
            `\n⚠ ${failed.length} component${failed.length === 1 ? "" : "s"} failed to install: ${failed.join(", ")}`
          )
        )
      }

      console.log()
    } catch (error) {
      console.error(colors.red("Error:"), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  },
})
