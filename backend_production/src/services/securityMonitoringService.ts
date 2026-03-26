/**
 * Enterprise Security Monitoring Service
 * Real-time threat detection and automated incident response
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { logSecurityEvent } from './auditService';
import { securityMonitoringConfig } from '../config/security';
import Redis from 'ioredis';

const prisma = new PrismaClient();

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  metadata: any;
  triggeredAt: Date;
  resolved: boolean;
}

interface ThreatSignature {
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'log' | 'alert' | 'block' | 'lockAccount';
  description: string;
}

interface GeolocationData {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  ipAddress: string;
}

export class SecurityMonitoringService {
  private redis: Redis;
  private alertQueue: SecurityAlert[] = [];
  private blockedIPs = new Set<string>();
  private suspiciousUsers = new Map<number, number>(); // userId -> suspicion score

  private threatSignatures: ThreatSignature[] = [
    {
      pattern: 'rapid_login_attempts',
      severity: 'high',
      action: 'block',
      description: 'Multiple failed login attempts detected',
    },
    {
      pattern: 'unusual_geolocation',
      severity: 'medium',
      action: 'alert',
      description: 'Login from unusual geographic location',
    },
    {
      pattern: 'admin_access_anomaly',
      severity: 'critical',
      action: 'alert',
      description: 'Unusual admin access pattern detected',
    },
    {
      pattern: 'data_exfiltration',
      severity: 'critical',
      action: 'block',
      description: 'Potential data exfiltration attempt',
    },
    {
      pattern: 'brute_force_attack',
      severity: 'high',
      action: 'block',
      description: 'Brute force attack detected',
    },
    {
      pattern: 'suspicious_api_usage',
      severity: 'medium',
      action: 'alert',
      description: 'Abnormal API usage pattern detected',
    },
  ];

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
    });

    // Initialize monitoring
    this.initializeMonitoring();
  }

  /**
   * Initialize security monitoring
   */
  private async initializeMonitoring(): Promise<void> {
    try {
      // Start real-time monitoring
      this.startFailedLoginMonitoring();
      this.startGeolocationMonitoring();
      this.startApiUsageMonitoring();
      this.startAdminAccessMonitoring();

      // Process alert queue periodically
      setInterval(() => this.processAlertQueue(), 30000); // Every 30 seconds

      logger.info('Security monitoring initialized');
    } catch (error) {
      logger.error('Failed to initialize security monitoring', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Monitor failed login attempts
   */
  async monitorFailedLogin(ipAddress: string, userEmail?: string, userId?: number): Promise<void> {
    try {
      const key = `failed_logins:${ipAddress}`;
      const current = await this.redis.get(key);
      const count = current ? parseInt(current) + 1 : 1;

      // Set with expiration
      await this.redis.setex(key, securityMonitoringConfig.failedLogins.timeWindow / 1000, count);

      // Check threshold
      if (count >= securityMonitoringConfig.failedLogins.threshold) {
        await this.triggerAlert({
          id: `failed_logins_${ipAddress}_${Date.now()}`,
          severity: 'high',
          type: 'failed_login_threshold',
          description: `IP ${ipAddress} exceeded failed login threshold`,
          metadata: {
            ipAddress,
            failedAttempts: count,
            userEmail,
            userId,
          },
          triggeredAt: new Date(),
          resolved: false,
        });

        // Automatic IP blocking
        if (securityMonitoringConfig.automatedBlocking.enabled) {
          await this.blockIP(ipAddress, securityMonitoringConfig.failedLogins.blockDuration);
        }
      }
    } catch (error) {
      logger.error('Failed login monitoring error', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Monitor geolocation anomalies
   */
  async monitorGeolocation(userId: number, ipAddress: string, userAgent: string): Promise<void> {
    try {
      if (!securityMonitoringConfig.suspiciousActivity.geolocationAnomaly.enabled) {
        return;
      }

      const currentLocation = await this.getGeolocation(ipAddress);
      if (!currentLocation) return;

      const lastLocationKey = `last_location:${userId}`;
      const lastLocationData = await this.redis.get(lastLocationKey);

      if (lastLocationData) {
        const lastLocation: GeolocationData = JSON.parse(lastLocationData);
        const distance = this.calculateDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          currentLocation.latitude,
          currentLocation.longitude
        );

        const maxDistance =
          securityMonitoringConfig.suspiciousActivity.geolocationAnomaly.maxDistanceKm;

        if (distance > maxDistance) {
          await this.triggerAlert({
            id: `geolocation_anomaly_${userId}_${Date.now()}`,
            severity: 'medium',
            type: 'geolocation_anomaly',
            description: `User ${userId} login from unusual location`,
            metadata: {
              userId,
              currentLocation,
              lastLocation,
              distance,
              ipAddress,
              userAgent,
            },
            triggeredAt: new Date(),
            resolved: false,
          });
        }
      }

      // Store current location
      await this.redis.setex(lastLocationKey, 30 * 24 * 60 * 60, JSON.stringify(currentLocation)); // 30 days
    } catch (error) {
      logger.error('Geolocation monitoring error', {
        userId,
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Monitor rapid requests (potential DDoS or abuse)
   */
  async monitorRapidRequests(ipAddress: string, endpoint: string): Promise<boolean> {
    try {
      const key = `rapid_requests:${ipAddress}`;
      const current = await this.redis.get(key);
      const count = current ? parseInt(current) + 1 : 1;

      // Set with short expiration
      await this.redis.setex(
        key,
        securityMonitoringConfig.suspiciousActivity.rapidRequests.timeWindow / 1000,
        count
      );

      const threshold = securityMonitoringConfig.suspiciousActivity.rapidRequests.threshold;

      if (count >= threshold) {
        await this.triggerAlert({
          id: `rapid_requests_${ipAddress}_${Date.now()}`,
          severity: 'high',
          type: 'rapid_requests',
          description: `Rapid requests detected from IP ${ipAddress}`,
          metadata: {
            ipAddress,
            requestCount: count,
            endpoint,
            threshold,
          },
          triggeredAt: new Date(),
          resolved: false,
        });

        // Temporary IP blocking
        await this.blockIP(ipAddress, 60 * 60 * 1000); // 1 hour

        return true; // Request should be blocked
      }

      return false; // Request allowed
    } catch (error) {
      logger.error('Rapid requests monitoring error', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Monitor admin access patterns
   */
  async monitorAdminAccess(userId: number, action: string, ipAddress: string): Promise<void> {
    try {
      const key = `admin_access:${userId}`;
      const accessLog = {
        action,
        ipAddress,
        timestamp: new Date().toISOString(),
      };

      // Get recent admin actions
      const recentActionsRaw = await this.redis.get(key);
      const recentActions = recentActionsRaw ? JSON.parse(recentActionsRaw) : [];

      recentActions.push(accessLog);

      // Keep only last 100 actions
      if (recentActions.length > 100) {
        recentActions.splice(0, recentActions.length - 100);
      }

      await this.redis.setex(key, 7 * 24 * 60 * 60, JSON.stringify(recentActions)); // 7 days

      // Analyze for suspicious patterns
      await this.analyzeAdminAccessPatterns(userId, recentActions);
    } catch (error) {
      logger.error('Admin access monitoring error', {
        userId,
        action,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Monitor API usage patterns
   */
  async monitorAPIUsage(apiKeyId: string, endpoint: string, responseTime: number): Promise<void> {
    try {
      const key = `api_usage:${apiKeyId}`;
      const now = new Date();
      const hour = now.getHours();

      const usageData = {
        endpoint,
        responseTime,
        timestamp: now.toISOString(),
        hour,
      };

      // Store hourly usage data
      const hourlyKey = `${key}:${now.toISOString().slice(0, 13)}`; // YYYY-MM-DDTHH
      await this.redis.lpush(hourlyKey, JSON.stringify(usageData));
      await this.redis.expire(hourlyKey, 24 * 60 * 60); // 24 hours

      // Analyze for suspicious patterns
      await this.analyzeAPIUsagePatterns(apiKeyId, endpoint, responseTime);
    } catch (error) {
      logger.error('API usage monitoring error', {
        apiKeyId,
        endpoint,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if IP is blocked
   */
  async isIPBlocked(ipAddress: string): Promise<boolean> {
    try {
      // Check local cache first
      if (this.blockedIPs.has(ipAddress)) {
        return true;
      }

      // Check Redis
      const blocked = await this.redis.get(`blocked_ip:${ipAddress}`);
      if (blocked) {
        this.blockedIPs.add(ipAddress);
        return true;
      }

      // Check whitelist
      const whitelistedIPs = securityMonitoringConfig.automatedBlocking.whitelistedIPs;
      if (whitelistedIPs.includes(ipAddress)) {
        return false;
      }

      return false;
    } catch (error) {
      logger.error('IP block check error', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
      return false; // Default to allow on error
    }
  }

  /**
   * Block IP address
   */
  async blockIP(ipAddress: string, duration: number): Promise<void> {
    try {
      // Add to local cache
      this.blockedIPs.add(ipAddress);

      // Store in Redis with expiration
      await this.redis.setex(`blocked_ip:${ipAddress}`, Math.floor(duration / 1000), 'blocked');

      await logSecurityEvent('ip_blocked', {
        ipAddress,
        duration,
        reason: 'automated_security_response',
      });

      logger.warn('IP address blocked', {
        ipAddress,
        duration,
      });

      // Send alert
      await this.triggerAlert({
        id: `ip_blocked_${ipAddress}_${Date.now()}`,
        severity: 'medium',
        type: 'ip_blocked',
        description: `IP ${ipAddress} automatically blocked`,
        metadata: {
          ipAddress,
          duration,
          reason: 'security_threshold_exceeded',
        },
        triggeredAt: new Date(),
        resolved: false,
      });
    } catch (error) {
      logger.error('IP blocking failed', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Unblock IP address
   */
  async unblockIP(ipAddress: string): Promise<void> {
    try {
      // Remove from local cache
      this.blockedIPs.delete(ipAddress);

      // Remove from Redis
      await this.redis.del(`blocked_ip:${ipAddress}`);

      await logSecurityEvent('ip_unblocked', {
        ipAddress,
        reason: 'manual_override',
      });

      logger.info('IP address unblocked', { ipAddress });
    } catch (error) {
      logger.error('IP unblocking failed', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get security alerts
   */
  async getSecurityAlerts(limit = 50): Promise<SecurityAlert[]> {
    try {
      // In a production environment, this would query a database
      // For now, returning recent alerts from the queue
      return this.alertQueue.slice(-limit);
    } catch (error) {
      logger.error('Failed to get security alerts', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Get security metrics
   */
  async getSecurityMetrics(): Promise<{
    blockedIPs: number;
    activeAlerts: number;
    suspiciousUsers: number;
    threatSignatures: number;
  }> {
    return {
      blockedIPs: this.blockedIPs.size,
      activeAlerts: this.alertQueue.filter((alert) => !alert.resolved).length,
      suspiciousUsers: this.suspiciousUsers.size,
      threatSignatures: this.threatSignatures.length,
    };
  }

  // Private helper methods

  private async triggerAlert(alert: SecurityAlert): Promise<void> {
    this.alertQueue.push(alert);

    await logSecurityEvent('security_alert_triggered', {
      alertId: alert.id,
      severity: alert.severity,
      type: alert.type,
      metadata: alert.metadata,
    });

    logger.warn('Security alert triggered', {
      alertId: alert.id,
      severity: alert.severity,
      type: alert.type,
      description: alert.description,
    });

    // Send notification based on severity
    if (alert.severity === 'critical' || alert.severity === 'high') {
      await this.sendImmediateNotification(alert);
    }
  }

  private async sendImmediateNotification(alert: SecurityAlert): Promise<void> {
    try {
      // In production, integrate with Slack, Teams, email, or SMS
      logger.error('SECURITY ALERT - IMMEDIATE ATTENTION REQUIRED', {
        alertId: alert.id,
        severity: alert.severity,
        type: alert.type,
        description: alert.description,
        metadata: alert.metadata,
      });

      // Placeholder for notification service integration
      // await notificationService.sendSecurityAlert(alert);
    } catch (error) {
      logger.error('Failed to send immediate notification', {
        alertId: alert.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async processAlertQueue(): Promise<void> {
    try {
      const unprocessed = this.alertQueue.filter((alert) => !alert.resolved);

      if (unprocessed.length > 0) {
        logger.info('Processing security alert queue', {
          totalAlerts: this.alertQueue.length,
          unprocessed: unprocessed.length,
        });
      }

      // In production, process alerts and update their status
      // For now, mark old alerts as resolved
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      this.alertQueue.forEach((alert) => {
        if (alert.triggeredAt < oneHourAgo && alert.severity === 'low') {
          alert.resolved = true;
        }
      });
    } catch (error) {
      logger.error('Failed to process alert queue', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private startFailedLoginMonitoring(): void {
    // Monitoring is triggered by auth attempts, no background process needed
    logger.info('Failed login monitoring started');
  }

  private startGeolocationMonitoring(): void {
    // Monitoring is triggered by login events, no background process needed
    logger.info('Geolocation monitoring started');
  }

  private startApiUsageMonitoring(): void {
    // Monitoring is triggered by API requests, no background process needed
    logger.info('API usage monitoring started');
  }

  private startAdminAccessMonitoring(): void {
    // Monitoring is triggered by admin actions, no background process needed
    logger.info('Admin access monitoring started');
  }

  private async analyzeAdminAccessPatterns(userId: number, recentActions: any[]): Promise<void> {
    // Analyze for suspicious patterns like off-hours access, unusual actions, etc.
    const suspiciousPatterns = [
      // Off-hours access (outside 9 AM - 6 PM business hours)
      recentActions.filter((action) => {
        const hour = new Date(action.timestamp).getHours();
        return hour < 9 || hour > 18;
      }),

      // Rapid consecutive actions
      recentActions.filter((action, index) => {
        if (index === 0) return false;
        const current = new Date(action.timestamp);
        const previous = new Date(recentActions[index - 1].timestamp);
        return current.getTime() - previous.getTime() < 10000; // Less than 10 seconds
      }),
    ];

    if (suspiciousPatterns.some((pattern) => pattern.length > 3)) {
      await this.triggerAlert({
        id: `admin_pattern_${userId}_${Date.now()}`,
        severity: 'medium',
        type: 'admin_access_anomaly',
        description: `Suspicious admin access pattern detected for user ${userId}`,
        metadata: {
          userId,
          suspiciousActions: suspiciousPatterns.flat(),
        },
        triggeredAt: new Date(),
        resolved: false,
      });
    }
  }

  private async analyzeAPIUsagePatterns(
    apiKeyId: string,
    endpoint: string,
    responseTime: number
  ): Promise<void> {
    // Analyze for unusual API usage patterns
    const key = `api_usage:${apiKeyId}`;
    const hourlyKey = `${key}:${new Date().toISOString().slice(0, 13)}`;

    const currentHourUsage = await this.redis.llen(hourlyKey);

    // Alert on excessive usage
    if (currentHourUsage > 1000) {
      await this.triggerAlert({
        id: `api_excessive_usage_${apiKeyId}_${Date.now()}`,
        severity: 'medium',
        type: 'suspicious_api_usage',
        description: `Excessive API usage detected for key ${apiKeyId}`,
        metadata: {
          apiKeyId,
          endpoint,
          hourlyUsage: currentHourUsage,
        },
        triggeredAt: new Date(),
        resolved: false,
      });
    }
  }

  private async getGeolocation(ipAddress: string): Promise<GeolocationData | null> {
    try {
      // In production, integrate with geolocation service like MaxMind or IPinfo
      // For now, return mock data
      return {
        country: 'US',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        ipAddress,
      };
    } catch (error) {
      logger.error('Geolocation lookup failed', {
        ipAddress,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.redis.quit();
    logger.info('Security monitoring service cleanup completed');
  }
}

export const securityMonitoringService = new SecurityMonitoringService();
