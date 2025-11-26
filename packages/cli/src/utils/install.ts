import { execa } from 'execa';
import { detectPackageManager } from './project.js';

/**
 * Install npm dependencies
 */
export async function installDependencies(
  packages: string[],
  cwd: string = process.cwd()
): Promise<void> {
  if (packages.length === 0) return;

  const pm = detectPackageManager(cwd);

  const commands: Record<string, { install: string; args: string[] }> = {
    npm: { install: 'npm', args: ['install', ...packages] },
    pnpm: { install: 'pnpm', args: ['add', ...packages] },
    yarn: { install: 'yarn', args: ['add', ...packages] },
    bun: { install: 'bun', args: ['add', ...packages] },
  };

  const command = commands[pm];

  if (!command) {
    throw new Error(`Unsupported package manager: ${pm}`);
  }

  try {
    await execa(command.install, command.args, {
      cwd,
      stdio: 'inherit',
    });
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error}`);
  }
}

/**
 * Uninstall npm dependencies
 */
export async function uninstallDependencies(
  packages: string[],
  cwd: string = process.cwd()
): Promise<void> {
  if (packages.length === 0) return;

  const pm = detectPackageManager(cwd);

  const commands: Record<string, { uninstall: string; args: string[] }> = {
    npm: { uninstall: 'npm', args: ['uninstall', ...packages] },
    pnpm: { uninstall: 'pnpm', args: ['remove', ...packages] },
    yarn: { uninstall: 'yarn', args: ['remove', ...packages] },
    bun: { uninstall: 'bun', args: ['remove', ...packages] },
  };

  const command = commands[pm];

  if (!command) {
    throw new Error(`Unsupported package manager: ${pm}`);
  }

  try {
    await execa(command.uninstall, command.args, {
      cwd,
      stdio: 'inherit',
    });
  } catch (error) {
    throw new Error(`Failed to uninstall dependencies: ${error}`);
  }
}
