import { defineCommand } from 'citty'
import { checkAllComponentsStatus, checkComponentStatus } from '../utils/status.js'
import * as p from '@clack/prompts'
import pc from 'picocolors'

export const statusCommand = defineCommand({
  meta: {
    name: 'status',
    description: 'Check status of installed components',
  },
  args: {
    component: {
      type: 'string',
      description: 'Check specific component (optional)',
    },
  },
  async run({ args }) {
    const cwd = process.cwd()

    p.intro(pc.cyan('Component Status'))

    // Check specific component or all components
    const results = args.component
      ? [await checkComponentStatus(cwd, args.component)]
      : await checkAllComponentsStatus(cwd)

    if (results.length === 0) {
      p.log.warn('No components installed')
      p.log.info('Run `luman add <component>` to install components')
      p.outro('Done')
      return
    }

    // Group by status for cleaner output
    const unchanged = results.filter((r) => r.status.state === 'unchanged')
    const customized = results.filter((r) => r.status.state === 'customized')
    const outdated = results.filter((r) => r.status.state === 'outdated')
    const missing = results.filter((r) =>
      r.files.some((f) => f.status === 'missing')
    )
    const untracked = results.filter((r) => r.status.state === 'untracked')

    // Display unchanged components
    if (unchanged.length > 0) {
      p.log.success(`${unchanged.length} component(s) up to date`)
      unchanged.forEach((r) => {
        if (r.status.state === 'unchanged') {
          console.log(`  ${pc.green('✓')} ${r.component}@${r.status.version}`)
        }
      })
    }

    // Display customized components with warning
    if (customized.length > 0) {
      p.log.warn(`${customized.length} component(s) customized`)
      customized.forEach((r) => {
        if (r.status.state === 'customized') {
          console.log(
            `  ${pc.yellow('⚠')} ${r.component}@${r.status.version} ${pc.dim('(modified)')}`
          )
        }
      })
      console.log(
        pc.dim('  These components have local modifications.')
      )
    }

    // Display outdated components
    if (outdated.length > 0) {
      p.log.info(`${outdated.length} component(s) have updates available`)
      outdated.forEach((r) => {
        if (r.status.state === 'outdated') {
          console.log(
            `  ${pc.blue('↑')} ${r.component}: ${r.status.installedVersion} ${pc.dim('→')} ${r.status.latestVersion}`
          )
        }
      })
      console.log(pc.dim('  Run `luman update <component>` to update'))
    }

    // Display missing files with error
    if (missing.length > 0) {
      p.log.error(`${missing.length} component(s) have missing files`)
      missing.forEach((r) => {
        const missingFiles = r.files.filter((f) => f.status === 'missing')
        console.log(
          `  ${pc.red('✗')} ${r.component}: ${missingFiles.length} file(s) missing`
        )
        missingFiles.forEach((f) => {
          console.log(`    ${pc.dim('•')} ${f.path}`)
        })
      })
      console.log(
        pc.dim('  Run `luman add <component>` to reinstall missing files')
      )
    }

    // Display untracked components
    if (untracked.length > 0) {
      p.log.warn(`${untracked.length} component(s) not tracked`)
      untracked.forEach((r) => {
        console.log(`  ${pc.gray('?')} ${r.component}`)
      })
    }

    p.outro('Done')
  },
})
