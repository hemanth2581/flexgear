// backend/src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again in a few minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 auth requests per 10 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait 10 minutes before retrying.',
  },
});
