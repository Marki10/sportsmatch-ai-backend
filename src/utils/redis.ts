import { createClient } from 'redis';
import { config } from '../config/env';

let redisEnabled = false;
let connectionAttempted = false;
let redisClient: ReturnType<typeof createClient> | null = null;

// Create Redis client only when needed
function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        reconnectStrategy: false, // Disable auto-reconnect
        connectTimeout: 2000, // Fast timeout
      },
      password: config.redis.password,
    });

    // Suppress all errors - Redis is optional
    redisClient.on('error', () => {
      redisEnabled = false;
    });
    
    redisClient.on('connect', () => {
      redisEnabled = true;
      console.log('✅ Redis connected');
    });
  }
  return redisClient;
}

export const connectRedis = async (): Promise<void> => {
  if (connectionAttempted) return; // Only try once
  
  connectionAttempted = true;
  const client = getRedisClient();
  
  try {
    // Try to connect with timeout
    await Promise.race([
      client.connect(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      ),
    ]);
    redisEnabled = true;
  } catch (error) {
    redisEnabled = false;
    // Completely silent - Redis is optional
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isOpen) {
    try {
      await redisClient.disconnect();
      console.log('✅ Redis disconnected');
    } catch (error) {
      // Silent
    }
  }
};

export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      redisEnabled = false;
      return null;
    }
  },
  set: async (key: string, value: string, expireInSeconds?: number): Promise<void> => {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return;
    try {
      if (expireInSeconds) {
        await redisClient.setEx(key, expireInSeconds, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      redisEnabled = false;
    }
  },
  delete: async (key: string): Promise<void> => {
    if (!redisEnabled || !redisClient || !redisClient.isOpen) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      redisEnabled = false;
    }
  },
};

export default redisClient;
