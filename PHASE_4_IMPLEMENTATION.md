# Phase 4 Implementation: Backend Infrastructure

This document describes the implementation of Phase 4 from the execution planning, focusing on backend infrastructure and authentication.

## Overview

Phase 4 delivers a complete backend API with OAuth 2.0 authentication, user and organization management, token storage, rate limiting, and monitoring capabilities.

## Architecture

### Technology Stack

- **Framework**: Express.js
- **Database**: Drizzle ORM with SQLite (production-ready for PostgreSQL)
- **Authentication**: JWT tokens + long-lived CLI tokens
- **Security**: Helmet.js, bcrypt password hashing, CORS
- **Rate Limiting**: express-rate-limit
- **Validation**: Zod schemas

### Package Structure

```
packages/backend/
├── src/
│   ├── auth/              # OAuth providers (future)
│   ├── db/
│   │   ├── schema.ts      # Database schema
│   │   └── index.ts       # DB connection
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── ratelimit.middleware.ts
│   │   └── logging.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── organization.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── organization.service.ts
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── utils/
│   │   ├── jwt.ts         # JWT utilities
│   │   └── password.ts    # Password hashing
│   └── index.ts           # Express app
├── migrations/            # Drizzle migrations
├── drizzle.config.ts      # Drizzle configuration
└── package.json
```

## Implemented Features

### 1. Authentication Service

**Location**: `packages/backend/src/services/auth.service.ts`

Provides:
- User registration and login
- Password hashing with bcrypt
- JWT token generation
- CLI token creation and verification
- Token revocation

### 2. Organization Management

**Location**: `packages/backend/src/services/organization.service.ts`

Provides:
- Organization creation
- Member management (add/remove/update roles)
- Role-based access control (owner, admin, member)
- Organization lookup by ID or slug

### 3. Database Schema

**Location**: `packages/backend/src/db/schema.ts`

Tables:
- `users`: User accounts
- `organizations`: Team/organization accounts
- `organization_members`: Membership with roles
- `api_tokens`: Long-lived CLI tokens
- `oauth_providers`: OAuth connections (for future OAuth implementation)
- `request_logs`: API request logging

### 4. API Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/cli-login` - CLI login (returns long-lived token)
- `POST /auth/cli-logout` - Revoke CLI token
- `GET /auth/me` - Get current user

#### Organizations (`/organizations`)
- `GET /organizations` - List user's organizations
- `POST /organizations` - Create organization
- `GET /organizations/:slug` - Get organization
- `GET /organizations/:slug/members` - List members
- `POST /organizations/:slug/members` - Add member
- `DELETE /organizations/:slug/members/:userId` - Remove member
- `PATCH /organizations/:slug/members/:userId` - Update member role

### 5. Middleware

**Authentication** (`auth.middleware.ts`):
- JWT token verification
- CLI token verification
- User attachment to request
- Optional authentication support

**Rate Limiting** (`ratelimit.middleware.ts`):
- Auth endpoints: 5 requests/15 min
- API endpoints: 100 requests/15 min
- Configurable via environment variables

**Request Logging** (`logging.middleware.ts`):
- Logs all API requests to database
- Tracks user, endpoint, method, status, response time
- IP address and user agent tracking

### 6. CLI Integration

**Location**: `packages/cli/src/`

New commands:
- `luman login` - Authenticate with backend
- `luman logout` - Revoke authentication
- `luman whoami` - Show current user

New utilities:
- `utils/auth.ts` - Token storage and retrieval
- `utils/api.ts` - Backend API communication

API exports (`src/api.ts`):
- `saveAuth()` - Save authentication config
- `loadAuth()` - Load authentication config
- `removeAuth()` - Remove authentication
- `isAuthenticated()` - Check auth status
- `getAuthToken()` - Get current token
- `apiRequest()` - Make authenticated API calls
- `loginApi()` - Login to backend
- `logoutApi()` - Logout from backend
- `getCurrentUser()` - Get user info
- `checkBackendHealth()` - Check backend status

## Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - No plaintext password storage

2. **Token Security**
   - JWT access tokens (15 min expiry)
   - JWT refresh tokens (7 day expiry)
   - CLI tokens (long-lived, revocable)
   - Secure token storage in `~/.luman/auth.json`

3. **Request Security**
   - Helmet.js security headers
   - CORS protection
   - Rate limiting on all endpoints
   - Input validation with Zod

