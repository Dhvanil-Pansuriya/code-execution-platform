import express from 'express';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Code Play Backend API',
    version: 'v1',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

export default router;
