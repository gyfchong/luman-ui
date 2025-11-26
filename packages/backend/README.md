# @repo/backend

Backend API for the AI-native design system platform.

## Features

- **OAuth 2.0 Authentication**: JWT-based authentication with support for multiple OAuth providers
- **User Management**: User registration, login, and profile management
- **Organization Management**: Team collaboration with role-based access control
- **API Rate Limiting**: Configurable rate limiting for all endpoints
- **Request Logging**: Comprehensive request logging and monitoring
- **CLI Token Support**: Long-lived API tokens for CLI authentication

## Setup

### Prerequisites

- Node.js >= 18
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration
```

### Environment Variables

See `.env.example` for all available configuration options.

Required variables:
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_REFRESH_SECRET`: Secret key for refresh token signing
- `DATABASE_URL`: Path to SQLite database file

### Database

```bash
# Generate database migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

### Development

```bash
# Start development server
pnpm dev

# Start production server
pnpm start
```

## API Endpoints

### Authentication

#### POST `/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 900
  }
}
```

#### POST `/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register.

#### POST `/auth/cli-login`
Login from CLI (returns long-lived token).

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "luman_...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/auth/cli-logout`
Revoke CLI token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

#### GET `/auth/me`
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Organizations

All organization endpoints require authentication.

#### GET `/organizations`
Get user's organizations.

**Response:**
```json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "My Organization",
      "slug": "my-org",
      "ownerId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/organizations`
Create a new organization.

**Request:**
```json
{
  "name": "My Organization",
  "slug": "my-org"
}
```

#### GET `/organizations/:slug`
Get organization by slug.

#### GET `/organizations/:slug/members`
Get organization members.

#### POST `/organizations/:slug/members`
Add member to organization.

**Request:**
```json
{
  "userId": "uuid",
  "role": "member" // or "admin"
}
```

#### DELETE `/organizations/:slug/members/:userId`
Remove member from organization.

#### PATCH `/organizations/:slug/members/:userId`
Update member role.

**Request:**
```json
{
  "role": "admin" // or "member"
}
```

## Architecture

### Database

Uses Drizzle ORM with SQLite for development. Can be easily migrated to PostgreSQL for production.

**Tables:**
- `users`: User accounts
- `organizations`: Organization/team accounts
- `organization_members`: Organization membership with roles
- `api_tokens`: Long-lived CLI tokens
- `oauth_providers`: OAuth provider connections
- `request_logs`: API request logs for monitoring

### Authentication

- **JWT Tokens**: Short-lived access tokens (15 minutes) with refresh tokens (7 days)
- **CLI Tokens**: Long-lived API tokens for CLI authentication
- **OAuth Support**: Framework for GitHub, Google, and GitLab OAuth (implementation pending)

### Rate Limiting

- **Auth Endpoints**: 5 requests per 15 minutes
- **API Endpoints**: 100 requests per 15 minutes
- Configurable via environment variables

### Logging

All API requests are logged with:
- User ID (if authenticated)
- Endpoint and method
- Status code
- Response time
- User agent and IP address

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting on all endpoints
- Password hashing with bcrypt
- JWT token validation
- SQL injection prevention via Drizzle ORM

## Development

### Project Structure

```
src/
├── auth/           # OAuth provider implementations
├── db/             # Database schema and connection
│   ├── schema.ts   # Drizzle schema definitions
│   └── index.ts    # Database initialization
├── middleware/     # Express middleware
│   ├── auth.middleware.ts      # JWT authentication
│   ├── ratelimit.middleware.ts # Rate limiting
│   └── logging.middleware.ts   # Request logging
├── routes/         # API routes
│   ├── auth.routes.ts          # Authentication endpoints
│   └── organization.routes.ts  # Organization endpoints
├── services/       # Business logic
│   ├── auth.service.ts         # Auth service
│   └── organization.service.ts # Organization service
├── types/          # TypeScript types
│   └── index.ts
├── utils/          # Utilities
│   ├── jwt.ts      # JWT token utilities
│   └── password.ts # Password hashing
└── index.ts        # Express app and server
```

## License

MIT
