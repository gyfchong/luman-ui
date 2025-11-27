import { pathExists, readJSON, writeJSON, ensureDir } from 'fs-extra'
import { join, dirname } from 'node:path'
import type { Manifest } from '../types/versioning.js'
import { ManifestSchema } from '../types/versioning.js'

const MANIFEST_PATH = '.luman/manifest.json'

/**
 * Get absolute path to manifest file
 */
export async function getManifestPath(cwd: string): Promise<string> {
  return join(cwd, MANIFEST_PATH)
}

/**
 * Check if manifest file exists
 */
export async function manifestExists(cwd: string): Promise<boolean> {
  return pathExists(await getManifestPath(cwd))
}

/**
 * Read and validate manifest file
 *
 * @returns Manifest object or null if file doesn't exist
 * @throws Error if manifest file is invalid or corrupted
 */
export async function readManifest(cwd: string): Promise<Manifest | null> {
  const manifestPath = await getManifestPath(cwd)

  if (!(await pathExists(manifestPath))) {
    return null
  }

  try {
    const data = await readJSON(manifestPath)
    return ManifestSchema.parse(data)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid manifest file: ${error.message}`)
    }
    throw new Error('Invalid manifest file: Unknown error')
  }
}

/**
 * Write manifest file
 *
 * Creates .luman directory if it doesn't exist.
 */
export async function writeManifest(
  cwd: string,
  manifest: Manifest
): Promise<void> {
  const manifestPath = await getManifestPath(cwd)
  await ensureDir(dirname(manifestPath))
  await writeJSON(manifestPath, manifest, { spaces: 2 })
}

/**
 * Initialize new manifest file
 *
 * Creates a fresh manifest with no components installed.
 *
 * @param cwd - Project directory
 * @param cliVersion - Version of CLI creating the manifest
 * @returns Newly created manifest
 */
export async function initializeManifest(
  cwd: string,
  cliVersion: string
): Promise<Manifest> {
  const manifest: Manifest = {
    schemaVersion: 1,
    installedAt: new Date().toISOString(),
    cliVersion,
    components: {},
  }
  await writeManifest(cwd, manifest)
  return manifest
}

/**
 * Add or update component entry in manifest
 *
 * If manifest doesn't exist, creates it first.
 * If component already exists, updates its metadata.
 *
 * @param cwd - Project directory
 * @param componentName - Component name (e.g., "button")
 * @param version - Component version (e.g., "1.0.0")
 * @param contentHash - SHA-256 hash of component files
 * @param files - Array of installed file paths relative to cwd
 */
export async function addComponentToManifest(
  cwd: string,
  componentName: string,
  version: string,
  contentHash: string,
  files: string[]
): Promise<void> {
  let manifest = await readManifest(cwd)

  // Create manifest if it doesn't exist
  // Note: CLI_VERSION will be injected at build time
  if (!manifest) {
    manifest = await initializeManifest(cwd, '0.1.0') // TODO: Use actual CLI version
  }

  manifest.components[componentName] = {
    version,
    contentHash,
    installedAt: new Date().toISOString(),
    customized: false,
    files,
  }

  await writeManifest(cwd, manifest)
}

/**
 * Remove component entry from manifest
 *
 * Does nothing if manifest doesn't exist or component isn't in manifest.
 *
 * @param cwd - Project directory
 * @param componentName - Component name to remove
 */
export async function removeComponentFromManifest(
  cwd: string,
  componentName: string
): Promise<void> {
  const manifest = await readManifest(cwd)
  if (!manifest) return

  delete manifest.components[componentName]
  await writeManifest(cwd, manifest)
}

/**
 * Update customized flag for a component
 *
 * Used to mark when a component's hash differs from manifest.
 *
 * @param cwd - Project directory
 * @param componentName - Component name
 * @param customized - Whether component has been customized
 */
export async function updateComponentCustomizedFlag(
  cwd: string,
  componentName: string,
  customized: boolean
): Promise<void> {
  const manifest = await readManifest(cwd)
  if (!manifest || !manifest.components[componentName]) return

  manifest.components[componentName].customized = customized
  await writeManifest(cwd, manifest)
}
