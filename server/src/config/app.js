export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  
  // CORS configuration
  corsOptions: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  },

  // Piston API configuration
  pistonApi: {
    baseUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
    timeout: 30000 // 30 seconds
  },

  // Data configuration
  dataFilePath: process.env.DATA_FILE_PATH || './data/sample.json'
};
