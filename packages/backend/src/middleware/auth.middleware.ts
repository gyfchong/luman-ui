import type { Request, Response, NextFunction } from 'express'
import type { AuthRequest } from '../types/index.js'
import { verifyAccessToken } from '../utils/jwt.js'
import { AuthService } from '../services/auth.service.js'
import type { Database } from '../db/index.js'

/**
 * Middleware to authenticate JWT tokens
 */
export function authenticateJWT(db: Database) {
  const authService = new AuthService(db)

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.substring(7)

      // Try JWT token first
      try {
        const payload = verifyAccessToken(token)
        const user = await authService.getUserById(payload.userId)

        if (!user) {
          return res.status(401).json({ error: 'User not found' })
        }

        ;(req as AuthRequest).user = user
        next()
      } catch (jwtError) {
        // If JWT fails, try CLI token
        const user = await authService.verifyCliToken(token)

        if (!user) {
          return res.status(401).json({ error: 'Invalid or expired token' })
        }

        ;(req as AuthRequest).user = user
        next()
      }
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' })
    }
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export function optionalAuth(db: Database) {
  const authService = new AuthService(db)

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)

        try {
          const payload = verifyAccessToken(token)
          const user = await authService.getUserById(payload.userId)
          if (user) {
            ;(req as AuthRequest).user = user
          }
        } catch {
          // Try CLI token
          const user = await authService.verifyCliToken(token)
          if (user) {
            ;(req as AuthRequest).user = user
          }
        }
      }

      next()
    } catch {
      next()
    }
  }
}
