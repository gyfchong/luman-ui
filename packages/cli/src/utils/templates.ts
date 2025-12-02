import type { FeatureScaffold, PageScaffold, Template, TemplateNode } from "../types/index.js"

/**
 * Built-in templates for common patterns
 */
export const templates: Record<string, Template> = {
  "crud-feature": {
    name: "crud-feature",
    type: "feature",
    description: "CRUD feature with list, create, edit, and delete pages",
    structure: [
      {
        type: "directory",
        path: "features/{{name}}",
      },
      {
        type: "file",
        path: "features/{{name}}/list.tsx",
        template: "crud-list",
      },
      {
        type: "file",
        path: "features/{{name}}/create.tsx",
        template: "crud-create",
      },
      {
        type: "file",
        path: "features/{{name}}/edit.tsx",
        template: "crud-edit",
      },
      {
        type: "file",
        path: "features/{{name}}/types.ts",
        template: "crud-types",
      },
    ],
    registryDependencies: ["button", "form", "table", "dialog", "input"],
  },
  "dashboard-page": {
    name: "dashboard-page",
    type: "page",
    description: "Dashboard page with charts and metrics",
    structure: [
      {
        type: "file",
        path: "pages/dashboard.tsx",
        template: "dashboard",
      },
    ],
    registryDependencies: ["card", "chart", "stat-card"],
  },
  "auth-feature": {
    name: "auth-feature",
    type: "feature",
    description: "Authentication feature with login, signup, and password reset",
    structure: [
      {
        type: "directory",
        path: "features/auth",
      },
      {
        type: "file",
        path: "features/auth/login.tsx",
        template: "auth-login",
      },
      {
        type: "file",
        path: "features/auth/signup.tsx",
        template: "auth-signup",
      },
      {
        type: "file",
        path: "features/auth/reset-password.tsx",
        template: "auth-reset",
      },
    ],
    registryDependencies: ["button", "form", "input", "card"],
  },
}

/**
 * Get template by name
 */
export function getTemplate(name: string): Template | null {
  return templates[name] || null
}

/**
 * List all available templates
 */
export function listTemplates(): Template[] {
  return Object.values(templates)
}

/**
 * Render template with variables
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g")
    result = result.replace(regex, value)
  }

  return result
}

/**
 * Generate file structure from template
 */
export function generateFromTemplate(
  template: Template,
  variables: Record<string, string>
): TemplateNode[] {
  return template.structure.map((node) => ({
    ...node,
    path: renderTemplate(node.path, variables),
    content: node.content ? renderTemplate(node.content, variables) : undefined,
  }))
}

/**
 * Create feature scaffold configuration
 */
export function createFeatureScaffold(
  name: string,
  templateName: string,
  options: Partial<FeatureScaffold> = {}
): FeatureScaffold {
  const template = getTemplate(templateName)

  return {
    name,
    description: options.description || template?.description,
    components: options.components || template?.registryDependencies || [],
    pages: options.pages || [],
    hooks: options.hooks || [],
    utils: options.utils || [],
  }
}

/**
 * Create page scaffold configuration
 */
export function createPageScaffold(
  name: string,
  path: string,
  components: string[],
  layout?: string
): PageScaffold {
  return {
    name,
    path,
    components,
    layout,
  }
}
