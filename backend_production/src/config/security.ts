/**
 * Enterprise Security Configuration
 * SOC 2 Type II compliant security settings for $75M digital advertising empire
 */

// JWT Configuration with enterprise security
export const jwtConfig = {
  access: {
    secret: process.env.JWT_SECRET || 'enterprise-jwt-secret-change-in-production',
    expiresIn: '15m', // Short-lived access tokens
    algorithm: 'HS256' as const,
    issuer: 'cash-for-ads-enterprise',
    audience: 'cash-for-ads-users',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'enterprise-refresh-secret-change-in-production',
    expiresIn: '7d', // Refresh tokens expire weekly
    algorithm: 'HS256' as const,
    issuer: 'cash-for-ads-enterprise',
    audience: 'cash-for-ads-users',
    family: true, // Enable refresh token rotation
  },
  mfa: {
    secret: process.env.MFA_JWT_SECRET || 'enterprise-mfa-secret-change-in-production',
    expiresIn: '10m', // MFA challenge tokens expire quickly
    algorithm: 'HS256' as const,
    issuer: 'cash-for-ads-mfa',
    audience: 'cash-for-ads-users',
  },
};

export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const, // Enhanced security
  domain: process.env.NODE_ENV === 'production' ? '.adrevtechnologies.com' : undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (shortened for security)
};

// Enhanced rate limiting configuration
export const rateLimits = {
  login: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
  signup: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 signups per hour
  passwordReset: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 reset requests per hour
  emailVerify: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 verification attempts per 15 minutes
  oauth: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 OAuth attempts per hour
  mfa: { windowMs: 15 * 60 * 1000, max: 10 }, // 10 MFA attempts per 15 minutes
  general: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
  api: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 API requests per 15 minutes
  admin: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 admin requests per 15 minutes
  watchAd: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 ad watches per hour (anti-fraud)
  payout: { windowMs: 24 * 60 * 60 * 1000, max: 1 }, // 1 payout request per day
};

export const passwordRequirements = {
  minLength: 12, // Increased for enterprise security
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  disallowCommon: true, // Enable common password blocking
  disallowPersonalInfo: true,
  passwordHistory: 12, // Remember last 12 passwords
  maxAge: 90 * 24 * 60 * 60 * 1000, // Passwords expire after 90 days for admins
};

export const oauthConfig = {
  stateExpiryMs: 10 * 60 * 1000, // 10 minutes
  allowedRedirectUris: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://app.adrevtechnologies.com',
    'https://www.adrevtechnologies.com',
  ],
  pkceRequired: true, // Require PKCE for enhanced security
  nonceRequired: true, // Require nonce for OIDC
};

// Enhanced security headers
export const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-eval'"], // For development, restrict in production
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://api.paypal.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      reportUri: '/api/security/csp-report',
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameOptions: 'DENY',
  contentTypeOptions: true,
  xssFilter: true,
  referrerPolicy: 'strict-origin-when-cross-origin',
  permittedCrossDomainPolicies: false,
};

export const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://cashforads.com',
  'https://www.cashforads.com',
  'https://adrevtechnologies.com',
  'https://www.adrevtechnologies.com',
  'https://app.cashforads.com',
  'https://*.cashforads.com', // Subdomains for multi-tenant
  process.env.FRONTEND_URL,
  process.env.WEBSITE_URL,
].filter(Boolean);

export const accountLockoutConfig = {
  maxFailedAttempts: 5,
  baseLockoutMinutes: 15,
  maxLockoutHours: 24,
  progressiveLockout: true, // Increase lockout time with repeated failures
  adminNotification: true, // Notify admins of repeated lockouts
};

export const sessionConfig = {
  maxActiveSessions: 5, // Maximum concurrent sessions per user
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days max session lifetime
  extendSessionOn: ['auth', 'api'], // Extend session on these actions
  deviceTrustDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
  geoLocationTracking: true,
  suspiciousActivityDetection: true,
};

export const auditConfig = {
  retentionDays: 2555, // 7 years for SOC 2 compliance
  sensitiveActions: [
    'login',
    'logout',
    'login_failed',
    'password_change',
    'mfa_enable',
    'mfa_disable',
    'mfa_challenge',
    'oauth_login',
    'oauth_link',
    'oauth_unlink',
    'payout_request',
    'admin_action',
    'security_event',
    'account_locked',
    'account_unlocked',
    'account_deleted',
    'data_export',
    'data_deletion',
  ],
};

