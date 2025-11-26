/**
 * Programmatic API for the luman-ui CLI
 * This module exports all CLI functionality for use in scripts and the MCP server
 */

import { readConfig, writeConfig, configExists, getDefaultConfig } from './utils/config.js';
import { analyzeProject, detectFramework, detectPackageManager } from './utils/project.js';
import {
  fetchComponent,
  listComponents,
  resolveComponentDependencies,
  fetchComponentSource,
} from './utils/registry.js';
import {
  getTemplate,
  listTemplates,
  generateFromTemplate,
  createFeatureScaffold,
  createPageScaffold,
} from './utils/templates.js';
import { resolveComponentPath, writeFileSafe } from './utils/fs.js';
import { installDependencies, uninstallDependencies } from './utils/install.js';
import type {
  Config,
  Component,
  ProjectAnalysis,
  Template,
  FeatureScaffold,
  PageScaffold,
  CompositionPreview,
  ApiResponse,
} from './types/index.js';

/**
 * List all available components from the registry
 */
export async function list(options?: {
  registry?: string;
  category?: string;
  tag?: string;
}): Promise<ApiResponse<Component[]>> {
  try {
    const config = await readConfig();
    const registry = options?.registry || config?.registry || 'https://ui.luman.dev/registry';

    let components = await listComponents(registry);

    // Apply filters
    if (options?.category) {
      components = components.filter(c => c.category === options.category);
    }

    if (options?.tag) {
      const tag = options.tag;
      components = components.filter(c => c.tags?.includes(tag));
    }

    return {
      success: true,
      data: components,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list components',
    };
  }
}

/**
 * Get details for a specific component
 */
export async function getComponentDetails(
  name: string,
  options?: { registry?: string }
): Promise<ApiResponse<Component>> {
  try {
    const config = await readConfig();
    const registry = options?.registry || config?.registry || 'https://ui.luman.dev/registry';

    const component = await fetchComponent(name, registry);

    if (!component) {
      return {
        success: false,
        error: `Component "${name}" not found`,
      };
    }

    return {
      success: true,
      data: component,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get component details',
    };
  }
}

/**
 * Add one or more components to the project
 */
