# JWT Default Secret Feature

## Overview

The SportsMatch AI Backend now includes a **default JWT secret** for development, making it even easier to get started with zero configuration!

## How It Works

- **Optional JWT_SECRET**: If `JWT_SECRET` environment variable is not set, the app uses a default development secret
- **Security Warnings**: Clear warnings are displayed when using the default secret
- **Health Check**: The health endpoint shows if default JWT secret is being used
- **Production Ready**: Easy to switch to a secure secret for production

## Usage

### Quick Start (No Configuration)

Simply start the app without setting `JWT_SECRET`:

```bash
# No .env file needed!
npm install
npm run dev
```

You'll see:
```
⚠️  Using default JWT_SECRET - NOT SECURE FOR PRODUCTION!
   Set JWT_SECRET environment variable for production use
✅ Mock database connected (using in-memory storage)
🚀 Server running on port 3000
```

### Production Setup

For production, always set a secure JWT secret:

```env
JWT_SECRET=your-super-secure-random-secret-key-here
```

Generate a secure secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## Health Check

Check which JWT secret you're using:

```bash
curl http://localhost:3000/health
```

Response with default secret:
```json
{
  "success": true,
  "message": "Server is running",
  "database": {
    "type": "mock (in-memory)",
    "status": "connected"
  },
  "jwt": {
    "usingDefaultSecret": true,
    "note": "Using default JWT secret - not secure for production"
  }
}
```

Response with custom secret:
```json
{
  "success": true,
  "message": "Server is running",
  "database": {
    "type": "postgresql",
    "status": "connected"
  },
  "jwt": {
    "usingDefaultSecret": false
  }
}
```

## Security Notes

### Development
✅ **Safe to use default secret** - Perfect for local development and testing

### Production
❌ **NEVER use default secret** - Always set a strong, randomly generated secret

### Default Secret Value

The default secret is:
```
dev-jwt-secret-change-in-production-not-secure
```

This is intentionally insecure and should never be used in production environments.

## Benefits

1. **Zero Configuration** - Get started instantly without setting up secrets
2. **Clear Warnings** - Always know when using insecure defaults
3. **Production Ready** - Easy to switch to secure secrets
4. **Developer Friendly** - No barriers to quick testing

## Environment Variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `JWT_SECRET` | No | `dev-jwt-secret-change-in-production-not-secure` | ⚠️ Insecure default - set for production |
| `JWT_EXPIRES_IN` | No | `7d` | Token expiration time |

## Implementation

The default JWT secret is implemented in `src/config/env.ts`:

```typescript
const DEFAULT_JWT_SECRET = 'dev-jwt-secret-change-in-production-not-secure';
const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const isDefaultJwtSecret = !process.env.JWT_SECRET;

if (isDefaultJwtSecret) {
  console.warn('⚠️  Using default JWT_SECRET - NOT SECURE FOR PRODUCTION!');
  console.warn('   Set JWT_SECRET environment variable for production use');
}
```

## Best Practices

1. **Development**: Use default secret for convenience
2. **Staging**: Set a secure secret but different from production
3. **Production**: Always use a strong, randomly generated secret
4. **CI/CD**: Store secrets securely in environment variables or secret management

## Migration Guide

### From Default to Custom Secret

1. Generate a secure secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. Add to `.env`:
   ```env
   JWT_SECRET=your-generated-secret-here
   ```

3. Restart the server - warnings will disappear!

### Verify Secret Change

- Check health endpoint - `usingDefaultSecret` should be `false`
- No console warnings about default JWT secret
- Existing tokens will be invalid (users need to re-authenticate)

---

**Enjoy zero-config JWT authentication for development! 🔐**
