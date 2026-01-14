import express from 'express';
import * as executionController from '../controllers/execution.controller.js';
import { executionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/v1/execute
 * Execute code
 * Body: { language, version, code, stdin?, args? }
 */
router.post('/', executionLimiter, executionController.executeCode);

/**
 * POST /api/v1/execute/test
 * Execute code with test cases
 * Body: { language, version, code, testCases }
 */
router.post('/test', executionLimiter, executionController.executeWithTests);

/**
 * GET /api/v1/execute/runtimes
 * Get available runtimes from Piston API
 */
router.get('/runtimes', executionController.getRuntimes);

export default router;
