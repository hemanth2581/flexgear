// backend/src/server.ts
import { createApp } from './app';
import { ENV } from './config/environment';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(ENV.PORT, '0.0.0.0', () => {
  logger.info(`=======================================================`);
  logger.info(`🎬 FlexGear Express & TypeScript Backend API Server`);
  logger.info(`🚀 Running on http://localhost:${ENV.PORT}`);
  logger.info(`🌍 Environment: ${ENV.NODE_ENV}`);
  logger.info(`🔗 CORS Origin: ${ENV.FRONTEND_URL}`);
  logger.info(`=======================================================`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
