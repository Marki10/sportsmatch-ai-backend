# Docker Zero Configuration Guide

## Overview

The SportsMatch AI Backend now supports **truly zero-configuration Docker deployment**! You can run it with or without PostgreSQL, Redis, and JWT secrets.

## Option 1: Zero Configuration (Mock Database)

**Perfect for quick testing and demos!**

Run with absolutely no configuration - uses mock database and default JWT secret:

```bash
docker-compose -f docker-compose.minimal.yml up --build
```

Or create your own minimal compose file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    # No environment variables needed!
    # No dependencies needed!
```

The app will:
- ✅ Use mock database (in-memory)
- ✅ Use default JWT secret (with warnings)
- ✅ Work without Redis
- ✅ Start immediately

## Option 2: Full Setup (PostgreSQL + Redis)

**Best for production-like testing**

Use the default `docker-compose.yml` which includes PostgreSQL and Redis:

```bash
docker-compose up --build
```

This will:
- ✅ Use PostgreSQL database
- ✅ Use Redis caching
- ✅ Run database migrations
- ✅ Use the configured JWT secret (or default if not set)

## Option 3: Hybrid (PostgreSQL, no Redis)

Edit `docker-compose.yml` and comment out the Redis service:

```yaml
services:
  # redis:
  #   image: redis:7-alpine
  #   ...
  
  app:
    # ...
    environment:
      DATABASE_URL: postgresql://sportsmatch:sportsmatch123@postgres:5432/sportsmatch?schema=public
      # Redis will gracefully fail if not available
```

## Current Docker Compose Configuration

The `docker-compose.yml` file now supports:

### Environment Variables (All Optional)

```yaml
environment:
  NODE_ENV: ${NODE_ENV:-development}              # Default: development
  PORT: ${PORT:-3000}                            # Default: 3000
  DATABASE_URL: ${DATABASE_URL:-...}             # Default: PostgreSQL connection
  JWT_SECRET: ${JWT_SECRET:-}                    # Default: uses default secret
  REDIS_HOST: ${REDIS_HOST:-redis}               # Default: redis
  REDIS_PORT: ${REDIS_PORT:-6379}                # Default: 6379
  OPENAI_API_KEY: ${OPENAI_API_KEY:-}            # Optional
```

### Zero Config Options

1. **Use Mock Database**: Remove or unset `DATABASE_URL`
2. **Use Default JWT**: Remove or unset `JWT_SECRET`
3. **Skip Redis**: Comment out Redis service (app handles gracefully)
4. **Skip PostgreSQL**: Comment out PostgreSQL service

## Examples

### Example 1: Minimal Setup (No .env file needed)

```bash
# Just run - everything uses defaults!
docker-compose -f docker-compose.minimal.yml up
```

### Example 2: Custom Port Only

```bash
PORT=8080 docker-compose up
```

### Example 3: Mock Database with Custom JWT

Create `.env`:
```env
JWT_SECRET=my-custom-secret
# No DATABASE_URL = uses mock
```

```bash
docker-compose up
```

### Example 4: Full Production Setup

Create `.env`:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=super-secure-secret
REDIS_HOST=redis
OPENAI_API_KEY=sk-...
```

```bash
docker-compose up
```

## Docker Compose Files

### `docker-compose.yml` (Full Setup)
- Includes PostgreSQL
- Includes Redis
- Runs migrations
- Production-ready defaults

### `docker-compose.minimal.yml` (Zero Config)
- No dependencies
- Uses mock database
- Uses default JWT
- Perfect for quick testing

## What Happens on Startup

1. **If DATABASE_URL is set**: Tries to connect to PostgreSQL, runs migrations
2. **If DATABASE_URL fails/missing**: Falls back to mock database automatically
3. **If JWT_SECRET not set**: Uses default secret (with warnings)
4. **If Redis unavailable**: App continues without caching (graceful degradation)

## Health Check

Check what's running:

```bash
curl http://localhost:3000/health
```

Response will show:
- Database type (mock vs PostgreSQL)
- JWT secret status (default vs custom)
- All services status

## Quick Start Commands

```bash
# Zero config - mock database
docker-compose -f docker-compose.minimal.yml up --build

# Full setup - PostgreSQL + Redis
docker-compose up --build

# Just the app (if you have external DB)
docker-compose up app

# Custom environment
docker-compose --env-file .env.custom up
```

## Production Recommendations

For production, always:

1. ✅ Set a strong `JWT_SECRET`
2. ✅ Use real PostgreSQL (not mock)
3. ✅ Use Redis for caching
4. ✅ Set `NODE_ENV=production`
5. ✅ Use secrets management (not plain .env)

## Troubleshooting

### App won't start
- Check logs: `docker-compose logs app`
- Verify port is available: `docker-compose ps`

### Database connection fails
- App will automatically use mock database
- Check PostgreSQL logs: `docker-compose logs postgres`

### Want to use mock database intentionally
- Remove `DATABASE_URL` from environment
- Or set empty: `DATABASE_URL=`

---

**Enjoy zero-configuration Docker deployment! 🐳**
