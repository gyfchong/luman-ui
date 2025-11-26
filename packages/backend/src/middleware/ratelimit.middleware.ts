import rateLimit from 'express-rate-limit'
import type { RateLimitConfig } from '../types/index.js'

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config?: Partial<RateLimitConfig>) {
  const windowMs = config?.windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
  const max = config?.max || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

  return rateLimit({
    windowMs,
    max,
    message: config?.message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  })
}

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
})

/**
 * General API rate limiter
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
})
