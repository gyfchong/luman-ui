import type { Request } from 'express'

/**
 * User model representing authenticated users
 */
export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Organization model for team management
 */
export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Organization membership
 */
export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  createdAt: Date
}

/**
 * API token for CLI authentication
 */
export interface ApiToken {
  id: string
  userId: string
  token: string
  name: string
  expiresAt: Date | null
  lastUsedAt: Date | null
  createdAt: Date
}

/**
 * OAuth provider configuration
 */
export interface OAuthProvider {
  id: string
  userId: string
  provider: 'github' | 'google' | 'gitlab'
  providerId: string
  accessToken: string
  refreshToken: string | null
  expiresAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}

/**
 * Authentication tokens response
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: User
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * CLI login response
 */
export interface CLILoginResponse {
  success: boolean
  token: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number
  max: number
  message?: string
}
