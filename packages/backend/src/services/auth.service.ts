import { eq } from 'drizzle-orm'
import type { Database } from '../db/index.js'
import { users, apiTokens } from '../db/schema.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { generateTokens, generateApiToken } from '../utils/jwt.js'
import type { AuthTokens, User, CLILoginResponse } from '../types/index.js'

export class AuthService {
  constructor(private db: Database) {}

  /**
   * Create a new user
   */
  async createUser(email: string, password: string, name?: string): Promise<User> {
    const passwordHash = await hashPassword(password)

    const [user] = await this.db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || null,
      })
      .returning()

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }
  }

  /**
   * Authenticate user with email and password
   */
  async authenticate(email: string, password: string): Promise<AuthTokens | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user || !user.passwordHash) {
      return null
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return null
    }

    return generateTokens(user.id, user.email)
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }
  }

  /**
   * Create CLI API token for a user
   */
  async createCliToken(userId: string, name: string = 'CLI'): Promise<string> {
    const token = generateApiToken()

    await this.db.insert(apiTokens).values({
      userId,
      token,
      name,
      expiresAt: null, // CLI tokens don't expire by default
    })

    return token
  }

  /**
   * Verify CLI API token
   */
  async verifyCliToken(token: string): Promise<User | null> {
    const [apiToken] = await this.db
      .select()
      .from(apiTokens)
      .where(eq(apiTokens.token, token))
      .limit(1)

    if (!apiToken) {
      return null
    }

    // Check if token is expired
    if (apiToken.expiresAt && new Date() > apiToken.expiresAt) {
      return null
    }

    // Update last used timestamp
    await this.db
      .update(apiTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiTokens.token, token))

    // Get user
    return this.getUserById(apiToken.userId)
  }

  /**
   * Revoke CLI API token
   */
  async revokeCliToken(token: string): Promise<boolean> {
    const result = await this.db
      .delete(apiTokens)
      .where(eq(apiTokens.token, token))

    return true
  }

  /**
   * CLI login - authenticate and return long-lived token
   */
  async cliLogin(email: string, password: string): Promise<CLILoginResponse | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user || !user.passwordHash) {
      return null
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return null
    }

    // Create a CLI token
    const token = await this.createCliToken(user.id, 'CLI Login')

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  }
}
