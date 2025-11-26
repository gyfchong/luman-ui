import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'
import { consola } from 'consola'
import { initDatabase } from './db/index.js'
import { createAuthRoutes } from './routes/auth.routes.js'
import { createOrganizationRoutes } from './routes/organization.routes.js'
import { apiRateLimiter } from './middleware/ratelimit.middleware.js'
import { requestLogger } from './middleware/logging.middleware.js'

// Load environment variables
config()

const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

/**
 * Create and configure Express app
 */
export function createApp() {
  const app = express()

  // Initialize database
  const { db } = initDatabase()

  // Security middleware
  app.use(helmet())
  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  )

  // Body parsing
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Request logging
  app.use(requestLogger(db))

  // Rate limiting
  app.use(apiRateLimiter)

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Routes
  app.use('/auth', createAuthRoutes(db))
  app.use('/organizations', createOrganizationRoutes(db))

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Error handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      consola.error('Server error:', err)
      res.status(500).json({ error: 'Internal server error' })
    }
  )

  return { app, db }
}

/**
 * Start the server
 */
export async function startServer() {
  const { app } = createApp()

  app.listen(PORT, () => {
    consola.success(`Server running on http://localhost:${PORT}`)
    consola.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    consola.error('Failed to start server:', error)
    process.exit(1)
  })
}
