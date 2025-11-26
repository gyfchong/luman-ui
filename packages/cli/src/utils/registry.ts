import type { Component } from '../types/index.js';

const DEFAULT_REGISTRY = 'https://ui.luman.dev/registry';

/**
 * Fetch component metadata from registry
 */
export async function fetchComponent(name: string, registry: string = DEFAULT_REGISTRY): Promise<Component | null> {
  try {
    const url = `${registry}/components/${name}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json() as Component;
  } catch (error) {
    console.error(`Failed to fetch component ${name}:`, error);
    return null;
  }
}

/**
 * List all available components from registry
 */
export async function listComponents(registry: string = DEFAULT_REGISTRY): Promise<Component[]> {
  try {
    const url = `${registry}/index.json`;
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data = await response.json() as { components: Component[] };
    return data.components;
  } catch (error) {
    console.error('Failed to list components:', error);
    return [];
  }
}

/**
 * Fetch component source code
 */
export async function fetchComponentSource(component: Component, registry: string = DEFAULT_REGISTRY): Promise<Map<string, string>> {
  const sources = new Map<string, string>();

  for (const file of component.files) {
    try {
      const url = `${registry}/components/${component.name}/${file.path}`;
      const response = await fetch(url);

      if (response.ok) {
        const content = await response.text();
        sources.set(file.path, content);
      }
    } catch (error) {
      console.error(`Failed to fetch ${file.path}:`, error);
    }
  }

  return sources;
}

/**
 * Resolve component dependencies (including registry dependencies)
 */
export async function resolveComponentDependencies(
  componentName: string,
  registry: string = DEFAULT_REGISTRY
): Promise<Component[]> {
  const resolved: Component[] = [];
  const visited = new Set<string>();

  async function resolve(name: string): Promise<void> {
    if (visited.has(name)) return;
    visited.add(name);

    const component = await fetchComponent(name, registry);
    if (!component) return;

    resolved.push(component);

    // Recursively resolve registry dependencies
    if (component.registryDependencies) {
      for (const dep of component.registryDependencies) {
        await resolve(dep);
      }
    }
  }

  await resolve(componentName);
  return resolved;
}
