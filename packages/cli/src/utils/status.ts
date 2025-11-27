import { hashFile, hashFiles } from './hash.js'
import { readManifest } from './manifest.js'
import { getRegistryItem } from './registry.js'
import type { StatusResult, ComponentStatus } from '../types/versioning.js'
import { pathExists } from 'fs-extra'
import { join } from 'node:path'

/**
 * Check status of a single installed component
 *
 * Compares local files against manifest to detect:
 * - unchanged: Matches manifest hash and version
 * - customized: Hash differs from manifest (user modified files)
 * - outdated: Registry has newer version available
 * - missing: Component in manifest but files missing
 * - untracked: Component not in manifest
 *
 * Supports offline mode: if registry fetch fails, only local status is checked.
 *
 * @param cwd - Project directory
 * @param componentName - Component name to check
 * @returns Status result with component state and file states
 */
export async function checkComponentStatus(
  cwd: string,
  componentName: string
): Promise<StatusResult> {
  const manifest = await readManifest(cwd)

  // Component not tracked in manifest
  if (!manifest || !manifest.components[componentName]) {
    return {
      component: componentName,
      status: { state: 'untracked' },
      files: [],
    }
  }

  const manifestEntry = manifest.components[componentName]

  // Check each file's existence
  const fileStatuses = await Promise.all(
    manifestEntry.files.map(async (file) => {
      const fullPath = join(cwd, file)
      const exists = await pathExists(fullPath)

      if (!exists) {
        return { path: file, status: 'missing' as const }
      }

      return { path: file, status: 'ok' as const }
    })
  )

  // Compute current hash of all installed files
  const existingFiles = fileStatuses
    .filter((f) => f.status !== 'missing')
    .map((f) => join(cwd, f.path))

  const currentHash =
    existingFiles.length > 0 ? await hashFiles(existingFiles) : ''

  // Check for customization (hash mismatch)
  if (currentHash !== manifestEntry.contentHash) {
    return {
      component: componentName,
      status: {
        state: 'customized',
        version: manifestEntry.version,
        diff: '', // Populated by update command when needed
      },
      files: fileStatuses.map((f) =>
        f.status === 'ok' ? { ...f, status: 'modified' as const } : f
      ),
    }
  }

  // Check for updates (requires registry access)
  // If registry fetch fails (offline), we skip this check
  try {
    const registryItem = await getRegistryItem(componentName)

    if (registryItem && registryItem.version !== manifestEntry.version) {
      return {
        component: componentName,
        status: {
          state: 'outdated',
          installedVersion: manifestEntry.version,
          latestVersion: registryItem.version,
          diff: '', // Populated by update command when needed
        },
        files: fileStatuses,
      }
    }
  } catch (error) {
    // Offline mode: can't check for updates
    // Just return that it's unchanged (based on hash)
    // Could log warning here if needed
  }

  // All checks passed: component is unchanged
  return {
    component: componentName,
    status: { state: 'unchanged', version: manifestEntry.version },
    files: fileStatuses,
  }
}

/**
 * Check status of all installed components
 *
 * Returns empty array if no manifest exists (no components installed).
 *
 * @param cwd - Project directory
 * @returns Array of status results for all components
 */
export async function checkAllComponentsStatus(
  cwd: string
): Promise<StatusResult[]> {
  const manifest = await readManifest(cwd)

  if (!manifest) {
    return []
  }

  const componentNames = Object.keys(manifest.components)

  return Promise.all(
    componentNames.map((name) => checkComponentStatus(cwd, name))
  )
}
