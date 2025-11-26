/**
 * List Command
 *
 * Lists all available components from the registry. Displays component names
 * and the total count of available components.
 *
 * @example
 * # List all available components
 * luman list
 *
 * @example
 * # Output format:
 * # Available Components:
 * #
 * #   • button
 * #   • card
 * #   • dialog
 * #
 * # Total: 3 components
 */

import { defineCommand } from 'citty'
import { listComponents } from '../api'
import colors from 'picocolors'

export default defineCommand({
  meta: {
    name: 'list',
    description: 'List all available components',
  },
  async run() {
    try {
      const result = await listComponents()

      console.log(colors.bold('\nAvailable Components:\n'))

      for (const component of result.components) {
        console.log(`  ${colors.cyan('•')} ${component}`)
      }

      console.log(`\n${colors.dim(`Total: ${result.components.length} components`)}\n`)
    } catch (error) {
      console.error(colors.red('Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  },
})
