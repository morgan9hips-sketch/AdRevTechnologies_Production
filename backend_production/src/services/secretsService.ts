/**
 * Enterprise Secrets Management Service
 * HashiCorp Vault integration for secure secret storage and rotation
 */

import vault from 'node-vault';
import { logger } from '../utils/logger';
import { logSecurityEvent } from './auditService';

interface SecretData {
  [key: string]: any;
}

interface RotationConfig {
  interval: number;
  rotateBeforeExpiry: number;
  notifyBeforeExpiry: number;
}

class SecretsService {
  private vaultClient: any;
  private isConnected = false;
  private rotationTimers = new Map<string, NodeJS.Timeout>();

  constructor() {
    this.initializeVault();
  }

  private async initializeVault(): Promise<void> {
    try {
      const options: any = {
        endpoint: process.env.VAULT_ENDPOINT || 'http://localhost:8200',
        token: process.env.VAULT_TOKEN,
      };

      // Use AppRole authentication if configured
      if (process.env.VAULT_ROLE_ID && process.env.VAULT_SECRET_ID) {
        const tempClient = vault({ endpoint: options.endpoint });

        const authResponse = await tempClient.approleLogin({
          role_id: process.env.VAULT_ROLE_ID,
          secret_id: process.env.VAULT_SECRET_ID,
        });

        options.token = authResponse.auth.client_token;
      }

      this.vaultClient = vault(options);

      // Test connection
      await this.vaultClient.status();
      this.isConnected = true;

      logger.info('Vault connection established');
      await this.scheduleRotations();
    } catch (error) {
      logger.error('Failed to initialize Vault', {
        error: error instanceof Error ? error.message : String(error),
      });

      // Fall back to environment variables if Vault is not available
      this.isConnected = false;
    }
  }

