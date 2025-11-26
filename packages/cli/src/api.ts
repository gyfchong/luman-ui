import path from 'path'
import type { Config, RegistryItem } from './types'
import {
  getConfig,
  writeConfig,
  configExists,
  resolveConfigPaths,
} from './utils/config'
import {
  listComponents as listComponentsFromRegistry,
  getComponentDetails as getComponentDetailsFromRegistry,
  resolveRegistryDependencies,
} from './utils/registry'
import {
  writeFile,
  deleteFile,
  fileExists,
  resolveComponentPath,
} from './utils/fs'
import { addDependencies, addDevDependencies } from './utils/packages'
import { detectProjectInfo } from './utils/detect'

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
export async function getComponentDetails(
  name: string
): Promise<ComponentDetailsResult | null> {
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
      'No configuration found. Please run initialization first or create a components.json file.'
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

      const targetPath = resolveComponentPath(
        resolvedConfig,
        file.type,
        file.path
      )

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
    throw new Error('No configuration found')
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
    const targetPath = resolveComponentPath(
      resolvedConfig,
      file.type,
      file.path
    )

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
    throw new Error('No configuration found')
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
    const regex = new RegExp(`${varName}:\\s*[^;]+;`, 'g')

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

export interface Template {
  name: string
  type: 'feature' | 'page' | 'component'
  description?: string
  components: string[]
}

export interface ScaffoldFeatureResult {
  success: boolean
  files: string[]
  components: string[]
}

export interface ScaffoldPageResult {
  success: boolean
  file: string
  components: string[]
}

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
 * Get list of available templates
 */
export async function getTemplates(): Promise<Template[]> {
  return [
    {
      name: 'crud-feature',
      type: 'feature',
      description: 'CRUD feature with list, create, edit pages',
      components: ['button', 'form', 'table', 'dialog', 'input'],
    },
    {
      name: 'auth-feature',
      type: 'feature',
      description: 'Authentication with login, signup, password reset',
      components: ['button', 'form', 'input', 'card'],
    },
    {
      name: 'dashboard-page',
      type: 'page',
      description: 'Dashboard page with charts and metrics',
      components: ['card', 'chart', 'stat-card'],
    },
  ]
}

/**
 * Scaffold a complete feature
 */
export async function scaffoldFeature(
  name: string,
  templateName: string,
  options?: { cwd?: string; installComponents?: boolean }
): Promise<ScaffoldFeatureResult> {
  const templates = await getTemplates()
  const template = templates.find((t) => t.name === templateName)

  if (!template) {
    throw new Error(`Template "${templateName}" not found`)
  }

  const cwd = options?.cwd || process.cwd()
  const files: string[] = []

  // In a full implementation, this would generate files based on the template
  // For now, this is a placeholder that demonstrates the API structure

  return {
    success: true,
    files,
    components: template.components,
  }
}

/**
 * Scaffold a page
 */
export async function scaffoldPage(
  name: string,
  path: string,
  components: string[],
  options?: { layout?: string; cwd?: string; installComponents?: boolean }
): Promise<ScaffoldPageResult> {
  const cwd = options?.cwd || process.cwd()

  // In a full implementation, this would generate the page file
  // For now, this is a placeholder

  return {
    success: true,
    file: `${cwd}/pages/${name}.tsx`,
    components,
  }
}

/**
 * Preview a composition
 */
export async function previewComposition(
  componentNames: string[],
  options?: { cwd?: string }
): Promise<CompositionPreview> {
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
 * Analyze project
 */
export async function analyzeProject(cwd?: string): Promise<ProjectAnalysis> {
  const projectInfo = await detectProjectInfo(cwd)
  const hasConfig = await configExists(cwd)

  return {
    framework: projectInfo.framework || 'unknown',
    packageManager: projectInfo.packageManager || 'npm',
    hasConfig,
  }
}

// Re-export utility functions
export { getConfig, writeConfig, configExists, detectProjectInfo }

async function readFile(filePath: string): Promise<string> {
  const fs = await import('fs-extra')
  return fs.readFile(filePath, 'utf-8')
}
