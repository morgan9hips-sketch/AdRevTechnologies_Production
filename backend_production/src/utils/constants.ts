/**
 * Authentication Constants
 *
 * This file contains constant values used throughout the authentication system
 */

// Authentication Provider Constants
export const AUTH_PROVIDERS = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  GITHUB: 'GITHUB',
} as const;

// OAuth Provider Names (lowercase for URLs)
export const OAUTH_PROVIDER_NAMES = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  GITHUB: 'github',
} as const;

// Token Types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  OAUTH_STATE: 'oauth_state',
} as const;

// Authentication Actions
export const AUTH_ACTIONS = {
  // Email/Password Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGOUT_ALL: 'logout_all_devices',
  LOGIN_FAILED: 'login_failed',
  SIGNUP: 'user_signup',

  // OAuth Authentication
  OAUTH_LOGIN: 'oauth_login',
  OAUTH_LOGIN_FAILED: 'oauth_login_failed',
  OAUTH_LINK: 'oauth_link',
  OAUTH_UNLINK: 'oauth_unlink',

  // Password Management
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  PASSWORD_RESET_COMPLETE: 'password_reset_complete',

  // Email Verification
  EMAIL_VERIFY_REQUEST: 'email_verify_request',
  EMAIL_VERIFIED: 'email_verified',

  // Account Management
  ACCOUNT_LOCKED: 'account_locked',
  ACCOUNT_UNLOCKED: 'account_unlocked',
  ACCOUNT_DELETED: 'account_deleted',

  // Session Management
  SESSION_CREATED: 'session_created',
  SESSION_REVOKED: 'session_revoked',
  ALL_SESSIONS_REVOKED: 'all_sessions_revoked',

  // MFA
  MFA_ENABLED: 'mfa_enabled',
  MFA_DISABLED: 'mfa_disabled',
  MFA_VERIFIED: 'mfa_verified',
} as const;

// Rate Limit Action Types
export const RATE_LIMIT_ACTIONS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFY: 'email_verify',
  OAUTH: 'oauth',
  MFA_VERIFY: 'mfa_verify',
} as const;

// Verification Types
export const VERIFICATION_TYPES = {
  EMAIL: 'email',
  PHONE: 'phone',
  PASSWORD_RESET: 'password_reset',
} as const;

// Audit Log Severity Levels
export const SEVERITY_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

// Account Lockout Reasons
export const LOCKOUT_REASONS = {
  FAILED_ATTEMPTS: 'failed_login_attempts',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  ADMIN_ACTION: 'admin_action',
  FRAUD_DETECTION: 'fraud_detection',
} as const;

// Account Unlock Reasons
export const UNLOCK_REASONS = {
  AUTO: 'auto',
  ADMIN: 'admin',
  PASSWORD_RESET: 'password_reset',
  USER_REQUEST: 'user_request',
} as const;

// Password Validation Error Messages
export const PASSWORD_ERRORS = {
  TOO_SHORT: 'Password must be at least 8 characters long',
  NO_UPPERCASE: 'Password must contain at least one uppercase letter',
  NO_LOWERCASE: 'Password must contain at least one lowercase letter',
  NO_NUMBER: 'Password must contain at least one number',
  NO_SPECIAL: 'Password must contain at least one special character',
  PREVIOUSLY_USED: 'Password has been used previously',
  MATCHES_EMAIL: 'Password cannot be the same as your email',
  MATCHES_NAME: 'Password cannot contain your name',
  COMMON_PASSWORD: 'Password is too common',
} as const;

// Email Validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_EMAIL_LENGTH = 254;

// Password Requirements
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';

// Session Defaults
export const DEFAULT_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const DEFAULT_ACCESS_TOKEN_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const DEFAULT_REFRESH_TOKEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// OAuth Defaults
export const OAUTH_STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
export const OAUTH_STATE_LENGTH = 32;
export const OAUTH_NONCE_LENGTH = 32;

// Rate Limit Defaults
export const DEFAULT_RATE_LIMIT_MAX_ATTEMPTS = 5;
export const DEFAULT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Email Verification Defaults
export const EMAIL_VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
export const EMAIL_VERIFICATION_MAX_ATTEMPTS = 5;
export const EMAIL_RESEND_DELAY_MS = 60 * 1000; // 1 minute

// Password Reset Defaults
export const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
export const PASSWORD_RESET_MAX_ATTEMPTS = 3;
export const PASSWORD_RESET_RESEND_DELAY_MS = 5 * 60 * 1000; // 5 minutes

// Account Lockout Defaults
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Audit Log Retention
export const AUDIT_LOG_RETENTION_DAYS = 90;
export const LOGIN_ATTEMPT_RETENTION_DAYS = 30;
export const VERIFICATION_ATTEMPT_RETENTION_DAYS = 30;

// Cookie Names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  SESSION_ID: 'session_id',
  CSRF_TOKEN: 'csrf_token',
} as const;

// HTTP Header Names
export const HEADER_NAMES = {
  AUTHORIZATION: 'Authorization',
  CSRF_TOKEN: 'X-CSRF-Token',
  TENANT_ID: 'X-Tenant-ID',
  API_KEY: 'X-API-Key',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized',
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_LOCKED: 'Account is locked',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_EXPIRED: 'Token has expired',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  OAUTH_STATE_MISMATCH: 'OAuth state mismatch',
  OAUTH_ERROR: 'OAuth authentication failed',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_EMAIL: 'Invalid email address',
  WEAK_PASSWORD: 'Password does not meet requirements',
  PASSWORD_MISMATCH: 'Passwords do not match',
  ACCOUNT_NOT_FOUND: 'Account not found',
  TENANT_MISMATCH: 'User does not belong to this tenant',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_CHANGED: 'Password changed successfully',
  OAUTH_LINKED: 'Account linked successfully',
  OAUTH_UNLINKED: 'Account unlinked successfully',
  SESSION_REVOKED: 'Session revoked successfully',
} as const;

// User Preferences Defaults
export const DEFAULT_USER_PREFERENCES = {
  LANGUAGE: 'en',
  TIMEZONE: 'UTC',
  MARKETING_EMAILS: false,
} as const;

// Password History Limit
export const PASSWORD_HISTORY_LIMIT = 5;

// PKCE Constants
export const PKCE_CODE_VERIFIER_LENGTH = 128;
export const PKCE_CODE_CHALLENGE_METHOD = 'S256';

// Cross-Domain Constants
export const CROSS_DOMAIN_TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
