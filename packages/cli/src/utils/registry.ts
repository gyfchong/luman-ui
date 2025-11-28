import path from "node:path"
import fs from "fs-extra"
import type { RegistryItem } from "../types"

// For now, we'll use the local registry. In production, this would fetch from a CDN
const REGISTRY_URL = process.env.LUMAN_REGISTRY_URL || "local"

export async function getRegistryIndex(): Promise<string[]> {
  if (REGISTRY_URL === "local") {
    // Read from local monorepo
    const registryPath = path.resolve(process.cwd(), "../../packages/ui/src/registry/index.json")
    const index = await fs.readJson(registryPath)
    return index.items || []
  }

  // In production, fetch from CDN
  const response = await fetch(`${REGISTRY_URL}/index.json`)
  const data = (await response.json()) as { items?: string[] }
  return data.items || []
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  if (REGISTRY_URL === "local") {
    // Read from local monorepo
    const itemPath = path.resolve(
      process.cwd(),
      `../../packages/ui/src/registry/items/${name}.json`
    )

    if (!(await fs.pathExists(itemPath))) {
      return null
    }

    const item = await fs.readJson(itemPath)

    // Load file contents for local registry
    const files = await Promise.all(
      item.files.map(async (file: any) => {
        const filePath = path.resolve(process.cwd(), `../../packages/ui/src/${file.path}`)
        const content = await fs.readFile(filePath, "utf-8")
        return {
          ...file,
          content,
        }
      })
    )

    return {
      ...item,
      files,
    }
  }

  // In production, fetch from CDN
  const response = await fetch(`${REGISTRY_URL}/items/${name}.json`)
  if (!response.ok) {
    return null
  }

  return response.json() as Promise<RegistryItem>
}

export async function listComponents(): Promise<string[]> {
  const index = await getRegistryIndex()
  return index
}

export async function getComponentDetails(name: string): Promise<RegistryItem | null> {
  return getRegistryItem(name)
}

export async function resolveRegistryDependencies(item: RegistryItem): Promise<RegistryItem[]> {
  const dependencies: RegistryItem[] = []

  if (!item.registryDependencies || item.registryDependencies.length === 0) {
    return dependencies
  }

  for (const depName of item.registryDependencies) {
    const dep = await getRegistryItem(depName)
    if (dep) {
      dependencies.push(dep)
      // Recursively resolve dependencies
      const nestedDeps = await resolveRegistryDependencies(dep)
      dependencies.push(...nestedDeps)
    }
  }

  // Remove duplicates
  const seen = new Set<string>()
  return dependencies.filter((dep) => {
    if (seen.has(dep.name)) {
      return false
    }
    seen.add(dep.name)
    return true
  })
}
