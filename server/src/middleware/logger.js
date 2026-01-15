import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom format for API logs (file)
const apiLogFormat = printf(({ level, message, timestamp, requestId, service, environment, method, url, statusCode, responseTime, ip, userId, headers, body }) => {
  if (requestId) {
    // Structured format for API file logging with headers - use METHOD as level
    return `${timestamp} [${method}]: ${url} ${statusCode} ${responseTime} - userId=${userId || 'anonymous'} requestId=${requestId} service=${service} environment=${environment} ip=${ip} headers=${JSON.stringify(headers || {})} body=${JSON.stringify(body || {})}`;
  } else {
    // Simple format for other logs
    return `${timestamp} [${level}]: ${message}`;
  }
});

// Custom format for API console logs (formatted display)
const apiConsoleFormat = printf(({ level, message, timestamp, requestId, method, url, statusCode, responseTime, userId, ip }) => {
  if (requestId) {
    // Formatted API request display in console - use METHOD as level and include IP
    return `${timestamp} [${method}]: ${url} - Status: ${statusCode} - Time: ${responseTime} - User: ${userId || 'anonymous'} - IP: ${ip}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

// Custom format for console logs
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Custom format for error logs
const errorLogFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (stack) {
    log += `\nStack: ${stack}`;
  }
  if (Object.keys(meta).length > 0) {
    log += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
  }
  return log;
});

// Custom format for info and debug logs
const standardLogFormat = printf(({ level, message, timestamp, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(meta).length > 0 && !meta.service && !meta.environment) {
    log += ` ${JSON.stringify(meta)}`;
  }
  return log;
});

// Custom filter to only allow specific log level
const levelFilter = (level) => {
  return format((info) => {
    if (info.level === level) {
      return info;
    }
    return false;
  })();
};

const logsDir = path.resolve(__dirname, '../../logs');
const apiLogsDir = path.resolve(__dirname, '../../logs/api');
const errorLogsDir = path.resolve(__dirname, '../../logs/error');
const warnLogsDir = path.resolve(__dirname, '../../logs/warn');
const infoLogsDir = path.resolve(__dirname, '../../logs/info');
const debugLogsDir = path.resolve(__dirname, '../../logs/debug');

// Ensure all logs directories exist
[logsDir, apiLogsDir, errorLogsDir, warnLogsDir, infoLogsDir, debugLogsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create API logger with daily rotation (for API requests)
const apiLogger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  defaultMeta: { 
    service: 'code-play-backend-server',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport for API logs with formatted display
    new transports.Console({
      format: combine(
        colorize(),
        apiConsoleFormat
      ),
    }),
    // Daily rotating file for API logs with full details including headers
    new DailyRotateFile({
      filename: path.join(apiLogsDir, 'api-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), apiLogFormat),
      handleExceptions: false,
      handleRejections: false,
      auditFile: path.join(apiLogsDir, 'api-audit.json'),
    })
  ],
  exitOnError: false,
});

// Create general logger for console output and separate file logging by level
const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true })
  ),
  transports: [
    // Console transport - shows all levels
    new transports.Console({
      format: combine(
        colorize(),
        consoleFormat
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
    // Daily rotating file for ERROR logs only
    new DailyRotateFile({
      level: 'error',
      filename: path.join(errorLogsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        levelFilter('error'),
        errorLogFormat
      ),
      handleExceptions: true,
      handleRejections: true,
      auditFile: path.join(errorLogsDir, 'error-audit.json'),
    }),
    // Daily rotating file for WARN logs only
    new DailyRotateFile({
      level: 'warn',
      filename: path.join(warnLogsDir, 'warn-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        levelFilter('warn'),
        standardLogFormat
      ),
      handleExceptions: false,
      handleRejections: false,
      auditFile: path.join(warnLogsDir, 'warn-audit.json'),
    }),
    // Daily rotating file for INFO logs only
    new DailyRotateFile({
      level: 'info',
      filename: path.join(infoLogsDir, 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        levelFilter('info'),
        standardLogFormat
      ),
      handleExceptions: false,
      handleRejections: false,
      auditFile: path.join(infoLogsDir, 'info-audit.json'),
    }),
    // Daily rotating file for DEBUG logs only
    new DailyRotateFile({
      level: 'debug',
      filename: path.join(debugLogsDir, 'debug-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        levelFilter('debug'),
        standardLogFormat
      ),
      handleExceptions: false,
      handleRejections: false,
      auditFile: path.join(debugLogsDir, 'debug-audit.json'),
    })
  ],
  exitOnError: false,
});

// Error handling for loggers
apiLogger.on('error', (err) => {
  console.error('API Logger error:', err);
});

logger.on('error', (err) => {
  console.error('General Logger error:', err);
});

// Create a stream object for Morgan to write to apiLogger
apiLogger.stream = {
  write: (message) => {
    apiLogger.info(message.trim());
  },
};

// Also keep stream for general logger for backward compatibility
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Get today's log file path
const getLogFilePath = () => {
  const today = new Date().toISOString().split('T')[0];
  return path.join(apiLogsDir, `api-${today}.log`);
};

// Custom request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(...args) {
    const responseTime = Date.now() - start;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Simple console log (without headers and body)
    const consoleMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms - IP: ${ip}`;
    console.log(`\x1b[36m${timestamp}\x1b[0m \x1b[32m[info]\x1b[0m: ${consoleMessage}`);
    
    // Formatted file log (readable format)
    const logLines = [
      `${timestamp} [info]: ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms - IP: ${ip}`,
      `  Headers: ${JSON.stringify(req.headers || {})}`,
      `  Body: ${JSON.stringify(req.body || {})}`,
      `  Query: ${JSON.stringify(req.query || {})}`,
      `  Params: ${JSON.stringify(req.params || {})}`,
      '' // Empty line for separation
    ].join('\n');
    
    // Write to log file
    fs.appendFile(getLogFilePath(), logLines + '\n', (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
    
    // Call original end function
    originalEnd.apply(res, args);
  };
  
  next();
};

// Export loggers
export { apiLogger };

export default logger;
