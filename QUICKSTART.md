# Quick Start Guide

Get SportsMatch AI Backend running in under 2 minutes with **zero configuration**! 🚀

The app now works out of the box with sensible defaults - no database or environment setup required for development.

## Prerequisites Check

- [ ] Node.js 20+ installed (`node --version`)
- [ ] PostgreSQL installed and running (optional - app will use mock database if unavailable)
- [ ] Redis installed (optional, but recommended)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database (Optional - Skip if using mock database)

💡 **Quick Start Option:** You can skip database setup entirely! The app will automatically use a mock in-memory database with sample data if PostgreSQL is not available. Data will be lost on restart, but perfect for quick testing.

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

#### Option C: Skip Database Setup (Use Mock)

If you don't want to set up PostgreSQL right now, just skip to step 3! The app will automatically detect that PostgreSQL is unavailable and use an in-memory mock database with sample teams, players, and matches.

### 3. Configure Environment (Optional)

💡 **Ultra Quick Start:** You can skip this step entirely! The app will use sensible defaults:
- Default JWT_SECRET for development (with security warning)
- Mock database if PostgreSQL not available
- Default Redis settings

If you want to customize, create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sportsmatch?schema=public"  # Optional
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production  # Optional - uses default if not set
JWT_EXPIRES_IN=7d  # Optional
REDIS_HOST=localhost  # Optional
REDIS_PORT=6379  # Optional
OPENAI_API_KEY=your-openai-api-key-here  # Optional
CORS_ORIGIN=http://localhost:3000  # Optional
```

**Note:** Update `DATABASE_URL` with your PostgreSQL credentials if using PostgreSQL.

### 4. Initialize Database (Only if using PostgreSQL)

**Skip this step if you're using the mock database!**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

If you skip this step, the app will automatically use the mock database when it can't connect to PostgreSQL.

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run dev
```

You should see one of these:
```
🚀 Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
✅ Database connected successfully (PostgreSQL)
✅ Redis connected
```

OR if using defaults/mock database:
```
🚀 Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
⚠️  Using default JWT_SECRET - NOT SECURE FOR PRODUCTION!
   Set JWT_SECRET environment variable for production use
⚠️  Database connection failed, falling back to mock database
✅ Mock database initialized (in-memory storage)
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
- **Good news!** If PostgreSQL isn't available, the app automatically uses a mock database with sample data
- If you want to use PostgreSQL:
  - Check PostgreSQL is running: `pg_isready` or check Docker container
  - Verify DATABASE_URL in `.env` file
  - Ensure database `sportsmatch` exists
- You can check which database you're using via: `curl http://localhost:3000/health`

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
