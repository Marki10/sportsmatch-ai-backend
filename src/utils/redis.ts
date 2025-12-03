import { createClient } from 'redis';
import { config } from '../config/env';

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
  password: config.redis.password,
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis connected'));

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    // Don't exit - allow app to run without Redis
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
    console.log('✅ Redis disconnected');
  }
};

export const cache = {
  get: async (key: string): Promise<string | null> => {
    try {
      if (!redisClient.isOpen) return null;
      return await redisClient.get(key);
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },
  set: async (key: string, value: string, expireInSeconds?: number): Promise<void> => {
    try {
      if (!redisClient.isOpen) return;
      if (expireInSeconds) {
        await redisClient.setEx(key, expireInSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  },
  delete: async (key: string): Promise<void> => {
    try {
      if (!redisClient.isOpen) return;
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  },
};

export default redisClient;
