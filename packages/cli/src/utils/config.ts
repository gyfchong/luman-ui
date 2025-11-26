import { cosmiconfig } from 'cosmiconfig'
import fs from 'fs-extra'
import path from 'path'
import type { Config } from '../types'
import { configSchema } from '../types'

const explorer = cosmiconfig('luman', {
  searchPlaces: [
    'luman.config.json',
    'luman.config.js',
    'luman.config.ts',
    'components.json',
  ],
})

export async function getConfig(cwd: string = process.cwd()): Promise<Config | null> {
  const result = await explorer.search(cwd)

  if (!result) {
    return null
  }

  return configSchema.parse(result.config)
}

export async function resolveConfigPaths(
  cwd: string,
  config: Config
): Promise<Config> {
  const tailwind = {
    ...config.tailwind,
    config: path.resolve(cwd, config.tailwind.config),
    css: path.resolve(cwd, config.tailwind.css),
  }

  return {
    ...config,
    tailwind,
  }
}

export async function writeConfig(
  cwd: string,
  config: Config
): Promise<void> {
  const configPath = path.join(cwd, 'components.json')
  await fs.writeJson(configPath, config, { spaces: 2 })
}

export async function configExists(cwd: string = process.cwd()): Promise<boolean> {
  const result = await explorer.search(cwd)
  return result !== null
}
