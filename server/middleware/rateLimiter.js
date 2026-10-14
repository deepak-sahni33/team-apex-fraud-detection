// server/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import { ENV } from '../config/env.js';

/**
 * Standard API rate limiter to protect threat scanning endpoints from abuse
 */
export const apiRateLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS,
  max: ENV.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate Limit Exceeded',
    message: 'Too many requests received from this client. Please wait before retrying.',
  },
  skip: () => ENV.NODE_ENV === 'test',
});
