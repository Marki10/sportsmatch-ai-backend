# Mock Database Feature

## Overview

The SportsMatch AI Backend includes a built-in **mock database** that automatically activates when PostgreSQL is unavailable or not configured. This makes it incredibly easy to get started without any database setup!

## How It Works

1. **Automatic Detection**: When the app starts, it tries to connect to PostgreSQL
2. **Graceful Fallback**: If the connection fails or `DATABASE_URL` is not provided, it automatically switches to the mock database
3. **In-Memory Storage**: The mock database stores all data in memory (RAM)
4. **Sample Data**: Includes pre-populated sample teams, players, and matches

## When Mock Database is Used

The mock database is activated when:

- `DATABASE_URL` environment variable is not set
- PostgreSQL connection fails (wrong credentials, database doesn't exist, etc.)
- PostgreSQL server is not running
- Network issues prevent database connection

## Features

✅ **Full CRUD Support** - All operations work exactly as with PostgreSQL  
✅ **Sample Data** - Pre-loaded with teams, players, and matches  
✅ **Same API Interface** - Services work identically with real or mock database  
✅ **Zero Configuration** - Works out of the box  

## Limitations

⚠️ **Data Persistence**: Data is lost when the server restarts  
⚠️ **Single Instance**: Multiple server instances won't share data  
⚠️ **No Advanced Queries**: Complex SQL queries may not be supported  

## Sample Data Included

The mock database automatically includes:

- **2 Teams**: Manchester United, Liverpool FC
- **2 Players**: Sample players with stats
- **1 Match**: Scheduled match with AI prediction

## Usage Examples

### Start Without Database

Simply start the app without configuring PostgreSQL:

```bash
# Minimal .env file
PORT=3000
JWT_SECRET=your-secret-key

# Start server
npm run dev
```

You'll see:
```
⚠️  No DATABASE_URL provided, will use mock database
✅ Mock database connected (using in-memory storage)
✅ Mock database initialized with sample data
```

### Check Which Database You're Using

Call the health endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": {
    "type": "mock (in-memory)",
    "status": "connected",
    "note": "Using in-memory storage - data will be lost on restart"
  }
}
```

### Using the API

The API works exactly the same! You can:

- Register users
- Create/read/update/delete teams
- Create/read/update/delete players
- Create/read/update/delete matches
- Get AI predictions

All operations are stored in memory until the server restarts.

## Switching to PostgreSQL

When you're ready to use PostgreSQL:

1. Set up PostgreSQL database
2. Add `DATABASE_URL` to your `.env` file
3. Run migrations: `npm run db:migrate`
4. Restart the server

The app will automatically detect PostgreSQL and switch from mock to real database.

## Development Tips

### Testing Without Database

Perfect for:
- Quick API testing
- Development without PostgreSQL setup
- CI/CD pipelines without database dependencies
- Demonstrations and demos

### Testing With Real Database

Use PostgreSQL for:
- Production-like testing
- Data persistence testing
- Performance testing
- Complex query testing

## Implementation Details

The mock database is implemented in `src/database/mock.ts` and provides a Prisma-like interface:

- `user.findUnique()`, `user.create()`, etc.
- `team.findMany()`, `team.create()`, etc.
- `player.findMany()`, `player.create()`, etc.
- `match.findMany()`, `match.create()`, etc.

All operations use in-memory Maps for storage and support the same query patterns as Prisma.

## Troubleshooting

### Mock Database Not Initializing

- Check console logs for error messages
- Ensure the app has permission to use memory
- Restart the server

### Data Disappeared

This is expected! The mock database stores data in memory, so:
- Restarting the server clears all data
- Sample data is re-created on each startup
- Use PostgreSQL for persistent storage

---

**Enjoy the convenience of zero-config database for development! 🚀**
