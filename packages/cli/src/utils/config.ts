import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'pathe';
import type { Config } from '../types/index.js';

const CONFIG_FILE = 'components.json';

/**
 * Get the path to components.json
 */
export function getConfigPath(cwd: string = process.cwd()): string {
  return resolve(cwd, CONFIG_FILE);
}

/**
 * Check if components.json exists
 */
export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(getConfigPath(cwd));
}

/**
 * Read components.json configuration
 */
export async function readConfig(cwd: string = process.cwd()): Promise<Config | null> {
  const configPath = getConfigPath(cwd);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    return JSON.parse(content) as Config;
  } catch (error) {
    console.error('Failed to read config:', error);
    return null;
  }
}

/**
 * Write components.json configuration
 */
export async function writeConfig(config: Config, cwd: string = process.cwd()): Promise<void> {
  const configPath = getConfigPath(cwd);
  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): Config {
  return {
    $schema: 'https://ui.luman.dev/schema.json',
    style: 'default',
    rsc: true,
    tsx: true,
    tailwind: {
      config: 'tailwind.config.ts',
      css: 'app/globals.css',
      baseColor: 'slate',
      cssVariables: true,
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
      lib: '@/lib',
      hooks: '@/hooks',
    },
    registry: 'https://ui.luman.dev/registry',
  };
}
