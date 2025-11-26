import { defineCommand } from 'citty'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'
import { getCurrentUser } from '../utils/api.js'
import { isAuthenticated, loadAuth } from '../utils/auth.js'

export default defineCommand({
  meta: {
    name: 'whoami',
    description: 'Show current user information',
  },
  async run() {
    // Check if logged in
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      console.log(colors.yellow('Not logged in'))
      console.log(
        `Use ${colors.cyan('luman login')} to authenticate with the backend`
      )
      process.exit(0)
    }

    const auth = await loadAuth()

    const spinner = prompts.spinner()
    spinner.start('Fetching user info...')

    const result = await getCurrentUser()

    if (result.error || !result.data) {
      spinner.stop(colors.red('Failed to fetch user info'))
      console.log(colors.red(result.error?.error || 'Unknown error'))
      console.log(
        colors.yellow(
          '\nLocal auth info (may be stale):'
        )
      )
      console.log(`Email: ${auth?.user.email}`)
      console.log(`Name: ${auth?.user.name || 'Not set'}`)
      process.exit(1)
    }

    spinner.stop(colors.green('User info retrieved'))

    prompts.note(
      `${colors.cyan('ID:')} ${result.data.user.id}\n${colors.cyan('Email:')} ${result.data.user.email}\n${colors.cyan('Name:')} ${result.data.user.name || 'Not set'}\n${colors.cyan('Created:')} ${new Date(result.data.user.createdAt).toLocaleString()}\n${colors.cyan('Updated:')} ${new Date(result.data.user.updatedAt).toLocaleString()}`,
      'Current User'
    )
  },
})
