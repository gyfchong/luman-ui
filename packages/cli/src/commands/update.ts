import { defineCommand } from 'citty'
import { checkComponentStatus } from '../utils/status.js'
import { getRegistryItem } from '../utils/registry.js'
import { addComponent } from '../api.js'
import { generateDiff } from '../utils/diff.js'
import * as p from '@clack/prompts'
import pc from 'picocolors'

export const updateCommand = defineCommand({
  meta: {
    name: 'update',
    description: 'Update component to latest version',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component name to update',
      required: true,
    },
    force: {
      type: 'boolean',
      description: 'Force update even if customized',
      default: false,
    },
  },
  async run({ args }) {
    const cwd = process.cwd()

    p.intro(pc.cyan(`Updating ${args.component}`))

    // Check current status
    const status = await checkComponentStatus(cwd, args.component)

    // Handle untracked components
    if (status.status.state === 'untracked') {
      p.log.warn('Component not installed')
      const shouldInstall = await p.confirm({
        message: 'Would you like to install it?',
      })

      if (p.isCancel(shouldInstall) || !shouldInstall) {
        p.cancel('Update cancelled')
        return
      }

      // Fall through to install via addComponent
    }

    // Handle up-to-date components
    if (status.status.state === 'unchanged') {
      p.log.success('Component is already up to date')
      p.outro('Done')
      return
    }

    // Handle customized components
    if (status.status.state === 'customized' && !args.force) {
      p.log.warn('Component has been customized')

      // Show which files were modified
      const modifiedFiles = status.files.filter(
        (f) => f.status === 'modified'
      )
      if (modifiedFiles.length > 0) {
        console.log(`\n  ${pc.yellow('Modified files:')}`)
        modifiedFiles.forEach((f) => {
          console.log(`    ${pc.dim('•')} ${f.path}`)
        })
        console.log()
      }

      const confirm = await p.confirm({
        message: 'This will overwrite your changes. Continue?',
      })

      if (p.isCancel(confirm) || !confirm) {
        p.cancel('Update cancelled')
        return
      }

      // Offer to show diff
      const shouldShowDiff = await p.confirm({
        message: 'Would you like to see what will change?',
        initialValue: true,
      })

      if (shouldShowDiff && !p.isCancel(shouldShowDiff)) {
        try {
          const registryItem = await getRegistryItem(args.component)
          if (registryItem) {
            const diff = await generateDiff(cwd, args.component, registryItem)
            console.log('\n' + diff + '\n')
          }
        } catch (error) {
          p.log.warn('Could not generate diff')
        }
      }
    }

    // Handle outdated components
    if (status.status.state === 'outdated') {
      const outdatedStatus = status.status // Type narrowing
      p.log.info(
        `Current: ${outdatedStatus.installedVersion} ${pc.dim('→')} Latest: ${outdatedStatus.latestVersion}`
      )

      try {
        const registryItem = await getRegistryItem(args.component)
        if (!registryItem) {
          p.log.warn('Could not fetch component from registry')
        } else {
          const changelog = registryItem.changelog?.find(
            (c: any) => c.version === outdatedStatus.latestVersion
          )

        if (changelog) {
          // Check for breaking changes
          const isBreaking = /BREAKING|major/i.test(
            changelog.changes.join(' ')
          )

          if (isBreaking) {
            console.log()
            p.log.warn(pc.red('⚠ BREAKING CHANGES'))
            console.log()
          }

            console.log(pc.bold(`\nChanges in v${changelog.version}:`))
            changelog.changes.forEach((change: string) => {
              console.log(`  ${pc.dim('•')} ${change}`)
            })
            console.log()

            // Show diff for updates
            const shouldShowDiff = await p.confirm({
              message: 'Would you like to see the diff?',
              initialValue: isBreaking, // Auto-show diff for breaking changes
            })

            if (shouldShowDiff && !p.isCancel(shouldShowDiff)) {
              const diff = await generateDiff(cwd, args.component, registryItem)
              console.log('\n' + diff + '\n')
            }
          }
        }
      } catch (error) {
        p.log.warn('Could not fetch changelog')
      }
    }

    // Perform update
    const spinner = p.spinner()
    spinner.start('Updating component...')

    try {
      await addComponent(args.component, cwd)
      spinner.stop(pc.green('✓ Component updated successfully'))

      p.outro(pc.green(`${args.component} is now up to date`))
    } catch (error) {
      spinner.stop(pc.red('✗ Update failed'))

      if (error instanceof Error) {
        p.log.error(error.message)
      } else {
        p.log.error('Unknown error occurred')
      }

      p.cancel('Update failed')
      process.exit(1)
    }
  },
})
