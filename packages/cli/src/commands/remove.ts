/**
 * Remove Command
 *
 * Removes a component from your project. Deletes all component files and prompts
 * for confirmation before removal. Note: This does not uninstall npm dependencies.
 *
 * @example
 * # Remove a specific component (with confirmation prompt)
 * luman remove button
 *
 * @example
 * # The command will:
 * # 1. Prompt for confirmation
 * # 2. Delete all component files
 * # 3. Display list of deleted files
 *
 * @example
 * # Output format:
 * # Are you sure you want to remove button?
 * # ✓ Successfully removed button
 * #
 * # Files deleted:
 * #   ./src/components/button.tsx
 */

import { defineCommand } from 'citty'
import { removeComponent } from '../api'
import colors from 'picocolors'
import * as p from '@clack/prompts'

export default defineCommand({
  meta: {
    name: 'remove',
    description: 'Remove a component from your project',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component name to remove',
      required: true,
    },
  },
  async run({ args }) {
    try {
      const componentName = args.component as string

      const confirmed = await p.confirm({
        message: `Are you sure you want to remove ${componentName}?`,
      })

      if (p.isCancel(confirmed) || !confirmed) {
        p.cancel('Operation cancelled')
        process.exit(0)
      }

      const spinner = p.spinner()
      spinner.start(`Removing ${componentName}`)

      const result = await removeComponent(componentName)

      spinner.stop(`${colors.green('✓')} Successfully removed ${componentName}`)

      console.log(`\n${colors.bold('Files deleted:')}`)
      for (const file of result.filesDeleted) {
        console.log(`  ${colors.dim(file)}`)
      }

      console.log()
    } catch (error) {
      console.error(colors.red('Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  },
})
