import express from 'express';
import problemRoutes from './problem.routes.js';
import executionRoutes from './execution.routes.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Code Play Backend API',
    version: 'v1',
    endpoints: {
      health: '/health',
      api: '/api',
      v1: '/api/v1'
    }
  });
});

// Version 1 routes
const v1Router = express.Router();

// Apply rate limiting to all v1 routes
v1Router.use(apiLimiter);

// Mount route modules
v1Router.use('/problems', problemRoutes);
v1Router.use('/execute', executionRoutes);

// Mount v1 router
router.use('/v1', v1Router);

export default router;
