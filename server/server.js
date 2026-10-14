// server/server.js
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  logger.info('Starting ScamShield  AI Backend Service...');

  // Initialize database connection
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    logger.info(`Server listening on http://localhost:${ENV.PORT}`);
    logger.info(`Health check available at http://localhost:${ENV.PORT}/api/health`);
    logger.info(`Threat Detection Mode: ${ENV.GEMINI_API_KEY ? 'Gemini AI' : ENV.OPENAI_API_KEY ? 'OpenAI' : 'Deterministic Rules Engine (Fallback)'}`);
  });

  // Handle termination signals cleanly
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDB();
      logger.info('ScamShield  AI server shutdown complete.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error('Failed to initialize server:', err);
  process.exit(1);
});
