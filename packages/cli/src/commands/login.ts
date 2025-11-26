import { defineCommand } from 'citty'
import * as prompts from '@clack/prompts'
import colors from 'picocolors'
import { loginApi, checkBackendHealth } from '../utils/api.js'
import { saveAuth, getApiUrl } from '../utils/auth.js'

export default defineCommand({
  meta: {
    name: 'login',
    description: 'Login to Luman backend',
  },
  args: {
    email: {
      type: 'string',
      description: 'Email address',
    },
    'api-url': {
      type: 'string',
      description: 'Backend API URL',
    },
  },
  async run({ args }) {
    prompts.intro(colors.bold('Login to Luman'))

    // Set API URL if provided
    if (args['api-url']) {
      process.env.LUMAN_API_URL = args['api-url']
    }

    const apiUrl = await getApiUrl()

    // Check backend health
    const isHealthy = await checkBackendHealth()
    if (!isHealthy) {
      prompts.outro(
        colors.red(
          `Cannot connect to backend at ${apiUrl}. Please check that the server is running.`
        )
      )
      process.exit(1)
    }

    // Get email
    let email = args.email
    if (!email) {
      const emailInput = await prompts.text({
        message: 'Email:',
        validate: (value) => {
          if (!value) return 'Email is required'
          if (!value.includes('@')) return 'Invalid email address'
        },
      })

      if (prompts.isCancel(emailInput)) {
        prompts.cancel('Login cancelled')
        process.exit(0)
      }

      email = emailInput as string
    }

    // Get password
    const password = await prompts.password({
      message: 'Password:',
      validate: (value) => {
        if (!value) return 'Password is required'
      },
    })

    if (prompts.isCancel(password)) {
      prompts.cancel('Login cancelled')
      process.exit(0)
    }

    const spinner = prompts.spinner()
    spinner.start('Logging in...')

    // Login
    const result = await loginApi(email!, password as string)

    if (result.error || !result.data) {
      spinner.stop(colors.red('Login failed'))
      prompts.outro(colors.red(result.error?.error || 'Login failed'))
      process.exit(1)
    }

    // Save auth config
    await saveAuth({
      token: result.data.token,
      user: result.data.user,
      apiUrl,
    })

    spinner.stop(colors.green('Login successful'))

    prompts.note(
      `${colors.cyan('Email:')} ${result.data.user.email}\n${colors.cyan('Name:')} ${result.data.user.name || 'Not set'}`,
      'User Info'
    )

    prompts.outro(
      colors.green(
        `You're now logged in! Use ${colors.cyan('luman logout')} to logout.`
      )
    )
  },
})