export async function addComponent(
  componentNames: string[],
  options?: {
    overwrite?: boolean;
    cwd?: string;
  }
): Promise<ApiResponse<{ installed: string[]; dependencies: string[] }>> {
  try {
    const config = await readConfig(options?.cwd);

    if (!config) {
      return {
        success: false,
        error: 'components.json not found. Initialize project first.',
      };
    }

    // Resolve all dependencies
    const allComponents = [];
    for (const name of componentNames) {
      const resolved = await resolveComponentDependencies(name, config.registry);
      allComponents.push(...resolved);
    }

    // Remove duplicates
    const uniqueComponents = Array.from(
      new Map(allComponents.map(c => [c.name, c])).values()
    );

    // Collect npm dependencies
    const npmDeps = new Set<string>();
    for (const component of uniqueComponents) {
      component.dependencies?.forEach(dep => npmDeps.add(dep));
    }

    // Install each component
    for (const component of uniqueComponents) {
      const sources = await fetchComponentSource(component, config.registry);

      for (const file of component.files) {
        const content = sources.get(file.path);
        if (!content) continue;

        const targetPath = resolveComponentPath(component, file, config, options?.cwd);
        await writeFileSafe(targetPath, content);
      }
    }

    // Install npm dependencies
    if (npmDeps.size > 0) {
      await installDependencies(Array.from(npmDeps), options?.cwd);
    }

    return {
      success: true,
      data: {
        installed: uniqueComponents.map(c => c.name),
        dependencies: Array.from(npmDeps),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add components',
    };
  }
}

/**
 * Scaffold a complete feature
 */
export async function scaffoldFeature(
  name: string,
  templateName: string,
  options?: {
    cwd?: string;
    installComponents?: boolean;
  }
): Promise<ApiResponse<{ files: string[]; components: string[] }>> {
  try {
    const config = await readConfig(options?.cwd);

    if (!config) {
      return {
        success: false,
        error: 'components.json not found. Initialize project first.',
      };
    }

    const template = getTemplate(templateName);

    if (!template) {
      return {
        success: false,
        error: `Template "${templateName}" not found`,
      };
    }

    // Create feature scaffold
    const scaffold = createFeatureScaffold(name, templateName);

    // Generate file structure
    const fileNodes = generateFromTemplate(template, { name });

    const createdFiles: string[] = [];

    // Create files
    const { resolve } = await import('pathe');
    for (const node of fileNodes) {
      if (node.type === 'file' && node.content) {
        const fullPath = resolve(options?.cwd || process.cwd(), node.path);
        await writeFileSafe(fullPath, node.content);
        createdFiles.push(fullPath);
      }
    }

    // Optionally install components
    if (options?.installComponents && scaffold.components.length > 0) {
      await addComponent(scaffold.components, { cwd: options.cwd });
    }

    return {
      success: true,
      data: {
        files: createdFiles,
        components: scaffold.components,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scaffold feature',
    };
  }
}

/**
 * Scaffold a page
 */
export async function scaffoldPage(
  name: string,
  path: string,
  components: string[],
  options?: {
    layout?: string;
    cwd?: string;
    installComponents?: boolean;
  }
): Promise<ApiResponse<{ file: string; components: string[] }>> {
  try {
    const config = await readConfig(options?.cwd);

    if (!config) {
      return {
        success: false,
        error: 'components.json not found. Initialize project first.',
      };
    }

    // Create page scaffold
    const scaffold = createPageScaffold(name, path, components, options?.layout);

    // Generate page content
    const content = generatePageContent(scaffold);

    // Determine file path
    const { resolve } = await import('pathe');
    const framework = config.aliases.components.includes('app') ? 'next-app' : 'next-pages';
    const fileExtension = config.tsx ? 'tsx' : 'jsx';

    let filePath: string;
    if (framework === 'next-app') {
      filePath = resolve(options?.cwd || process.cwd(), 'app', path.slice(1), `page.${fileExtension}`);
    } else {
      filePath = resolve(options?.cwd || process.cwd(), 'pages', `${name}.${fileExtension}`);
    }

    await writeFileSafe(filePath, content);

    // Optionally install components
    if (options?.installComponents && components.length > 0) {
      await addComponent(components, { cwd: options.cwd });
    }

    return {
      success: true,
      data: {
        file: filePath,
        components,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scaffold page',
    };
  }
}

/**
 * Preview a composition without installing
 */
export async function previewComposition(
  componentNames: string[],
  options?: { registry?: string; cwd?: string }
): Promise<ApiResponse<CompositionPreview>> {
  try {
    const config = await readConfig(options?.cwd);
    const registry = options?.registry || config?.registry || 'https://ui.luman.dev/registry';

    // Resolve all dependencies
    const allComponents = [];
    for (const name of componentNames) {
      const resolved = await resolveComponentDependencies(name, registry);
      allComponents.push(...resolved);
    }

    // Remove duplicates
    const uniqueComponents = Array.from(
      new Map(allComponents.map(c => [c.name, c])).values()
    );

    // Build preview
    const preview: CompositionPreview = {
      files: [],
      dependencies: [],
      registryDependencies: [],
      structure: '',
    };

    const npmDeps = new Set<string>();
    const registryDeps = new Set<string>();

    for (const component of uniqueComponents) {
      component.dependencies?.forEach(dep => npmDeps.add(dep));
      component.registryDependencies?.forEach(dep => registryDeps.add(dep));

      if (config) {
        for (const file of component.files) {
          const targetPath = resolveComponentPath(component, file, config, options?.cwd);
          const sources = await fetchComponentSource(component, registry);
          const content = sources.get(file.path) || '';

          preview.files.push({
            path: targetPath,
            content,
            action: 'create',
          });
        }
      }
    }

    preview.dependencies = Array.from(npmDeps);
    preview.registryDependencies = Array.from(registryDeps);

    return {
      success: true,
      data: preview,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to preview composition',
    };
  }
}

/**
 * Update a component
 */
export async function updateComponent(
  componentNames: string[],
  options?: {
    backup?: boolean;
    cwd?: string;
  }
): Promise<ApiResponse<{ updated: string[] }>> {
  try {
    const config = await readConfig(options?.cwd);

    if (!config) {
      return {
        success: false,
        error: 'components.json not found. Initialize project first.',
      };
    }

    const updated: string[] = [];

    for (const name of componentNames) {
      const component = await fetchComponent(name, config.registry);
      if (!component) continue;

      const sources = await fetchComponentSource(component, config.registry);

      for (const file of component.files) {
        const content = sources.get(file.path);
        if (!content) continue;

        const targetPath = resolveComponentPath(component, file, config, options?.cwd);

        // Create backup if requested
        if (options?.backup) {
          const { backupFile } = await import('./utils/fs.js');
          await backupFile(targetPath);
        }

        await writeFileSafe(targetPath, content);
      }

      updated.push(name);
    }

    return {
      success: true,
      data: { updated },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update components',
    };
  }
}

/**
 * Analyze project
 */
export async function analyze(
  cwd?: string
): Promise<ApiResponse<ProjectAnalysis>> {
  try {
    const analysis = await analyzeProject(cwd);

    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze project',
    };
  }
}

/**
 * Get list of available templates
 */
export async function getTemplates(): Promise<ApiResponse<Template[]>> {
  try {
    const templates = listTemplates();

    return {
      success: true,
      data: templates,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get templates',
    };
  }
}

// Helper function for page content generation
function generatePageContent(scaffold: PageScaffold): string {
  const pascalCase = scaffold.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const imports = scaffold.components
    .map(c => {
      const componentName = c
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      return `import { ${componentName} } from '@/components/ui/${c}';`;
    })
    .join('\n');

  return `${imports}

export default function ${pascalCase}Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">${pascalCase}</h1>
      {/* Add your page content here */}
    </div>
  );
}
`;
}

// Export types for consumers
export type {
  Config,
  Component,
  ProjectAnalysis,
  Template,
  FeatureScaffold,
  PageScaffold,
  CompositionPreview,
  ApiResponse,
};
