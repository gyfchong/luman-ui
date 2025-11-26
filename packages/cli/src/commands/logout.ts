import { defineCommand } from 'citty'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'
import { logoutApi } from '../utils/api.js'
import { removeAuth, isAuthenticated, loadAuth } from '../utils/auth.js'

export default defineCommand({
  meta: {
    name: 'logout',
    description: 'Logout from Luman backend',
  },
  async run() {
    prompts.intro(colors.bold('Logout from Luman'))

    // Check if logged in
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      prompts.outro(colors.yellow('You are not logged in'))
      process.exit(0)
    }

    const auth = await loadAuth()
    const spinner = prompts.spinner()
    spinner.start('Logging out...')

    // Try to revoke token on backend
    const result = await logoutApi()

    if (result.error) {
      spinner.stop(colors.yellow('Could not revoke token on server'))
      prompts.log.warn(
        'Token revocation failed, but local auth will be removed'
      )
    } else {
      spinner.stop(colors.green('Token revoked'))
    }

    // Remove local auth
    await removeAuth()

    prompts.outro(
      colors.green(
        `Logged out ${auth?.user.email}. Use ${colors.cyan('luman login')} to login again.`
      )
    )
  },
})
