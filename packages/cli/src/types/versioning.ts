import { z } from 'zod'
import type { RegistryItem } from '../types.js'

// Component version metadata in registry
export const ComponentVersionSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // Semver
  contentHash: z.string().length(64), // SHA-256 hex
  publishedAt: z.string().datetime(),
  changelog: z
    .array(
      z.object({
        version: z.string(),
        date: z.string(),
        changes: z.array(z.string()),
      })
    )
    .optional(),
  deprecated: z.boolean().optional(),
  breaking: z.boolean().optional(),
})

export type ComponentVersion = z.infer<typeof ComponentVersionSchema>

// Extended registry item with versioning
export interface VersionedRegistryItem extends RegistryItem {
  version: string
  contentHash: string
  publishedAt: string
  changelog?: Array<{
    version: string
    date: string
    changes: string[]
  }>
}

// Local manifest schema
export const ManifestSchema = z.object({
  schemaVersion: z.literal(1),
  installedAt: z.string().datetime(),
  cliVersion: z.string(), // Version of CLI that created manifest
  components: z.record(
    z.object({
      version: z.string(),
      contentHash: z.string(),
      installedAt: z.string().datetime(),
      customized: z.boolean(),
      files: z.array(z.string()), // Installed file paths
    })
  ),
})

export type Manifest = z.infer<typeof ManifestSchema>

// Component status types
export type ComponentStatus =
  | { state: 'unchanged'; version: string }
  | { state: 'customized'; version: string; diff: string }
  | {
      state: 'outdated'
      installedVersion: string
      latestVersion: string
      diff: string
    }
  | { state: 'missing'; expectedFiles: string[] }
  | { state: 'untracked' } // File exists but not in manifest

export interface StatusResult {
  component: string
  status: ComponentStatus
  files: Array<{
    path: string
    status: 'ok' | 'modified' | 'missing' | 'untracked'
  }>
}
