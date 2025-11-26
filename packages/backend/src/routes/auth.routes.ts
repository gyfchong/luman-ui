import { Router } from 'express'
import type { Database } from '../db/index.js'
import { AuthService } from '../services/auth.service.js'
import { authRateLimiter } from '../middleware/ratelimit.middleware.js'
import { authenticateJWT } from '../middleware/auth.middleware.js'
import type { AuthRequest } from '../types/index.js'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

const cliLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function createAuthRoutes(db: Database) {
  const router = Router()
  const authService = new AuthService(db)

  /**
   * POST /auth/register - Register new user
   */
  router.post('/register', authRateLimiter, async (req, res) => {
    try {
      const body = registerSchema.parse(req.body)

      // Check if user already exists
      const existing = await authService.getUserByEmail(body.email)
      if (existing) {
        return res.status(400).json({ error: 'User already exists' })
      }

      const user = await authService.createUser(
        body.email,
        body.password,
        body.name
      )

      const tokens = await authService.authenticate(body.email, body.password)

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        tokens,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'Registration failed' })
    }
  })

  /**
   * POST /auth/login - Login with email and password
   */
  router.post('/login', authRateLimiter, async (req, res) => {
    try {
      const body = loginSchema.parse(req.body)

      const tokens = await authService.authenticate(body.email, body.password)

      if (!tokens) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = await authService.getUserByEmail(body.email)

      res.json({
        user: {
          id: user!.id,
          email: user!.email,
          name: user!.name,
        },
        tokens,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'Login failed' })
    }
  })

  /**
   * POST /auth/cli-login - CLI login (returns long-lived token)
   */
  router.post('/cli-login', authRateLimiter, async (req, res) => {
    try {
      const body = cliLoginSchema.parse(req.body)

      const result = await authService.cliLogin(body.email, body.password)

      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      res.json(result)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'CLI login failed' })
    }
  })

  /**
   * POST /auth/cli-logout - Revoke CLI token
   */
  router.post('/cli-logout', authenticateJWT(db), async (req, res) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.substring(7)
      await authService.revokeCliToken(token)

      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' })
    }
  })

  /**
   * GET /auth/me - Get current user
   */
  router.get('/me', authenticateJWT(db), async (req, res) => {
    try {
      const user = (req as AuthRequest).user

      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' })
      }

      res.json({ user })
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user info' })
    }
  })

  return router
}
