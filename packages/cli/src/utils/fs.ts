import fs from 'fs-extra'
import path from 'path'
import type { Config } from '../types'

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
}

export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  await ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, content, 'utf-8')
}

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath)
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8')
}

export async function deleteFile(filePath: string): Promise<void> {
  if (await fileExists(filePath)) {
    await fs.remove(filePath)
  }
}

export function resolveComponentPath(
  config: Config,
  type: string,
  fileName: string
): string {
  const baseAlias = config.aliases.components

  let targetDir: string
  if (type === 'registry:component' || type === 'registry:ui') {
    targetDir = baseAlias
  } else if (type === 'registry:lib') {
    targetDir = config.aliases.lib || config.aliases.utils
  } else if (type === 'registry:hook') {
    targetDir = config.aliases.hooks || baseAlias
  } else {
    targetDir = baseAlias
  }

  // Remove alias prefix and resolve to actual path
  const cleanPath = targetDir.replace(/^[@~]\//, '')
  return path.join(process.cwd(), cleanPath, fileName)
}
