/**
 * Data Encryption Utilities
 * Provides encryption/decryption for sensitive data
 */

import crypto from 'crypto';
import { encryptionConfig } from '../config/security';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'dev_encryption_key_32_chars_long!';

// Ensure key is the correct length
function getEncryptionKey(): Buffer {
  if (ENCRYPTION_KEY.length < 32) {
    // In development, pad the key
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY must be at least 32 characters in production');
    }
    const paddedKey = ENCRYPTION_KEY.padEnd(32, '0');
    return Buffer.from(paddedKey);
  }
  return Buffer.from(ENCRYPTION_KEY.slice(0, 32));
}

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encryptPII(data: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(encryptionConfig.ivLength);

  const cipher = crypto.createCipheriv(encryptionConfig.algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive data using AES-256-GCM
 */
export function decryptPII(encryptedData: string): string {
  const key = getEncryptionKey();
  const parts = encryptedData.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(encryptionConfig.algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash sensitive data for storage (one-way)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Mask email for logs (preserve privacy)
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return '***@***';

  const maskedUsername =
    username.length > 2
      ? username.slice(0, 2) + '*'.repeat(Math.min(username.length - 2, 5))
      : '*'.repeat(username.length);

  return `${maskedUsername}@${domain}`;
}

/**
 * Mask phone number for logs
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '***';
  return '***' + phone.slice(-4);
}

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Generate OAuth state with PKCE challenge
 */
export function generateOAuthState(): {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
} {
  const state = crypto.randomBytes(32).toString('base64url');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  return { state, codeVerifier, codeChallenge };
}

/**
 * Verify HMAC signature (for webhooks)
 */
export function verifyHMAC(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * Create HMAC signature
 */
export function createHMAC(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
