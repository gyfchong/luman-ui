import { defineCommand } from 'citty'
import { readJSON, writeJSON } from 'fs-extra'
import { join } from 'node:path'
import { hashContent } from '../../utils/hash.js'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import { inc } from 'semver'

export const bumpCommand = defineCommand({
  meta: {
    name: 'bump',
    description: 'Bump version of a registry component',
  },
  args: {
    component: {
      type: 'positional',
      description: 'Component name to bump',
      required: true,
    },
    type: {
      type: 'string',
      description: 'Version bump type: major, minor, patch',
    },
  },
  async run({ args }) {
    // Assume running from monorepo root
    const registryPath = join(process.cwd(), 'packages/ui/src/registry')
    const itemPath = join(registryPath, 'items', `${args.component}.json`)

    p.intro(pc.cyan(`Bumping ${args.component}`))

    // Read current registry item
    let item: any
    try {
      item = await readJSON(itemPath)
    } catch (error) {
      p.log.error(`Component "${args.component}" not found in registry`)
      p.cancel('Bump cancelled')
      process.exit(1)
    }

    const currentVersion = item.version || '0.0.0'
    p.log.info(`Current version: ${currentVersion}`)

    // Prompt for bump type if not specified
    let bumpType = args.type
    if (!bumpType || !['major', 'minor', 'patch'].includes(bumpType)) {
      const selected = await p.select({
        message: 'Select version bump type:',
        options: [
          {
            value: 'patch',
            label: 'Patch',
            hint: 'Bug fixes (e.g., 1.0.0 → 1.0.1)',
          },
          {
            value: 'minor',
            label: 'Minor',
            hint: 'New features (e.g., 1.0.0 → 1.1.0)',
          },
          {
            value: 'major',
            label: 'Major',
            hint: 'Breaking changes (e.g., 1.0.0 → 2.0.0)',
          },
        ],
      })

      if (p.isCancel(selected)) {
        p.cancel('Bump cancelled')
        process.exit(0)
      }

      bumpType = selected as string
    }

    // Calculate new version
    const newVersion = inc(currentVersion, bumpType as any)

    if (!newVersion) {
      p.log.error('Invalid version bump')
      p.cancel('Bump cancelled')
      process.exit(1)
    }

    p.log.success(`New version: ${currentVersion} → ${newVersion}`)

    // Prompt for changelog entry
    const changelogEntry = await p.text({
      message: 'Describe the changes (comma-separated):',
      placeholder: 'Fixed button hover state, Added disabled variant',
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Please describe the changes'
        }
      },
    })

    if (p.isCancel(changelogEntry)) {
      p.cancel('Bump cancelled')
      process.exit(0)
    }

    const changes = (changelogEntry as string)
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)

    // Compute content hash from all file contents
    const fileContents = item.files.map((f: any) => f.content || '').join('\n')
    const contentHash = hashContent(fileContents)

    // Update registry item
    item.version = newVersion
    item.contentHash = contentHash
    item.publishedAt = new Date().toISOString()

    // Add changelog entry
    if (!item.changelog) {
      item.changelog = []
    }

    item.changelog.unshift({
      version: newVersion,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      changes,
    })

    // Write updated item
    await writeJSON(itemPath, item, { spaces: 2 })

    p.log.success(`Updated ${args.component}`)
    p.log.info(`Version: ${newVersion}`)
    p.log.info(`Hash: ${contentHash.slice(0, 12)}...`)
    p.log.info(`Changelog entries: ${item.changelog.length}`)

    p.outro(pc.green('✓ Registry item bumped successfully'))
  },
})
