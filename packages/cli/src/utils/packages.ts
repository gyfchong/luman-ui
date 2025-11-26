import { installDependencies, detectPackageManager as detectPM } from 'nypm'
import type { PackageManager } from '../types'

export async function installPackages(
  packages: string[],
  options: {
    cwd?: string
    dev?: boolean
    silent?: boolean
  } = {}
): Promise<void> {
  if (packages.length === 0) {
    return
  }

  const { cwd = process.cwd(), dev = false, silent = true } = options

  await installDependencies({
    cwd,
    silent,
    packageManager: await detectPM(cwd) as any,
    ...(dev && { dev }),
  })
}

export async function addDependencies(
  packages: string[],
  cwd: string = process.cwd()
): Promise<void> {
  await installPackages(packages, { cwd, dev: false })
}

export async function addDevDependencies(
  packages: string[],
  cwd: string = process.cwd()
): Promise<void> {
  await installPackages(packages, { cwd, dev: true })
}
