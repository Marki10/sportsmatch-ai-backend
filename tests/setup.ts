// Test setup file
// This runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing';
process.env.DATABASE_URL = ''; // Use mock database for tests
process.env.REDIS_HOST = '';
process.env.REDIS_PORT = '';

// Initialize mock database for tests
import { mockDb } from '../src/database/mock';
mockDb.initialize();

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Suppress default JWT secret warning in tests
  if (args[0] && typeof args[0] === 'string' && args[0].includes('JWT_SECRET')) {
    return;
  }
  // Suppress mock database warnings in tests
  if (args[0] && typeof args[0] === 'string' && args[0].includes('DATABASE_URL')) {
    return;
  }
  originalWarn(...args);
};

// Suppress console.log for cleaner test output
const originalLog = console.log;
console.log = (...args: any[]) => {
  // Suppress database connection messages in tests
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('Database connected') || 
        args[0].includes('Mock database') ||
        args[0].includes('Redis connected')) {
      return;
    }
  }
  originalLog(...args);
};
