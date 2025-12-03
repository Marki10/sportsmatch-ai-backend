import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Skip rate limiting in test environment
const skipInTests = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  // Return a no-op middleware that just calls next
  return next();
};

const createLimiter = (options: Parameters<typeof rateLimit>[0]) => {
  if (process.env.NODE_ENV === 'test') {
    return skipInTests;
  }
  return rateLimit(options);
};

export const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = createLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: 'Too many API requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
