import { diffLines } from 'diff'
import { readFile } from 'fs-extra'
import { join } from 'node:path'
import { getConfig } from './config.js'
import pc from 'picocolors'
import type { RegistryItem, Config } from '../types.js'

/**
 * Generate unified diff showing changes between installed and new component versions
 *
 * Displays git-style diff output with + for additions, - for deletions.
 * Files that don't exist locally are marked as new files.
 *
 * @param cwd - Project directory
 * @param componentName - Component name
 * @param registryItem - Registry item with new component content
 * @returns Formatted diff string with colors
 */
export async function generateDiff(
  cwd: string,
  _componentName: string,
  registryItem: RegistryItem
): Promise<string> {
  const config = await getConfig(cwd)
  if (!config) {
    throw new Error('No config found. Run `luman init` first.')
  }

  const output: string[] = []

  for (const file of registryItem.files) {
    const targetPath = resolveFilePath(config, file.path)
    const fullPath = join(cwd, targetPath)

    try {
      const currentContent = await readFile(fullPath, 'utf-8')
      const newContent = file.content || ''

      const diff = diffLines(currentContent, newContent)

      // Only show diff if there are actual changes
      if (diff.some((part) => part.added || part.removed)) {
        output.push(pc.bold(`\n--- ${targetPath}`))
        output.push(pc.bold(`+++ ${targetPath} (new version)\n`))

        diff.forEach((part) => {
          const prefix = part.added ? '+' : part.removed ? '-' : ' '
          const color = part.added
            ? pc.green
            : part.removed
              ? pc.red
              : (text: string) => text

          part.value.split('\n').forEach((line: string) => {
            if (line) {
              output.push(color(`${prefix} ${line}`))
            }
          })
        })
      }
    } catch (error) {
      // File doesn't exist locally, mark as new file
      output.push(pc.yellow(`\n+++ ${targetPath} (new file)`))

      if (file.content) {
        const lines = file.content.split('\n')
        lines.forEach((line) => {
          if (line) {
            output.push(pc.green(`+ ${line}`))
          }
        })
      }
    }
  }

  return output.length > 0 ? output.join('\n') : 'No changes detected'
}

/**
 * Resolve registry file path to user's configured path
 *
 * Maps registry conventions (ui/, lib/) to user's configured aliases.
 *
 * @param config - User's luman config
 * @param registryPath - Path from registry (e.g., "ui/button.tsx")
 * @returns Resolved path based on config aliases
 */
function resolveFilePath(config: Config, registryPath: string): string {
  // Map registry paths to user's configured paths
  if (registryPath.startsWith('ui/')) {
    return join(config.aliases.components, registryPath.replace('ui/', ''))
  }
  if (registryPath.startsWith('lib/')) {
    return join(config.aliases.utils, registryPath.replace('lib/', ''))
  }
  if (registryPath.startsWith('hooks/')) {
    const hooksPath = config.aliases.hooks || config.aliases.components
    return join(hooksPath, registryPath.replace('hooks/', ''))
  }
  // Fallback: use path as-is
  return registryPath
}
