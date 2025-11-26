import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'pathe';
import type { ProjectAnalysis } from '../types/index.js';

/**
 * Detect project framework
 */
export async function detectFramework(cwd: string = process.cwd()): Promise<ProjectAnalysis['framework']> {
  const packageJsonPath = resolve(cwd, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return 'unknown';
  }

  try {
    const content = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps.next) return 'next';
    if (deps.vite) return 'vite';
    if (deps['@remix-run/react']) return 'remix';
    if (deps.astro) return 'astro';

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Detect package manager
 */
export function detectPackageManager(cwd: string = process.cwd()): ProjectAnalysis['packageManager'] {
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(resolve(cwd, 'bun.lockb'))) return 'bun';
  if (existsSync(resolve(cwd, 'package-lock.json'))) return 'npm';

  return 'npm';
}

/**
 * Analyze project
 */
export async function analyzeProject(cwd: string = process.cwd()): Promise<ProjectAnalysis> {
  const framework = await detectFramework(cwd);
  const packageManager = detectPackageManager(cwd);
  const hasConfig = existsSync(resolve(cwd, 'components.json'));
  const tailwindConfig = findTailwindConfig(cwd);
  const tsconfig = existsSync(resolve(cwd, 'tsconfig.json')) ? 'tsconfig.json' : undefined;

  return {
    framework,
    packageManager,
    hasConfig,
    existingComponents: [],
    tailwindConfig,
    tsconfig,
  };
}

/**
 * Find Tailwind config file
 */
function findTailwindConfig(cwd: string): string | undefined {
  const variants = [
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ];

  for (const variant of variants) {
    if (existsSync(resolve(cwd, variant))) {
      return variant;
    }
  }

  return undefined;
}
