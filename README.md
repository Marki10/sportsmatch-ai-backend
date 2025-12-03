# SportsMatch AI – Backend API

A modern, production-ready Node.js REST API for managing sports data, player statistics, team information, and AI-powered match predictions. Built with TypeScript, Express, PostgreSQL, Redis, and OpenAI integration.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)

## ✨ Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with secure password hashing
- ✅ **CRUD Operations** - Full REST API for Teams, Players, and Matches
- ✅ **PostgreSQL Database** - Prisma ORM with type-safe queries
- ✅ **Mock Database Fallback** - Automatic fallback to in-memory database if PostgreSQL unavailable
- ✅ **Redis Caching** - Performance optimization with intelligent cache invalidation
- ✅ **Rate Limiting** - Protect API endpoints from abuse
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **API Documentation** - Swagger/OpenAPI documentation
- ✅ **Environment Configuration** - Secure environment variable management

### Bonus Features
- 🤖 **AI Match Predictions** - OpenAI-powered match outcome predictions
- 🧪 **Unit Tests** - Jest test suite for authentication
- 🐳 **Docker Support** - Complete Docker and Docker Compose setup
- 🔒 **Input Validation** - Zod schema validation
- 📊 **Health Checks** - API health monitoring endpoint

## 🏗️ Tech Stack

- **Runtime:** Node.js 20
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL 16 (with Prisma ORM)
- **Cache:** Redis 7
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Documentation:** Swagger/OpenAPI
- **AI:** OpenAI API (optional)
- **Containerization:** Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 16+ (optional - app will use mock database if unavailable)
- Redis 7+ (optional, app will run without it)
- npm or yarn
- Docker & Docker Compose (optional, for containerized setup)

**Note:** If PostgreSQL is not available, the application automatically falls back to an in-memory mock database. This is perfect for quick testing, but data will be lost when the server restarts.

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sportsmatch-ai-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/sportsmatch?schema=public"
   JWT_SECRET=your-super-secret-jwt-key
   REDIS_HOST=localhost
   REDIS_PORT=6379
   OPENAI_API_KEY=your-openai-api-key  # Optional
   ```

4. **Set up the database** (Optional - skip if using mock database)
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Or push schema directly (development)
   npm run db:push
   ```
   
   **💡 Tip:** If you don't have PostgreSQL set up, you can skip this step! The app will automatically use a mock in-memory database with sample data.

5. **Start Redis** (optional, but recommended)
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Or use your local Redis installation
   redis-server
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`
   - Health Check: `http://localhost:3000/health`

### Option 2: Docker Compose (Recommended)

1. **Clone and setup**
   ```bash
   git clone <your-repo-url>
   cd sportsmatch-ai-backend
   ```

2. **Create `.env` file** (or use defaults in docker-compose.yml)

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database
   - Redis cache
   - API server

4. **View logs**
   ```bash
   docker-compose logs -f app
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team (🔒 Auth required)
- `PUT /api/teams/:id` - Update team (🔒 Auth required)
- `DELETE /api/teams/:id` - Delete team (🔒 Auth required)

### Players
- `GET /api/players` - Get all players (optional: `?teamId=uuid`)
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create player (🔒 Auth required)
- `PUT /api/players/:id` - Update player (🔒 Auth required)
- `DELETE /api/players/:id` - Delete player (🔒 Auth required)

### Matches
- `GET /api/matches` - Get all matches (optional: `?status=scheduled`)
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/:id/prediction` - Get AI prediction for match
- `POST /api/matches` - Create match (🔒 Auth required)
- `PUT /api/matches/:id` - Update match (🔒 Auth required)
- `DELETE /api/matches/:id` - Delete match (🔒 Auth required)

### Utility
- `GET /health` - Health check endpoint
- `GET /api-docs` - Swagger API documentation

## 🔐 Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Request

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Use token for protected endpoint
curl -X GET http://localhost:3000/api/teams \
  -H "Authorization: Bearer <your-token>"
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
sportsmatch-ai-backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── env.ts            # Environment configuration
│   ├── database/
│   │   ├── index.ts          # Database connection
│   │   └── migrations/       # Database migrations
│   ├── routes/
│   │   ├── auth.routes.ts    # Authentication routes
│   │   ├── players.routes.ts # Player routes
│   │   ├── teams.routes.ts   # Team routes
│   │   └── matches.routes.ts # Match routes
│   ├── controllers/          # Route controllers
│   ├── services/             # Business logic
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   ├── error-handler.ts  # Error handling
│   │   ├── rate-limit.ts     # Rate limiting
│   │   └── validation.ts     # Input validation
│   ├── utils/                # Utility functions
│   └── types/                # TypeScript types
├── tests/                    # Test files
├── prisma/
│   └── schema.prisma         # Database schema
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio GUI

## 🐳 Docker Commands

```bash
# Build image
docker build -t sportsmatch-api .

# Run container
docker run -p 3000:3000 --env-file .env sportsmatch-api

# Docker Compose
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose logs -f app    # View API logs
docker-compose exec app sh    # Access container shell
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Rate limiting on all endpoints
- Input validation with Zod
- CORS configuration
- Environment variable security
- SQL injection protection (via Prisma)

## 📊 Database Schema

- **Users** - User accounts with authentication
- **Teams** - Football/sports teams
- **Players** - Players with stats and team association
- **Matches** - Match records with predictions

See `prisma/schema.prisma` for full schema details.

## 🤖 AI Predictions

The API integrates with OpenAI to generate match predictions. When creating a match or requesting a prediction:

1. Team data is analyzed
2. AI generates win/draw probabilities
3. Predicted score is included
4. Confidence level is provided

**Note:** OpenAI API key is optional. If not provided, the API will use fallback predictions.

## 🚦 Rate Limits

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **API Endpoints:** 30 requests per minute per IP

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | Token expiration | No | 7d |
| `REDIS_HOST` | Redis host | No | localhost |
| `REDIS_PORT` | Redis port | No | 6379 |
| `REDIS_PASSWORD` | Redis password | No | - |
| `OPENAI_API_KEY` | OpenAI API key | No | - |
| `CORS_ORIGIN` | CORS allowed origin | No | http://localhost:3000 |

## 🛠️ Development

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Create a new migration
npm run db:migrate -- --name migration_name

# Reset database (⚠️ WARNING: Deletes all data)
npx prisma migrate reset
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📄 License

MIT License - feel free to use this project for learning, portfolio, or commercial purposes.

## 👤 Author

Created as a backend showcase project demonstrating modern Node.js API development skills.

## 🙏 Acknowledgments

- Prisma for the excellent ORM
- Express.js team
- OpenAI for AI capabilities
- All open-source contributors

---

⭐ If you find this project helpful, consider giving it a star!

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
