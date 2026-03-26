/**
 * Database Configuration
 *
 * This file contains database connection and optimization settings including:
 * - Connection pooling configuration
 * - Query optimization settings
 * - Database performance tuning
 * - Migration settings
 */

// Database Connection Pool Configuration
export const DB_POOL_CONFIG = {
  // Connection Pool Size
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),

  // Connection Timeouts
  acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10), // 30 seconds
  createTimeoutMillis: parseInt(process.env.DB_CREATE_TIMEOUT || '30000', 10), // 30 seconds
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10), // 30 seconds
  reapIntervalMillis: parseInt(process.env.DB_REAP_INTERVAL || '1000', 10), // 1 second

  // Connection Retry
  connectionRetryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS || '3', 10),
  connectionRetryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000', 10), // 1 second
} as const;

// Query Optimization Settings
export const QUERY_CONFIG = {
  // Enable query logging in development
  logQueries: process.env.NODE_ENV === 'development',

  // Query timeout (milliseconds)
  queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '10000', 10), // 10 seconds

  // Enable slow query logging
  slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000', 10), // 1 second

  // Enable prepared statements
  usePreparedStatements: true,
} as const;

// Database Performance Tuning
export const DB_PERFORMANCE = {
  // Enable connection pooling
  enablePooling: true,

  // Enable query result caching
  enableCaching: process.env.NODE_ENV === 'production',

  // Cache TTL (time to live) in seconds
  cacheTTL: parseInt(process.env.DB_CACHE_TTL || '300', 10), // 5 minutes

  // Batch size for bulk operations
  batchSize: parseInt(process.env.DB_BATCH_SIZE || '100', 10),

  // Enable read replicas (future enhancement)
  enableReadReplicas: false,
} as const;

// Index Optimization Recommendations
export const INDEX_RECOMMENDATIONS = {
  // User table indexes
  user: [
    'email', // For login lookups
    'googleId', // For OAuth lookups
    'facebookId', // For OAuth lookups
    'githubId', // For OAuth lookups
    'provider', // For filtering by auth provider
    'tenantId', // For multi-tenant queries
    'deletedAt', // For soft delete filtering
    ['provider', 'email'], // Compound index for OAuth + email lookups
    ['email', 'tenantId'], // Compound index for tenant-scoped lookups
  ],

  // Session table indexes
  session: [
    'userId', // For user session lookups
    'refreshToken', // For token validation
    'expiresAt', // For cleanup queries
    'isActive', // For active session filtering
    'provider', // For OAuth session filtering
  ],

  // OAuthState table indexes
  oauthState: [
    'state', // For state validation
    'provider', // For provider filtering
    'expiresAt', // For cleanup queries
  ],

  // AuditLog table indexes
  auditLog: [
    'userId', // For user audit trail
    'action', // For filtering by action type
    'createdAt', // For time-based queries
    'severity', // For filtering by severity
    'provider', // For OAuth audit filtering
  ],

  // RateLimit table indexes
  rateLimit: [
    ['identifier', 'action'], // Compound unique index
    'expiresAt', // For cleanup queries
  ],

  // VerificationAttempt table indexes
  verificationAttempt: [
    'userId', // For user lookups
    ['email', 'createdAt'], // Compound index for email-based queries
    'verificationType', // For filtering by type
  ],
} as const;

// Database Migration Settings
export const MIGRATION_CONFIG = {
  // Enable automatic migrations in development
  autoMigrate: process.env.NODE_ENV === 'development',

  // Migration timeout (milliseconds)
  migrationTimeout: parseInt(process.env.MIGRATION_TIMEOUT || '60000', 10), // 60 seconds

  // Enable migration rollback
  enableRollback: true,

  // Lock timeout for migrations (milliseconds)
  lockTimeout: parseInt(process.env.MIGRATION_LOCK_TIMEOUT || '30000', 10), // 30 seconds
} as const;

// Database Cleanup Job Configuration
export const CLEANUP_CONFIG = {
  // Enable automatic cleanup jobs
  enableCleanup: true,

  // Cleanup intervals (milliseconds)
  intervals: {
    expiredTokens: 60 * 60 * 1000, // 1 hour
    expiredSessions: 24 * 60 * 60 * 1000, // 24 hours
    expiredOAuthStates: 15 * 60 * 1000, // 15 minutes
    expiredRateLimits: 60 * 60 * 1000, // 1 hour
    oldAuditLogs: 7 * 24 * 60 * 60 * 1000, // 7 days (cleanup logs older than retention period)
  },

  // Retention periods (days)
  retention: {
    auditLogs: parseInt(process.env.AUDIT_LOG_RETENTION || '90', 10), // 90 days
    loginAttempts: parseInt(process.env.LOGIN_ATTEMPT_RETENTION || '30', 10), // 30 days
    verificationAttempts: parseInt(process.env.VERIFICATION_ATTEMPT_RETENTION || '30', 10), // 30 days
  },
} as const;

// Database Health Check Configuration
export const HEALTH_CHECK_CONFIG = {
  // Enable health checks
  enabled: true,

  // Health check interval (milliseconds)
  interval: parseInt(process.env.DB_HEALTH_CHECK_INTERVAL || '30000', 10), // 30 seconds

  // Health check timeout (milliseconds)
  timeout: parseInt(process.env.DB_HEALTH_CHECK_TIMEOUT || '5000', 10), // 5 seconds

  // Maximum consecutive failures before alerting
  maxFailures: parseInt(process.env.DB_MAX_HEALTH_FAILURES || '3', 10),
} as const;

// Database URL (from environment)
export const DATABASE_URL = process.env.DATABASE_URL || '';

// Export all configuration
export const DB_CONFIG = {
  url: DATABASE_URL,
  pool: DB_POOL_CONFIG,
  query: QUERY_CONFIG,
  performance: DB_PERFORMANCE,
  indexes: INDEX_RECOMMENDATIONS,
  migration: MIGRATION_CONFIG,
  cleanup: CLEANUP_CONFIG,
  healthCheck: HEALTH_CHECK_CONFIG,
} as const;
