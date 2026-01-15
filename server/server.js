import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import appConfig from './src/config/app.js';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';
import errorHandler from './src/middleware/errorHandler.js';
import logger, { requestLogger } from './src/middleware/logger.js';

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(appConfig.corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`
Code Play Backend Server
Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
API Version: ${appConfig.apiVersion}
Health Check: http://localhost:${PORT}/health
API Base URL: http://localhost:${PORT}/api
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
