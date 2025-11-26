/**
 * Init Command
 *
 * Initializes luman-ui in your project by creating a configuration file and optionally
 * installing components. Detects your project setup (framework, package manager, TypeScript)
 * and guides you through the setup process.
 *
 * @example
 * # Interactive mode - prompts for all configuration options
 * luman init
 *
 * @example
 * # Initialize and install all components
 * luman init --components=all
 *
 * @example
 * # Initialize and install specific components
 * luman init --components=button,card,dialog
 *
 * @example
 * # Skip all prompts and use defaults
 * luman init -y
 * luman init --yes
 *
 * @example
 * # Interactive mode shows multi-select menu with:
 * # - "All components (N)" option
 * # - "None (skip installation)" option
 * # - Individual component list (multi-select supported)
 */

import { defineCommand } from 'citty'
import { writeConfig, detectProjectInfo, configExists, listComponents, addComponent } from '../api'
import colors from 'picocolors'
import * as p from '@clack/prompts'
import type { Config } from '../types'

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize luman-ui in your project',
  },
  args: {
    components: {
      type: "string",
      description: "Comma-separated list of components to install (use 'all' for all components)",
    },
    yes: {
      type: "boolean",
      alias: "y",
      description: "Skip all prompts and use defaults",
      default: false,
    },
  },
  async run({ args }) {
    try {
      p.intro(colors.bold('Initialize luman-ui'))

      // Check if config already exists
      if (await configExists()) {
        const overwrite = await p.confirm({
          message: 'Configuration already exists. Overwrite?',
        })

        if (p.isCancel(overwrite) || !overwrite) {
          p.cancel('Operation cancelled')
          process.exit(0)
        }
      }

      // Detect project
      const spinner = p.spinner()
      spinner.start('Detecting project configuration')

      const projectInfo = await detectProjectInfo()

      spinner.stop('Project detected')

      console.log(`\n${colors.dim('Framework:')} ${projectInfo.framework}`)
      console.log(`${colors.dim('Package Manager:')} ${projectInfo.packageManager}`)
      console.log(`${colors.dim('TypeScript:')} ${projectInfo.typescript ? 'Yes' : 'No'}`)

      // Ask for configuration
      const componentsPath = (await p.text({
        message: 'Where would you like to install components?',
        placeholder: './src/components',
        defaultValue: './src/components',
      })) as string

      if (p.isCancel(componentsPath)) {
        p.cancel('Operation cancelled')
        process.exit(0)
      }

      const utilsPath = (await p.text({
        message: 'Where would you like to install utilities?',
        placeholder: './src/lib',
        defaultValue: './src/lib',
      })) as string

      if (p.isCancel(utilsPath)) {
        p.cancel('Operation cancelled')
        process.exit(0)
      }

      const cssPath = (await p.text({
        message: 'Where is your global CSS file?',
        placeholder: './src/app/globals.css',
        defaultValue: projectInfo.appDir
          ? './src/app/globals.css'
          : './src/styles/globals.css',
      })) as string

      if (p.isCancel(cssPath)) {
        p.cancel('Operation cancelled')
        process.exit(0)
      }

      const tailwindConfig = (await p.text({
        message: 'Where is your tailwind.config file?',
        placeholder: './tailwind.config.ts',
        defaultValue: './tailwind.config.ts',
      })) as string

      if (p.isCancel(tailwindConfig)) {
        p.cancel('Operation cancelled')
        process.exit(0)
      }

      // Create config
      const config: Config = {
        style: 'default',
        rsc: projectInfo.framework === 'next',
        tsx: projectInfo.typescript,
        tailwind: {
          config: tailwindConfig,
          css: cssPath,
          baseColor: 'slate',
          cssVariables: true,
          prefix: '',
        },
        aliases: {
          components: componentsPath,
          utils: utilsPath,
        },
      }

      spinner.start('Writing configuration')

      await writeConfig(process.cwd(), config)

      spinner.stop(`${colors.green('✓')} Configuration written to components.json`)

      // Handle component installation
      const { components } = await listComponents()
      const componentCount = components.length
      let componentsToInstall: string[] = []

      if (componentCount > 0) {
        // Check if components were specified via flag
        if (args.components) {
          const componentsArg = args.components as string
          if (componentsArg === 'all') {
            componentsToInstall = components
          } else {
            componentsToInstall = componentsArg.split(',').map(c => c.trim()).filter(Boolean)
          }
        } else if (!args.yes) {
          // Interactive mode - show multi-select menu
          console.log(`\n${colors.dim(`Found ${componentCount} component${componentCount === 1 ? '' : 's'} available`)}`)

          const selected = await p.multiselect({
            message: 'Which components would you like to install?',
            options: [
              { value: '__all__', label: colors.cyan('All components') + colors.dim(` (${componentCount})`) },
              { value: '__none__', label: colors.dim('None (skip installation)') },
              ...components.map((c) => ({ value: c, label: c })),
            ],
            required: false,
          }) as string[]

          if (!p.isCancel(selected)) {
            if (selected.includes('__all__')) {
              componentsToInstall = components
            } else if (selected.includes('__none__') || selected.length === 0) {
              componentsToInstall = []
            } else {
              componentsToInstall = selected.filter(s => s !== '__all__' && s !== '__none__')
            }
          }
        }

        // Install selected components
        if (componentsToInstall.length > 0) {
          const installSpinner = p.spinner()
          installSpinner.start(`Installing ${componentsToInstall.length} component${componentsToInstall.length === 1 ? '' : 's'}`)

          const installed: string[] = []
          const failed: string[] = []

          for (const component of componentsToInstall) {
            try {
              await addComponent(component, process.cwd())
              installed.push(component)
            } catch (error) {
              failed.push(component)
              console.error(colors.dim(`\n  Failed to install ${component}: ${error instanceof Error ? error.message : error}`))
            }
          }

          if (installed.length > 0) {
            installSpinner.stop(`${colors.green('✓')} Installed ${installed.length} component${installed.length === 1 ? '' : 's'}`)
          } else {
            installSpinner.stop(colors.red('No components were installed'))
          }

          if (failed.length > 0) {
            console.log(colors.yellow(`\n⚠ ${failed.length} component${failed.length === 1 ? '' : 's'} failed to install: ${failed.join(', ')}`))
          }
        }
      }

      p.outro(
        `${colors.green('Success!')} You can now add components with ${colors.cyan('luman add <component>')}`
      )
    } catch (error) {
      console.error(colors.red('Error:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  },
})
