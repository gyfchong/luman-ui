import type { RegistryItem } from './types'
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

export interface CodeExample {
  language: string
  code: string
}

export interface PatternPrinciple {
  title: string
  description: string
  codeExamples: CodeExample[]
}

export interface Pattern {
  name: string
  category: 'accessibility' | 'composition'
  relatedComponents: string[]
  overview: string
  principles: PatternPrinciple[]
  completeExample?: CodeExample
  testingChecklist: string[]
  wcagCompliance: string[]
}

export interface GetPatternResult {
  pattern: Pattern
}

/**
 * Preview a composition without installing
 * Shows what components, files, and dependencies will be added
 */
export async function previewComposition(
  componentNames: string[]
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
 * Analyze project to detect framework and package manager
 * Used during initialization
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

/**
 * Parse markdown pattern into structured data
 */
function parsePattern(content: string, patternName: string, category: 'accessibility' | 'composition'): Pattern {
  // Extract components from frontmatter-like syntax
  const relatedComponents: string[] = []
  const componentMatches = content.match(/components?:\s*\[(.*?)\]/i)
  if (componentMatches && componentMatches[1]) {
    relatedComponents.push(
      ...componentMatches[1].split(',').map(c => c.trim().replace(/['"]/g, ''))
    )
  }

  // Extract overview (text between ## Overview and next ##)
  const overviewMatch = content.match(/## Overview\s+(.*?)(?=\n##|\n```|$)/s)
  const overview = overviewMatch?.[1]?.trim() || ''

  // Extract principles (### sections under ## Core Principles)
  const principles: PatternPrinciple[] = []
  const principlesSection = content.match(/## Core Principles(.*?)(?=\n## (?!.*###)|$)/s)

  if (principlesSection?.[1]) {
    const principleMatches = principlesSection[1].matchAll(/### (\d+\.\s+.*?)\n(.*?)(?=\n###|\n##|$)/gs)

    for (const match of principleMatches) {
      const title = match[1]?.trim()
      const body = match[2]

      if (!title || !body) continue

      // Extract description (non-code text)
      const description = body
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\n\n+/g, '\n') // Collapse multiple newlines
        .trim()

      // Extract code examples
      const codeExamples: CodeExample[] = []
      const codeMatches = body.matchAll(/```(\w+)?\n([\s\S]*?)```/g)

      for (const codeMatch of codeMatches) {
        const code = codeMatch[2]?.trim()
        if (code) {
          codeExamples.push({
            language: codeMatch[1] || 'typescript',
            code
          })
        }
      }

      principles.push({ title, description, codeExamples })
    }
  }

  // Extract complete example (## Complete ... Example section)
  let completeExample: CodeExample | undefined
  const exampleMatch = content.match(/## Complete.*Example\s+```(\w+)?\n([\s\S]*?)```/)
  if (exampleMatch?.[2]) {
    completeExample = {
      language: exampleMatch[1] || 'typescript',
      code: exampleMatch[2].trim()
    }
  }

  // Extract testing checklist
  const testingChecklist: string[] = []
  const checklistMatch = content.match(/## Testing Checklist\s+([\s\S]*?)(?=\n##|$)/)
  if (checklistMatch?.[1]) {
    const items = checklistMatch[1].match(/- \[.\] (.*)/g)
    if (items) {
      testingChecklist.push(...items.map(item => item.replace(/- \[.\] /, '').trim()))
    }
  }

  // Extract WCAG compliance
  const wcagCompliance: string[] = []
  const wcagMatch = content.match(/## WCAG.*\s+([\s\S]*?)(?=\n##|$)/)
  if (wcagMatch?.[1]) {
    const items = wcagMatch[1].match(/- \*\*([\d.]+.*?)\*\*/g)
    if (items) {
      wcagCompliance.push(...items.map(item => item.replace(/- \*\*|\*\*/g, '').trim()))
    }
  }

  return {
    name: patternName,
    category,
    relatedComponents,
    overview,
    principles,
    completeExample,
    testingChecklist,
    wcagCompliance,
  }
}

/**
 * Get pattern documentation for LLM guidance
 * Returns our recommended patterns for accessibility and composition as structured data
 */
export async function getPattern(
  patternName: string
): Promise<GetPatternResult> {
  const fs = await import('fs-extra')
  const { fileURLToPath } = await import('url')
  const { dirname, join } = await import('path')

  // Get the package root directory
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const packageRoot = join(__dirname, '..')
  const patternsDir = join(packageRoot, 'patterns')

  // Map pattern name to file path
  const patternPaths: Record<string, { file: string; category: 'accessibility' | 'composition' }> = {
    'form-accessibility': { file: 'accessibility/form-accessibility.md', category: 'accessibility' },
    'form-composition': { file: 'composition/form-composition.md', category: 'composition' },
  }

  const patternInfo = patternPaths[patternName]
  if (!patternInfo) {
    throw new Error(`Pattern "${patternName}" not found. Available patterns: ${Object.keys(patternPaths).join(', ')}`)
  }

  const patternPath = join(patternsDir, patternInfo.file)
  const exists = await fs.pathExists(patternPath)

  if (!exists) {
    throw new Error(`Pattern file not found: ${patternPath}`)
  }

  const content = await fs.readFile(patternPath, 'utf-8')
  const pattern = parsePattern(content, patternName, patternInfo.category)

  return { pattern }
}

// Re-export utility functions
export { getConfig, writeConfig, configExists, detectProjectInfo }

/**
 * Phase 4: Backend Communication APIs
 */
export {
  saveAuth,
  loadAuth,
  removeAuth,
  isAuthenticated,
  getAuthToken,
  getApiUrl,
  type AuthConfig,
} from './utils/auth.js'

export {
  apiRequest,
  loginApi,
  logoutApi,
  getCurrentUser,
  checkBackendHealth,
  type ApiError,
  type ApiResponse,
} from './utils/api.js'

async function readFile(filePath: string): Promise<string> {
  const fs = await import('fs-extra')
  return fs.readFile(filePath, 'utf-8')
}
