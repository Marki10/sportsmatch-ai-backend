import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  isDefaultJwtSecret: boolean;
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  openaiApiKey?: string;
  corsOrigin: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Default JWT secret for development (INSECURE - only for development!)
const DEFAULT_JWT_SECRET = 'dev-jwt-secret-change-in-production-not-secure';

const jwtSecret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const isDefaultJwtSecret = !process.env.JWT_SECRET;

if (isDefaultJwtSecret) {
  console.warn('⚠️  Using default JWT_SECRET - NOT SECURE FOR PRODUCTION!');
  console.warn('   Set JWT_SECRET environment variable for production use');
}

export const config: EnvConfig = {
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  databaseUrl: process.env.DATABASE_URL, // Optional - will use mock if not provided
  jwtSecret,
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  isDefaultJwtSecret,
  redis: {
    host: getEnvVar('REDIS_HOST', 'localhost'),
    port: parseInt(getEnvVar('REDIS_PORT', '6379'), 10),
    password: process.env.REDIS_PASSWORD,
  },
  openaiApiKey: process.env.OPENAI_API_KEY,
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
};

export default config;
