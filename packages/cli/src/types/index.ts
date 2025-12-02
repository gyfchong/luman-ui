/**
 * Component metadata from registry
 */
export interface Component {
  name: string
  type: "registry:ui" | "registry:block" | "registry:page" | "registry:hook"
  description?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: ComponentFile[]
  category?: string
  tags?: string[]
}

export interface ComponentFile {
  path: string
  type: "registry:component" | "registry:ui" | "registry:lib" | "registry:hook"
  content?: string
  target?: string
}

/**
 * Project configuration (components.json)
 */
export interface Config {
  $schema?: string
  style: string
  rsc: boolean
  tsx: boolean
  tailwind: {
    config?: string
    css: string
    baseColor: string
    cssVariables: boolean
    prefix?: string
  }
  aliases: {
    components: string
    utils: string
    ui?: string
    lib?: string
    hooks?: string
  }
  registry?: string
}

/**
 * Feature scaffold configuration
 */
export interface FeatureScaffold {
  name: string
  description?: string
  components: string[]
  pages?: PageScaffold[]
  routes?: RouteConfig[]
  hooks?: string[]
  utils?: string[]
}

export interface PageScaffold {
  name: string
  path: string
  components: string[]
  layout?: string
}

export interface RouteConfig {
  path: string
  component: string
  children?: RouteConfig[]
}

/**
 * Template configuration
 */
export interface Template {
  name: string
  type: "feature" | "page" | "component"
  description?: string
  structure: TemplateNode[]
  dependencies?: string[]
  registryDependencies?: string[]
}

export interface TemplateNode {
  type: "file" | "directory"
  path: string
  content?: string
  template?: string
}

/**
 * Composition preview
 */
export interface CompositionPreview {
  files: PreviewFile[]
  dependencies: string[]
  registryDependencies: string[]
  structure: string
}

export interface PreviewFile {
  path: string
  content: string
  action: "create" | "update"
}

/**
 * Project analysis results
 */
export interface ProjectAnalysis {
  framework: "next" | "vite" | "remix" | "astro" | "unknown"
  packageManager: "npm" | "pnpm" | "yarn" | "bun"
  hasConfig: boolean
  existingComponents: string[]
  tailwindConfig?: string
  tsconfig?: string
}

/**
 * CLI API responses
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  warnings?: string[]
}