// Enhanced encryption configuration
export const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
  saltLength: 32,
  iterations: 100000, // PBKDF2 iterations
  keyDerivation: {
    algorithm: 'pbkdf2',
    digest: 'sha256',
  },
};

// MFA Configuration
export const mfaConfig = {
  totp: {
    window: 2, // Allow 2 time steps before/after
    step: 30, // 30 seconds per step
    issuer: 'Cash for Ads Enterprise',
    algorithm: 'sha1' as const,
  },
  sms: {
    codeLength: 6,
    expiryMinutes: 10,
    maxAttempts: 3,
  },
  backupCodes: {
    count: 10,
    length: 8,
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
  recovery: {
    codeLength: 16,
    expiryHours: 24,
    singleUse: true,
  },
  required: {
    admins: true, // MFA required for all admin accounts
    highValue: true, // MFA required for accounts with high transaction volume
    suspicious: true, // MFA required when suspicious activity detected
  },
};

// Security Monitoring Configuration
export const securityMonitoringConfig = {
  failedLogins: {
    threshold: 5, // Alert after 5 failed logins
    timeWindow: 15 * 60 * 1000, // 15 minutes
    blockDuration: 60 * 60 * 1000, // Block IP for 1 hour
  },
  suspiciousActivity: {
    rapidRequests: {
      threshold: 50, // 50 requests in time window
      timeWindow: 60 * 1000, // 1 minute
    },
    geolocationAnomaly: {
      enabled: true,
      maxDistanceKm: 1000, // Alert if user location changes by >1000km
    },
    userAgentChange: {
      enabled: true,
      alertOnChange: true,
    },
  },
  automatedBlocking: {
    enabled: true,
    ipBlockDuration: 24 * 60 * 60 * 1000, // 24 hours
    whitelistedIPs: [], // Admin IPs that are never blocked
  },
};

// Redis Configuration for distributed caching and rate limiting
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  keepAlive: 30000,
  tls: process.env.REDIS_TLS === 'true' ? {} : null,
  keyPrefixes: {
    rateLimit: 'rl:',
    session: 'sess:',
    cache: 'cache:',
    mfa: 'mfa:',
    security: 'sec:',
  },
};

// API Security Configuration
export const apiSecurityConfig = {
  requestSigning: {
    enabled: true,
    algorithm: 'sha256',
    timestampTolerance: 5 * 60 * 1000, // 5 minutes
    requiredHeaders: ['timestamp', 'signature'],
  },
  apiKeys: {
    keyLength: 32,
    prefixes: {
      live: 'sk_live_',
      test: 'sk_test_',
    },
    scopes: [
      'read:ads',
      'write:ads',
      'read:users',
      'write:users',
      'read:analytics',
      'write:payouts',
      'admin:all',
    ],
    defaultExpiry: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  webhooks: {
    maxBodySize: '10mb',
    signatureHeader: 'x-webhook-signature',
    timestampHeader: 'x-webhook-timestamp',
    toleranceSeconds: 300, // 5 minutes
  },
};

// Compliance Configuration
export const complianceConfig = {
  gdpr: {
    dataRetentionDays: 2555, // 7 years for financial data
    userDataRetentionDays: 1095, // 3 years for user data
    deletionGracePeriod: 30, // 30 days for deletion requests
    consentValidityDays: 365, // Consent valid for 1 year
    dataPortabilityFormats: ['json', 'csv'],
  },
  ccpa: {
    enabled: true,
    dataCategories: ['personal', 'financial', 'behavioral', 'biometric'],
    saleOptOut: true,
    deletionRights: true,
    accessRights: true,
  },
  soc2: {
    auditLogRetention: 2555, // 7 years
    accessReviewFrequency: 90, // 90 days
    securityAssessmentFrequency: 365, // 1 year
    incidentResponseSLA: 4, // 4 hours
    changeManagementRequired: true,
  },
};

// Security Defaults for Development vs Production
export const getSecurityConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    strictMode: isProduction,
    debugMode: isDevelopment,
    rateLimiting: {
      ...rateLimits,
      general: {
        ...rateLimits.general,
        max: isDevelopment ? 10000 : rateLimits.general.max,
      },
    },
    encryption: encryptionConfig,
    mfa: {
      ...mfaConfig,
      required: {
        ...mfaConfig.required,
        admins: isProduction, // Only require MFA for admins in production
      },
    },
    monitoring: {
      ...securityMonitoringConfig,
      failedLogins: {
        ...securityMonitoringConfig.failedLogins,
        threshold: isDevelopment ? 20 : securityMonitoringConfig.failedLogins.threshold,
      },
    },
  };
};
