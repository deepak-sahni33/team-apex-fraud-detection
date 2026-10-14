// server/middleware/errorHandler.js
import { logger } from '../utils/logger.js';
import { ENV } from '../config/env.js';

/**
 * 404 Route Not Found Handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
  });
}

/**
 * Centralized Application Error Middleware
 */
export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled Error [${req.method} ${req.url}]:`, err.message);

  const statusCode = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);

  const response = {
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred during threat processing.',
  };

  // Only include stack trace during development
  if (ENV.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
