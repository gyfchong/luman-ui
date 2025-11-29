import path from "node:path"
import fs from "fs-extra"
import type { Framework, PackageManager, ProjectInfo } from "../types"

export async function detectPackageManager(cwd: string = process.cwd()): Promise<PackageManager> {
  const lockFiles = {
    "pnpm-lock.yaml": "pnpm" as const,
    "yarn.lock": "yarn" as const,
    "bun.lockb": "bun" as const,
    "package-lock.json": "npm" as const,
  }

  for (const [lockFile, pm] of Object.entries(lockFiles)) {
    if (await fs.pathExists(path.join(cwd, lockFile))) {
      return pm
    }
  }

  return "npm"
}

export async function detectFramework(cwd: string = process.cwd()): Promise<Framework> {
  const packageJsonPath = path.join(cwd, "package.json")

  if (!(await fs.pathExists(packageJsonPath))) {
    return "manual"
  }

  const packageJson = await fs.readJson(packageJsonPath)
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  if (deps.next) return "next"
  if (deps["@remix-run/react"]) return "remix"
  if (deps.astro) return "astro"
  if (deps.vite) return "vite"

  return "manual"
}

export async function detectTailwindCSS(cwd: string = process.cwd()): Promise<boolean> {
  const packageJsonPath = path.join(cwd, "package.json")

  if (!(await fs.pathExists(packageJsonPath))) {
    return false
  }

  const packageJson = await fs.readJson(packageJsonPath)
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  return !!deps.tailwindcss
}

export async function detectTailwindVersion(cwd: string = process.cwd()): Promise<number | null> {
  const packageJsonPath = path.join(cwd, "package.json")

  if (!(await fs.pathExists(packageJsonPath))) {
    return null
  }

  const packageJson = await fs.readJson(packageJsonPath)
  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  const tailwindVersion = deps.tailwindcss
  if (!tailwindVersion) {
    return null
  }

  // Extract major version from version string (e.g., "^3.4.0" -> 3, "^4.0.0-alpha.1" -> 4)
  const match = tailwindVersion.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : null
}

export async function detectProjectInfo(cwd: string = process.cwd()): Promise<ProjectInfo> {
  const framework = await detectFramework(cwd)
  const packageManager = await detectPackageManager(cwd)

  const srcDir = await fs.pathExists(path.join(cwd, "src"))
  const appDir = await fs.pathExists(path.join(cwd, "app"))
  const typescript = await fs.pathExists(path.join(cwd, "tsconfig.json"))

  return {
    framework,
    packageManager,
    srcDir,
    appDir,
    typescript,
  }
}
