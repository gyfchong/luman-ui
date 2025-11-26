import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema.js'
import { consola } from 'consola'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Initialize database connection
 */
export function initDatabase(dbPath?: string) {
  const resolvedPath = dbPath || process.env.DATABASE_URL || './data/luman.db'

  // Ensure directory exists
  const dir = path.dirname(resolvedPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  consola.info(`Connecting to database: ${resolvedPath}`)

  const sqlite = new Database(resolvedPath)
  const db = drizzle(sqlite, { schema })

  return { db, sqlite }
}

/**
 * Run database migrations
 */
export async function runMigrations(dbPath?: string) {
  const { db, sqlite } = initDatabase(dbPath)

  try {
    consola.info('Running database migrations...')
    const migrationsFolder = path.join(__dirname, '../../migrations')

    // Create migrations folder if it doesn't exist
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder, { recursive: true })
      consola.info('Created migrations folder')
    }

    migrate(db, { migrationsFolder })
    consola.success('Database migrations completed')
  } catch (error) {
    consola.error('Migration failed:', error)
    throw error
  } finally {
    sqlite.close()
  }
}

export { schema }
export type Database = ReturnType<typeof initDatabase>['db']