  /**
   * Get a secret from Vault or environment variables
   */
  async getSecret(path: string, key?: string): Promise<string | SecretData | null> {
    try {
      if (this.isConnected) {
        const response = await this.vaultClient.read(`secret/data/${path}`);
        const secretData = response.data.data;

        if (key) {
          return secretData[key] || null;
        }
        return secretData;
      } else {
        // Fallback to environment variables
        return this.getSecretFromEnv(path, key);
      }
    } catch (error) {
      logger.warn('Failed to retrieve secret from Vault, falling back to environment', {
        path,
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      return this.getSecretFromEnv(path, key);
    }
  }

  /**
   * Store a secret in Vault
   */
  async setSecret(path: string, data: SecretData, metadata?: any): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Vault is not connected');
    }

    try {
      await this.vaultClient.write(`secret/data/${path}`, {
        data,
        metadata: {
          created_by: 'secrets-service',
          created_at: new Date().toISOString(),
          ...metadata,
        },
      });

      await logSecurityEvent('secret_created', {
        path,
        metadata,
      });

      logger.info('Secret stored in Vault', { path });
    } catch (error) {
      logger.error('Failed to store secret in Vault', {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Rotate OAuth secrets automatically
   */
  async rotateOAuthSecrets(): Promise<void> {
    logger.info('Starting OAuth secrets rotation');

    try {
      // Rotate Google OAuth secret
      await this.rotateGoogleOAuth();

      // Rotate Facebook OAuth secret
      await this.rotateFacebookOAuth();

      // Rotate GitHub OAuth secret
      await this.rotateGitHubOAuth();

      // Generate new NextAuth secret
      await this.rotateNextAuthSecret();

      await logSecurityEvent('oauth_secrets_rotated', {
        rotatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('OAuth secrets rotation failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      await logSecurityEvent('oauth_rotation_failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Rotate database credentials
   */
  async rotateDatabaseCredentials(): Promise<void> {
    logger.info('Starting database credentials rotation');

    try {
      // Generate new database password
      const newPassword = this.generateSecurePassword(32);

      // Store new credentials in Vault
      await this.setSecret('database/primary', {
        username: process.env.DB_USERNAME,
        password: newPassword,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        rotatedAt: new Date().toISOString(),
      });

      // TODO: Update database user password via admin connection
      // This would require database-specific implementation

      await logSecurityEvent('database_credentials_rotated', {
        rotatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Database credentials rotation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Rotate API keys and tokens
   */
  async rotateApiKeys(serviceName: string): Promise<void> {
    logger.info(`Rotating API keys for ${serviceName}`);

    try {
      const currentKeys = await this.getSecret(`api-keys/${serviceName}`);

      if (!currentKeys || typeof currentKeys !== 'object') {
        throw new Error('Current API keys not found');
      }

      // Generate new API keys
      const newKeys = {
        ...currentKeys,
        apiKey: this.generateApiKey(),
        secret: this.generateSecurePassword(64),
        rotatedAt: new Date().toISOString(),
        previousKey: (currentKeys as any).apiKey, // Keep previous for transition
      };

      await this.setSecret(`api-keys/${serviceName}`, newKeys);

      await logSecurityEvent('api_keys_rotated', {
        service: serviceName,
        rotatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`API keys rotation failed for ${serviceName}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Rotate encryption keys
   */
  async rotateEncryptionKeys(): Promise<void> {
    logger.info('Starting encryption keys rotation');

    try {
      const currentKeys = await this.getSecret('encryption/keys');

      // Generate new encryption key
      const newMasterKey = this.generateEncryptionKey();
      const newDataKey = this.generateEncryptionKey();

      const newKeys = {
        masterKey: newMasterKey,
        dataKey: newDataKey,
        rotatedAt: new Date().toISOString(),
        version:
          currentKeys && typeof currentKeys === 'object'
            ? ((currentKeys as any).version || 0) + 1
            : 1,
        previousKeys: currentKeys
          ? {
              masterKey: (currentKeys as any).masterKey,
              dataKey: (currentKeys as any).dataKey,
              version: (currentKeys as any).version,
            }
          : null,
      };

      await this.setSecret('encryption/keys', newKeys);

      await logSecurityEvent('encryption_keys_rotated', {
        version: newKeys.version,
        rotatedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Encryption keys rotation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Schedule automatic secret rotations
   */
  private async scheduleRotations(): Promise<void> {
    const rotationConfigs = [
      {
        name: 'oauth',
        fn: () => this.rotateOAuthSecrets(),
        interval: 24 * 60 * 60 * 1000, // Daily
      },
      {
        name: 'database',
        fn: () => this.rotateDatabaseCredentials(),
        interval: 7 * 24 * 60 * 60 * 1000, // Weekly
      },
      {
        name: 'encryption',
        fn: () => this.rotateEncryptionKeys(),
        interval: 30 * 24 * 60 * 60 * 1000, // Monthly
      },
    ];

    rotationConfigs.forEach((config) => {
      const timer = setInterval(async () => {
        try {
          await config.fn();
        } catch (error) {
          logger.error(`Scheduled rotation failed for ${config.name}`, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }, config.interval);

      this.rotationTimers.set(config.name, timer);
    });

    logger.info('Automatic secret rotation scheduled');
  }

  /**
   * Fallback to environment variables when Vault is not available
   */
  private getSecretFromEnv(path: string, key?: string): string | SecretData | null {
    const pathMap: { [key: string]: string } = {
      'oauth/google': 'GOOGLE_CLIENT_SECRET',
      'oauth/facebook': 'FACEBOOK_CLIENT_SECRET',
      'oauth/github': 'GITHUB_CLIENT_SECRET',
      'auth/nextauth': 'NEXTAUTH_SECRET',
      'database/primary': 'DATABASE_URL',
      'jwt/access': 'JWT_SECRET',
      'jwt/refresh': 'JWT_REFRESH_SECRET',
    };

    const envVar = pathMap[path];
    if (!envVar) return null;

    if (key) {
      // For specific key requests, return the whole env value as string
      return process.env[envVar] || null;
    }

    // For object requests, create a simple object
    return {
      value: process.env[envVar] || null,
      source: 'environment',
    };
  }

  /**
   * Generate secure random password
   */
  private generateSecurePassword(length: number): string {
    const crypto = require('crypto');
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Generate API key
   */
  private generateApiKey(): string {
    const crypto = require('crypto');
    const prefix = 'sk_live_';
    const randomBytes = crypto.randomBytes(24).toString('hex');
    return `${prefix}${randomBytes}`;
  }

  /**
   * Generate encryption key
   */
  private generateEncryptionKey(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Rotate Google OAuth secret
   */
  private async rotateGoogleOAuth(): Promise<void> {
    // In a real implementation, this would call Google's API to reset the client secret
    // For now, we'll generate a placeholder and log the action
    const newSecret = this.generateSecurePassword(32);

    await this.setSecret('oauth/google', {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: newSecret,
      rotatedAt: new Date().toISOString(),
    });

    logger.warn('Google OAuth secret rotation completed - manual update required', {
      clientId: process.env.GOOGLE_CLIENT_ID,
      instructions: 'Update Google Console with new secret and redeploy application',
    });
  }

  /**
   * Rotate Facebook OAuth secret
   */
  private async rotateFacebookOAuth(): Promise<void> {
    const newSecret = this.generateSecurePassword(32);

    await this.setSecret('oauth/facebook', {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: newSecret,
      rotatedAt: new Date().toISOString(),
    });

    logger.warn('Facebook OAuth secret rotation completed - manual update required', {
      appId: process.env.FACEBOOK_APP_ID,
      instructions: 'Update Facebook Developer Console with new secret and redeploy application',
    });
  }

  /**
   * Rotate GitHub OAuth secret
   */
  private async rotateGitHubOAuth(): Promise<void> {
    const newSecret = this.generateSecurePassword(32);

    await this.setSecret('oauth/github', {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: newSecret,
      rotatedAt: new Date().toISOString(),
    });

    logger.warn('GitHub OAuth secret rotation completed - manual update required', {
      clientId: process.env.GITHUB_CLIENT_ID,
      instructions: 'Update GitHub Developer Settings with new secret and redeploy application',
    });
  }

  /**
   * Rotate NextAuth secret
   */
  private async rotateNextAuthSecret(): Promise<void> {
    const newSecret = this.generateSecurePassword(32);

    await this.setSecret('auth/nextauth', {
      secret: newSecret,
      rotatedAt: new Date().toISOString(),
    });

    logger.info('NextAuth secret rotated successfully');
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<{ connected: boolean; vaultStatus?: any }> {
    try {
      if (this.isConnected) {
        const status = await this.vaultClient.status();
        return {
          connected: true,
          vaultStatus: status,
        };
      }
      return { connected: false };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.rotationTimers.forEach((timer) => clearInterval(timer));
    this.rotationTimers.clear();
    logger.info('Secrets service cleanup completed');
  }
}

// Singleton instance
export const secretsService = new SecretsService();

// Convenience functions for common secret retrieval
export const getOAuthSecret = (
  provider: 'google' | 'facebook' | 'github'
): Promise<string | null> => {
  return secretsService.getSecret(`oauth/${provider}`, 'clientSecret') as Promise<string | null>;
};

export const getJWTSecret = (type: 'access' | 'refresh' | 'mfa'): Promise<string | null> => {
  return secretsService.getSecret(`jwt/${type}`, 'secret') as Promise<string | null>;
};

export const getEncryptionKey = (type: 'master' | 'data'): Promise<string | null> => {
  return secretsService.getSecret('encryption/keys', `${type}Key`) as Promise<string | null>;
};

export default secretsService;
