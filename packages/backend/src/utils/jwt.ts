import jwt from 'jsonwebtoken'
import type { JWTPayload, AuthTokens } from '../types/index.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

/**
 * Generate access and refresh tokens
 */
export function generateTokens(userId: string, email: string): AuthTokens {
  const accessPayload: JWTPayload = {
    userId,
    email,
    type: 'access',
  }

  const refreshPayload: JWTPayload = {
    userId,
    email,
    type: 'refresh',
  }

  const accessToken = jwt.sign(accessPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  const refreshToken = jwt.sign(refreshPayload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  })

  // Calculate expiry in seconds
  const decoded = jwt.decode(accessToken) as any
  const expiresIn = decoded.exp - decoded.iat

  return {
    accessToken,
    refreshToken,
    expiresIn,
  }
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    if (payload.type !== 'access') {
      throw new Error('Invalid token type')
    }
    return payload
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    return payload
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
}

/**
 * Generate CLI API token (long-lived, doesn't expire unless explicitly set)
 */
export function generateApiToken(): string {
  return `luman_${crypto.randomUUID().replace(/-/g, '')}`
}
