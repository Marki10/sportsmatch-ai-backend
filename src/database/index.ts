import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';
import { mockPrisma, mockDb } from './mock';

let prisma: any;
let isUsingMock = false;

// Try to create real Prisma client (only if DATABASE_URL is provided)
if (!config.databaseUrl) {
  console.warn('⚠️  No DATABASE_URL provided, will use mock database');
  prisma = mockPrisma;
  isUsingMock = true;
} else {
  try {
    prisma = new PrismaClient({
      log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.warn('⚠️  Could not create Prisma client, will use mock database');
    prisma = mockPrisma;
    isUsingMock = true;
  }
}

export const connectDatabase = async (): Promise<void> => {
  try {
    if (isUsingMock) {
      mockDb.initialize();
      console.log('✅ Mock database connected (using in-memory storage)');
      return;
    }

    await prisma.$connect();
    console.log('✅ Database connected successfully');
    isUsingMock = false;
  } catch (error) {
    console.warn('⚠️  Database connection failed, falling back to mock database');
    console.warn('   Error:', error instanceof Error ? error.message : error);
    console.warn('   The application will use in-memory storage (data will be lost on restart)');
    
    // Switch to mock database
    prisma = mockPrisma;
    isUsingMock = true;
    mockDb.initialize();
    console.log('✅ Mock database initialized');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    // Mock database doesn't need disconnection
    if (isUsingMock) {
      console.log('✅ Mock database disconnected');
    } else {
      console.error('Error disconnecting database:', error);
    }
  }
};

// Export a function to check if using mock
export const isMockDatabase = (): boolean => isUsingMock;

export default prisma;