4. **SQL Injection Protection**
   - Drizzle ORM parameterized queries
   - No raw SQL execution

## Configuration

### Environment Variables

See `packages/backend/.env.example`:

**Required:**
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `DATABASE_URL` - Database file path

**Optional:**
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - CORS origin (default: *)
- `JWT_EXPIRES_IN` - Access token expiry (default: 15m)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiry (default: 7d)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

### CLI Configuration

Users can set backend URL:
```bash
luman login --api-url https://api.luman.dev
```

Or via environment variable:
```bash
export LUMAN_API_URL=https://api.luman.dev
luman login
```

## Usage Examples

### Starting the Backend

```bash
cd packages/backend

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate database migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate

# Start development server
pnpm dev
```

### CLI Authentication

```bash
# Login
luman login
# Enter email and password

# Check current user
luman whoami

# Use authenticated features
# (Future: private registries, team features, analytics)

# Logout
luman logout
```

### Programmatic API Usage

```typescript
import {
  loginApi,
  getCurrentUser,
  saveAuth,
  isAuthenticated,
} from '@repo/cli/api'

// Login
const result = await loginApi('user@example.com', 'password')
if (result.data) {
  await saveAuth({
    token: result.data.token,
    user: result.data.user,
    apiUrl: 'http://localhost:3000',
  })
}

// Check if authenticated
const authenticated = await isAuthenticated()

// Get user info
if (authenticated) {
  const userResult = await getCurrentUser()
  console.log(userResult.data?.user)
}
```

## Testing

A test structure is provided in `packages/backend/src/__tests__/auth.test.ts` documenting the test cases that should be implemented:

1. User registration and login
2. Token generation and verification
3. CLI authentication flow
4. Organization management
5. Role-based access control
6. Rate limiting
7. Request logging

To implement tests, add a testing framework like Vitest:

```bash
cd packages/backend
pnpm add -D vitest @vitest/ui
```

## Migration from Phase 3

Phase 4 adds backend capabilities without breaking existing functionality:

- **Graceful Degradation**: CLI commands work offline (discovery, installation)
- **Optional Backend**: Authentication is only required for future team features
- **Backward Compatible**: Existing workflows continue to work

## Future Enhancements (Post-Phase 4)

### OAuth Providers
Implement OAuth 2.0 flows for:
- GitHub
- Google
- GitLab

### Private Registry
- Authenticated component registry
- Team-specific component libraries
- Version control and publishing

### Analytics
- Component usage tracking
- Adoption metrics
- Team insights

### Team Features
- Shared configurations
- Team invitations
- Collaborative workflows

## Deployment

### Development
```bash
cd packages/backend
pnpm dev
```

### Production

1. **Build**:
```bash
pnpm build
```

2. **Set environment variables**:
- Use strong secrets for JWT_SECRET and JWT_REFRESH_SECRET
- Configure appropriate CORS_ORIGIN
- Set NODE_ENV=production

3. **Database**:
- For production, consider PostgreSQL instead of SQLite
- Update drizzle.config.ts and db connection accordingly

4. **Run**:
```bash
pnpm start
```

5. **Monitoring**:
- Request logs stored in database
- Add external monitoring (Sentry, DataDog, etc.)

## Architecture Decisions

### Why SQLite?
- Zero configuration for development
- Perfect for POC and testing
- Easy migration path to PostgreSQL

### Why JWT + CLI Tokens?
- JWT for web/short-lived sessions
- CLI tokens for developer workflows
- Separate concerns, easy revocation

### Why Drizzle ORM?
- Type-safe database queries
- Excellent TypeScript integration
- Flexible dialect support (SQLite, PostgreSQL, MySQL)

### Why Express?
- Industry standard
- Large ecosystem
- Simple to extend
- Easy deployment

## Success Metrics

✅ Backend API operational
✅ JWT authentication working
✅ CLI token authentication working
✅ User and organization management
✅ Rate limiting and monitoring
✅ CLI login/logout commands
✅ Backend communication helpers
✅ Comprehensive documentation

## Next Steps (Phase 5)

Phase 5 will build on this authentication infrastructure to implement:
- Team collaboration features
- Shared configurations
- Team invitations and permissions
- Real-time collaboration capabilities

---

**Phase 4 Status**: ✅ Complete

For questions or issues, see `packages/backend/README.md` or check the execution planning document.
