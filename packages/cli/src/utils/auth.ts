import os from 'os'
import path from 'path'
import fs from 'fs-extra'

const CONFIG_DIR = path.join(os.homedir(), '.luman')
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json')

export interface AuthConfig {
  token: string
  user: {
    id: string
    email: string
    name: string | null
  }
  apiUrl: string
}

/**
 * Ensure config directory exists
 */
async function ensureConfigDir(): Promise<void> {
  await fs.ensureDir(CONFIG_DIR)
}

/**
 * Save authentication token
 */
export async function saveAuth(config: AuthConfig): Promise<void> {
  await ensureConfigDir()
  await fs.writeJson(AUTH_FILE, config, { spaces: 2 })
}

/**
 * Load authentication token
 */
export async function loadAuth(): Promise<AuthConfig | null> {
  try {
    if (await fs.pathExists(AUTH_FILE)) {
      return await fs.readJson(AUTH_FILE)
    }
  } catch (error) {
    // File doesn't exist or is invalid
  }
  return null
}

/**
 * Remove authentication token
 */
export async function removeAuth(): Promise<void> {
  try {
    if (await fs.pathExists(AUTH_FILE)) {
      await fs.remove(AUTH_FILE)
    }
  } catch (error) {
    // File doesn't exist
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const auth = await loadAuth()
  return !!auth?.token
}

/**
 * Get authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  const auth = await loadAuth()
  return auth?.token || null
}

/**
 * Get API URL
 */
export async function getApiUrl(): Promise<string> {
  const auth = await loadAuth()
  return auth?.apiUrl || process.env.LUMAN_API_URL || 'http://localhost:3000'
}
