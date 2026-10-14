// server/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, automated tests)
      if (!origin) return callback(null, true);
      if (ENV.CORS_ORIGINS.includes(origin) || ENV.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error(`Origin "${origin}" not allowed by CORS policy.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logger
app.use((req, res, next) => {
  if (ENV.NODE_ENV !== 'test') {
    logger.debug(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Mount API routes
app.use('/api', routes);

// Centralized error and 404 handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
