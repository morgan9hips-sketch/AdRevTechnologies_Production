import winston from 'winston';
import path from 'path';

const logDir = process.env.LOG_DIR || 'logs';
const env = process.env.NODE_ENV || 'development';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create transports based on environment
const transports: winston.transport[] = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: env === 'production' ? logFormat : consoleFormat,
  }),
];

// Add file transports for production
if (env === 'production') {
  transports.push(
    // Error log file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create the logger
export const logger = winston.createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
  exitOnError: false,
});

// Add request logging helper
export const logRequest = (method: string, url: string, userId?: number, duration?: number) => {
  logger.info('HTTP Request', {
    method,
    url,
    userId,
    duration,
  });
};

// Add error logging helper
export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

// Add business event logging
export const logBusinessEvent = (event: string, data: Record<string, unknown>) => {
  logger.info('Business Event', {
    event,
    ...data,
  });
};
