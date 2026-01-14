import rateLimit from 'express-rate-limit';
import appConfig from '../config/app.js';
import constants from '../config/constants.js';

const { MESSAGES } = constants;

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.max,
  message: {
    status: 'error',
    message: MESSAGES.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiter for code execution endpoints
 */
export const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    status: 'error',
    message: 'Too many code execution requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});
