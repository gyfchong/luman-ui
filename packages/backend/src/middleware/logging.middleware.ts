import type { Request, Response, NextFunction } from 'express'
import type { AuthRequest } from '../types/index.js'
import type { Database } from '../db/index.js'
import { requestLogs } from '../db/schema.js'
import { consola } from 'consola'

/**
 * Middleware to log API requests
 */
export function requestLogger(db: Database) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now()

    // Capture response
    const originalSend = res.send
    res.send = function (data) {
      res.send = originalSend

      const responseTime = Date.now() - startTime
      const userId = (req as AuthRequest).user?.id || null

      // Log to console
      consola.info(
        `${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms - User: ${userId || 'anonymous'}`
      )

      // Log to database asynchronously
      db.insert(requestLogs)
        .values({
          userId,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.headers['user-agent'] || null,
          ipAddress: req.ip || null,
        })
        .catch((error) => {
          consola.error('Failed to log request:', error)
        })

      return originalSend.call(this, data)
    }

    next()
  }
}
