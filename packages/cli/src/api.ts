import type { RegistryItem } from "./types.ts"
import { configExists, getConfig, resolveConfigPaths, writeConfig } from "./utils/config.ts"
import { detectProjectInfo, detectTailwindCSS, detectTailwindVersion } from "./utils/detect.ts"
import { deleteFile, fileExists, resolveComponentPath, writeFile } from "./utils/fs.ts"
import { addDependencies, addDevDependencies } from "./utils/packages.ts"
import {
  getComponentDetails as getComponentDetailsFromRegistry,
  listComponents as listComponentsFromRegistry,
  resolveRegistryDependencies,
} from "./utils/registry.ts"

export interface ListComponentsResult {
  components: string[]
}

export interface ComponentDetailsResult {
  component: RegistryItem
  dependencies: RegistryItem[]
}

export interface AddComponentResult {
  success: boolean
  installed: string[]
  filesWritten: string[]
}

export interface RemoveComponentResult {
  success: boolean
  removed: string[]
  filesDeleted: string[]
}

export interface UpdateTokensResult {
  success: boolean
  tokensUpdated: number
}

/**
 * List all available components from the registry
 */
export async function listComponents(): Promise<ListComponentsResult> {
  const components = await listComponentsFromRegistry()
  return { components }
}

/**
 * Get detailed information about a specific component
 */
export async function getComponentDetails(name: string): Promise<ComponentDetailsResult | null> {
  const component = await getComponentDetailsFromRegistry(name)

  if (!component) {
    return null
  }

  const dependencies = await resolveRegistryDependencies(component)

  return {
    component,
    dependencies,
  }
}

/**
 * Add a component to the user's project
 */
export async function addComponent(
  name: string,
  cwd: string = process.cwd()
): Promise<AddComponentResult> {
  const config = await getConfig(cwd)

  if (!config) {
    throw new Error(
      "No configuration found. Please run initialization first or create a components.json file."
    )
  }

  // Check if Tailwind CSS is installed
  const hasTailwind = await detectTailwindCSS(cwd)
  if (!hasTailwind) {
    throw new Error(
      "Tailwind CSS is required but not found in your project.\n\n" +
        "Please install Tailwind CSS first by following the official guide:\n" +
        "https://tailwindcss.com/docs/installation"
    )
  }

  const resolvedConfig = await resolveConfigPaths(cwd, config)

  // Get component details
  const details = await getComponentDetails(name)

  if (!details) {
    throw new Error(`Component "${name}" not found in registry`)
  }

  const { component, dependencies } = details

  // Collect all items to install (component + dependencies)
  const allItems = [component, ...dependencies]

  const filesWritten: string[] = []
  const installed: string[] = []
  const npmDeps: string[] = []
  const npmDevDeps: string[] = []

  // Install all components
  for (const item of allItems) {
    installed.push(item.name)

    // Write files
    for (const file of item.files) {
      if (!file.content) {
        continue
      }

      const targetPath = resolveComponentPath(resolvedConfig, file.type, file.path)

      await writeFile(targetPath, file.content)
      filesWritten.push(targetPath)
    }

    // Collect dependencies
    if (item.dependencies) {
      npmDeps.push(...item.dependencies)
    }
    if (item.devDependencies) {
      npmDevDeps.push(...item.devDependencies)
    }
  }

  // Install npm dependencies
  if (npmDeps.length > 0) {
    await addDependencies([...new Set(npmDeps)], cwd)
  }
  if (npmDevDeps.length > 0) {
    await addDevDependencies([...new Set(npmDevDeps)], cwd)
  }

  return {
    success: true,
    installed,
    filesWritten,
  }
}

/**
 * Remove a component from the user's project
 */
export async function removeComponent(
  name: string,
  cwd: string = process.cwd()
): Promise<RemoveComponentResult> {
  const config = await getConfig(cwd)

  if (!config) {
    throw new Error("No configuration found")
  }

  const resolvedConfig = await resolveConfigPaths(cwd, config)

  // Get component details
  const details = await getComponentDetails(name)

  if (!details) {
    throw new Error(`Component "${name}" not found in registry`)
  }

  const { component } = details
  const filesDeleted: string[] = []

  // Delete files
  for (const file of component.files) {
    const targetPath = resolveComponentPath(resolvedConfig, file.type, file.path)

    if (await fileExists(targetPath)) {
      await deleteFile(targetPath)
      filesDeleted.push(targetPath)
    }
  }

  return {
    success: true,
    removed: [name],
    filesDeleted,
  }
}

/**
 * Update design tokens in the user's project
 */
export async function updateTokens(
  tokens: Record<string, string>,
  cwd: string = process.cwd()
): Promise<UpdateTokensResult> {
  const config = await getConfig(cwd)

  if (!config) {
    throw new Error("No configuration found")
  }

  const resolvedConfig = await resolveConfigPaths(cwd, config)
  const cssPath = resolvedConfig.tailwind.css

  if (!(await fileExists(cssPath))) {
    throw new Error(`CSS file not found at ${cssPath}`)
  }

  let cssContent = await readFile(cssPath)
  let tokensUpdated = 0

  // Update CSS variables
  for (const [key, value] of Object.entries(tokens)) {
    const varName = `--${key}`
    const regex = new RegExp(`${varName}:\\s*[^;]+;`, "g")

    if (regex.test(cssContent)) {
      cssContent = cssContent.replace(regex, `${varName}: ${value};`)
      tokensUpdated++
    }
  }

  await writeFile(cssPath, cssContent)

  return {
    success: true,
    tokensUpdated,
  }
}

/**
 * Phase 2: Composition & Generation APIs
 */

export interface CompositionPreview {
  components: string[]
  files: Array<{ path: string; type: string }>
  dependencies: string[]
}

export interface ProjectAnalysis {
  framework: string
  packageManager: string
  hasConfig: boolean
}


/**
 * Preview a composition without installing
 * Shows what components, files, and dependencies will be added
 */
export async function previewComposition(componentNames: string[]): Promise<CompositionPreview> {
  const components = componentNames
  const files: Array<{ path: string; type: string }> = []
  const dependencies: string[] = []

  // Get details for each component
  for (const name of componentNames) {
    const details = await getComponentDetails(name)
    if (details) {
      files.push(...details.component.files.map((f) => ({ path: f.path, type: f.type })))
      if (details.component.dependencies) {
        dependencies.push(...details.component.dependencies)
      }
    }
  }

  return {
    components,
    files,
    dependencies: [...new Set(dependencies)],
  }
}

/**
 * Analyze project to detect framework and package manager
 * Used during initialization
 */
export async function analyzeProject(cwd?: string): Promise<ProjectAnalysis> {
  const projectInfo = await detectProjectInfo(cwd)
  const hasConfig = await configExists(cwd)

  return {
    framework: projectInfo.framework || "unknown",
    packageManager: projectInfo.packageManager || "npm",
    hasConfig,
  }
}



// Re-export utility functions
export { getConfig, writeConfig, configExists, detectProjectInfo, detectTailwindVersion }

async function readFile(filePath: string): Promise<string> {
  const fs = await import("fs-extra")
  return fs.readFile(filePath, "utf-8")
}
