import path from "node:path"
import fs from "fs-extra"
import type { RegistryItem } from "../types"

// Registry mode configuration
type RegistryMode = "local" | "remote" | "auto"
const REGISTRY_MODE = (process.env.LUMAN_REGISTRY_MODE || "auto") as RegistryMode
const REGISTRY_URL = process.env.LUMAN_REGISTRY_URL || "https://registry.luman-ui.com"

// In-memory cache for registry items
const registryCache = new Map<string, RegistryItem>()

/**
 * Detect if we're running in local mode (monorepo development)
 */
function isLocalMode(): boolean {
  if (REGISTRY_MODE === "local") {
    return true
  }
  if (REGISTRY_MODE === "remote") {
    return false
  }
  // Auto-detect: check if we're in the monorepo
  const registryPath = path.resolve(process.cwd(), "../../registry/index.json")
  return fs.pathExistsSync(registryPath)
}

/**
 * Get local registry item (monorepo development)
 */
async function getLocalRegistryItem(name: string): Promise<RegistryItem | null> {
  const itemPath = path.resolve(process.cwd(), `../../registry/items/${name}.json`)

  if (!(await fs.pathExists(itemPath))) {
    return null
  }

  const item = await fs.readJson(itemPath)

  // Load file contents for local registry
  const files = await Promise.all(
    item.files.map(async (file: any) => {
      const filePath = path.resolve(process.cwd(), `../../${file.path}`)
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

/**
 * Get remote registry item (production CDN)
 */
async function getRemoteRegistryItem(name: string): Promise<RegistryItem | null> {
  const response = await fetch(`${REGISTRY_URL}/items/${name}.json`)
  if (!response.ok) {
    return null
  }

  // Content already embedded, no need to read files
  return response.json() as Promise<RegistryItem>
}

export async function getRegistryIndex(): Promise<string[]> {
  if (isLocalMode()) {
    // Read from local monorepo
    const registryPath = path.resolve(process.cwd(), "../../registry/index.json")
    const index = await fs.readJson(registryPath)
    return index.items || []
  }

  // In production, fetch from CDN
  const response = await fetch(`${REGISTRY_URL}/index.json`)
  const data = (await response.json()) as { items?: string[] }
  return data.items || []
}

export async function getRegistryItem(name: string): Promise<RegistryItem | null> {
  // Check cache first
  if (registryCache.has(name)) {
    return registryCache.get(name)!
  }

  // Fetch item based on mode
  const item = isLocalMode()
    ? await getLocalRegistryItem(name)
    : await getRemoteRegistryItem(name)

  // Cache the result
  if (item) {
    registryCache.set(name, item)
  }

  return item
}

export async function listComponents(): Promise<string[]> {
  const index = await getRegistryIndex()
  return index
}

export async function getComponentDetails(name: string): Promise<RegistryItem | null> {
  return getRegistryItem(name)
}

/**
 * Build dependency graph for topological sorting
 */
async function buildDependencyGraph(
  itemName: string,
  visited: Set<string> = new Set(),
  visiting: Set<string> = new Set()
): Promise<Map<string, RegistryItem>> {
  // Circular dependency detection
  if (visiting.has(itemName)) {
    const cycle = Array.from(visiting).concat(itemName).join(" -> ")
    throw new Error(`Circular dependency detected: ${cycle}`)
  }

  if (visited.has(itemName)) {
    return new Map()
  }

  visiting.add(itemName)

  const item = await getRegistryItem(itemName)
  if (!item) {
    visiting.delete(itemName)
    return new Map()
  }

  const graph = new Map<string, RegistryItem>([[itemName, item]])

  // Recursively build graph for dependencies
  if (item.registryDependencies && item.registryDependencies.length > 0) {
    for (const depName of item.registryDependencies) {
      const depGraph = await buildDependencyGraph(depName, visited, visiting)
      for (const [name, depItem] of depGraph) {
        if (!graph.has(name)) {
          graph.set(name, depItem)
        }
      }
    }
  }

  visiting.delete(itemName)
  visited.add(itemName)

  return graph
}

/**
 * Topological sort using Kahn's algorithm
 * Returns dependencies in installation order (dependencies before dependents)
 */
function topologicalSort(graph: Map<string, RegistryItem>): RegistryItem[] {
  // Build adjacency list and in-degree count
  const adjacencyList = new Map<string, Set<string>>()
  const inDegree = new Map<string, number>()

  // Initialize
  for (const [name] of graph) {
    adjacencyList.set(name, new Set())
    inDegree.set(name, 0)
  }

  // Build graph
  for (const [name, item] of graph) {
    if (item.registryDependencies) {
      for (const dep of item.registryDependencies) {
        if (graph.has(dep)) {
          adjacencyList.get(dep)!.add(name)
          inDegree.set(name, (inDegree.get(name) || 0) + 1)
        }
      }
    }
  }

  // Find all nodes with no incoming edges
  const queue: string[] = []
  for (const [name, degree] of inDegree) {
    if (degree === 0) {
      queue.push(name)
    }
  }

  // Process nodes in topological order
  const sorted: RegistryItem[] = []
  while (queue.length > 0) {
    const name = queue.shift()!
    const item = graph.get(name)!
    sorted.push(item)

    // Reduce in-degree for dependent nodes
    for (const dependent of adjacencyList.get(name)!) {
      const newDegree = inDegree.get(dependent)! - 1
      inDegree.set(dependent, newDegree)
      if (newDegree === 0) {
        queue.push(dependent)
      }
    }
  }

  // If sorted length doesn't match graph size, there's a cycle
  // (This should be caught earlier by buildDependencyGraph)
  if (sorted.length !== graph.size) {
    throw new Error("Circular dependency detected during topological sort")
  }

  return sorted
}

export async function resolveRegistryDependencies(item: RegistryItem): Promise<RegistryItem[]> {
  if (!item.registryDependencies || item.registryDependencies.length === 0) {
    return []
  }

  try {
    // Build complete dependency graph with circular dependency detection
    const graph = await buildDependencyGraph(item.name)

    // Remove the item itself from the graph (we only want dependencies)
    graph.delete(item.name)

    if (graph.size === 0) {
      return []
    }

    // Sort dependencies topologically
    const sorted = topologicalSort(graph)

    return sorted
  } catch (error) {
    if (error instanceof Error && error.message.includes("Circular dependency")) {
      throw error
    }
    throw new Error(`Failed to resolve dependencies for ${item.name}: ${error}`)
  }
}
