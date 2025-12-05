import { resolve, dirname, isAbsolute } from "node:path";

/**
 * Context for path resolution
 */
export interface PathContext {
  /**
   * User's current working directory (where command was run)
   */
  cwd: string;
  /**
   * Directory containing the config file (if one exists)
   */
  configDir: string;
}

/**
 * Create a path context for resolving user-provided paths
 */
export function createPathContext(configPath?: string): PathContext {
  const cwd = process.cwd();
  const configDir = configPath ? dirname(resolve(cwd, configPath)) : cwd;

  return { cwd, configDir };
}

/**
 * Resolve an input path (relative to config directory if config exists, else CWD)
 */
export function resolveInputPath(path: string, context: PathContext): string {
  if (isAbsolute(path)) {
    return path;
  }
  // Resolve relative to config file directory
  return resolve(context.configDir, path);
}

/**
 * Resolve an output path (always relative to CWD)
 */
export function resolveOutputPath(path: string, context: PathContext): string {
  if (isAbsolute(path)) {
    return path;
  }
  // Always resolve relative to CWD for outputs
  return resolve(context.cwd, path);
}
