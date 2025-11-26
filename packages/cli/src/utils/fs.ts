import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'pathe';
import type { Config, Component } from '../types/index.js';

/**
 * Ensure directory exists
 */
export async function ensureDir(path: string): Promise<void> {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

/**
 * Write file and ensure directory exists
 */
export async function writeFileSafe(path: string, content: string): Promise<void> {
  await ensureDir(dirname(path));
  await writeFile(path, content, 'utf-8');
}

/**
 * Resolve component path based on config
 */
export function resolveComponentPath(
  component: Component,
  file: { path: string; type: string },
  config: Config,
  cwd: string = process.cwd()
): string {
  // Determine base path based on file type
  let basePath: string;

  switch (file.type) {
    case 'registry:component':
    case 'registry:ui':
      basePath = config.aliases.ui || config.aliases.components;
      break;
    case 'registry:lib':
      basePath = config.aliases.lib || config.aliases.utils;
      break;
    case 'registry:hook':
      basePath = config.aliases.hooks || config.aliases.lib || config.aliases.utils;
      break;
    default:
      basePath = config.aliases.components;
  }

  // Remove alias prefix (e.g., '@/components' -> 'components')
  const cleanBase = basePath.replace(/^@\//, '');

  // Construct full path
  return resolve(cwd, cleanBase, file.path);
}

/**
 * Check if file exists and read its content
 */
export async function readFileIfExists(path: string): Promise<string | null> {
  if (!existsSync(path)) {
    return null;
  }

  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Create backup of existing file
 */
export async function backupFile(path: string): Promise<void> {
  const content = await readFileIfExists(path);

  if (content) {
    const backupPath = `${path}.backup`;
    await writeFile(backupPath, content, 'utf-8');
  }
}
