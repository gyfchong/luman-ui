import { z } from "zod"

export const configSchema = z.object({
  $schema: z.string().optional(),
  style: z.string().default("default"),
  rsc: z.boolean().default(false),
  tsx: z.boolean().default(true),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
    baseColor: z.string().default("slate"),
    cssVariables: z.boolean().default(true),
    prefix: z.string().default("").optional(),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
    ui: z.string().optional(),
    lib: z.string().optional(),
    hooks: z.string().optional(),
  }),
})

export type Config = z.infer<typeof configSchema>

export const packageManagerSchema = z.enum(["npm", "pnpm", "yarn", "bun"])
export type PackageManager = z.infer<typeof packageManagerSchema>

export const frameworkSchema = z.enum(["next", "vite", "remix", "astro", "manual"])
export type Framework = z.infer<typeof frameworkSchema>

export interface ProjectInfo {
  framework: Framework
  packageManager: PackageManager
  srcDir: boolean
  appDir: boolean
  typescript: boolean
}

export interface RegistryItem {
  name: string
  type: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: Array<{
    path: string
    type: string
    content?: string
    target?: string
  }>
  tailwind?: {
    config?: {
      theme?: Record<string, any>
      plugins?: string[]
    }
  }
  cssVars?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  meta?: {
    importSpecifier?: string
    displayName?: string
  }
}
