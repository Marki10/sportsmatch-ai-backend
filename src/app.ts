import express, { Application } from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { generalLimiter } from './middleware/rate-limit';
import { isMockDatabase } from './database';

// Routes
import authRoutes from './routes/auth.routes';
import teamsRoutes from './routes/teams.routes';
import playersRoutes from './routes/players.routes';
import matchesRoutes from './routes/matches.routes';

const app: Application = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SportsMatch AI API',
      version: '1.0.0',
      description: 'A modern Node.js API for player stats, match predictions, and team data',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: {
      type: isMockDatabase() ? 'mock (in-memory)' : 'postgresql',
      status: 'connected',
      note: isMockDatabase() ? 'Using in-memory storage - data will be lost on restart' : undefined,
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/matches', matchesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
