# Quick Start Guide

Get SportsMatch AI Backend running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL installed and running
- [ ] Redis installed (optional, but recommended)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

#### Option A: Using Docker (Easiest)

```bash
# Start PostgreSQL and Redis
docker run -d --name sportsmatch-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sportsmatch -p 5432:5432 postgres:16-alpine
docker run -d --name sportsmatch-redis -p 6379:6379 redis:7-alpine
```

#### Option B: Local Installation

Make sure PostgreSQL is running on port 5432 and create a database:

```sql
CREATE DATABASE sportsmatch;
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sportsmatch?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=http://localhost:3000
```

**Note:** Update `DATABASE_URL` with your PostgreSQL credentials.

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
✅ Database connected successfully
✅ Redis connected
```

### 6. Test the API

Open your browser and visit:
- Health check: http://localhost:3000/health
- API Docs: http://localhost:3000/api-docs

Or use curl:

```bash
# Health check
curl http://localhost:3000/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## Next Steps

1. Explore the API documentation at http://localhost:3000/api-docs
2. Register a user and get your JWT token
3. Create teams, players, and matches
4. Try the AI prediction feature!

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready` or check Docker container
- Verify DATABASE_URL in `.env` file
- Ensure database `sportsmatch` exists

### Redis Connection Error
- Redis is optional - the app will run without it (no caching)
- Check Redis is running: `redis-cli ping`
- Or remove Redis from docker-compose.yml if not needed

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3000

## Using Docker Compose (Alternative)

If you prefer everything in containers:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop everything
docker-compose down
```

This starts PostgreSQL, Redis, and the API server all together!

---

🎉 **Congratulations!** Your API is now running!
