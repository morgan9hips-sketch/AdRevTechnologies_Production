import { Tenant, TenantBilling, ApiKey } from '@prisma/client';

/**
 * Tenant context for request handling
 */
export interface TenantContext {
  tenantId: string;
  tenant: Tenant;
  subdomain: string;
  customDomain?: string;
}

/**
 * Brand customization settings
 */
export interface BrandColors {
  primary: string;
  secondary: string;
  accent?: string;
  background?: string;
  text?: string;
}

/**
 * Tenant creation data
 */
export interface CreateTenantData {
  name: string;
  subdomain: string;
  customDomain?: string;
  brandColors?: BrandColors;
  logo?: string;
  appName?: string;
  adRevenueSplit?: number;
  payoutMinimum?: number;
  subscriptionTier?: string;
}

/**
 * Tenant update data
 */
export interface UpdateTenantData {
  name?: string;
  customDomain?: string;
  brandColors?: BrandColors;
  logo?: string;
  appName?: string;
  adRevenueSplit?: number;
  payoutMinimum?: number;
  subscriptionTier?: string;
  status?: string;
  isActive?: boolean;
}

/**
 * Subscription plan configuration
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in cents
  features: string[];
  limits: {
    maxUsers?: number;
    maxAds?: number;
    maxApiCalls?: number;
  };
}

/**
 * API Key creation data
 */
export interface CreateApiKeyData {
  tenantId: string;
  name: string;
  scopes: string[];
  rateLimit?: number;
  expiresAt?: Date;
}

/**
 * Tenant analytics data
 */
export interface TenantAnalytics {
  tenantId: string;
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number; // in cents
  totalPayouts: number; // in cents
  adsWatched: number;
  avgRevenuePerUser: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Cross-tenant analytics for platform admin
 */
export interface CrossTenantAnalytics {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalRevenue: number; // in cents
  totalPayouts: number; // in cents
  platformFees: number; // in cents
  period: {
    start: Date;
    end: Date;
  };
  topTenants: Array<{
    tenantId: string;
    name: string;
    revenue: number;
    users: number;
  }>;
}

/**
 * Tenant with related data
 */
export type TenantWithBilling = Tenant & {
  billing: TenantBilling | null;
};

export type TenantWithApiKeys = Tenant & {
  apiKeys: ApiKey[];
};

export type TenantFull = Tenant & {
  billing: TenantBilling | null;
  apiKeys: ApiKey[];
};

/**
 * Phase 2: Branding Types
 */
export interface CreateBrandingData {
  tenantId: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  customCss?: string;
  customDomain?: string;
  subdomain?: string;
  emailFrom?: string;
  supportEmail?: string;
}

export interface UpdateBrandingData {
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  customCss?: string;
  customDomain?: string;
  subdomain?: string;
  emailFrom?: string;
  supportEmail?: string;
}

/**
 * Phase 2: Team Management Types
 */
export interface CreateTeamMemberData {
  tenantId: string;
  inviteEmail: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invitedBy: number;
}

export interface UpdateTeamMemberData {
  role?: 'owner' | 'admin' | 'editor' | 'viewer';
  inviteStatus?: 'pending' | 'accepted' | 'expired';
}

export interface TeamInvitation {
  id: string;
  tenantId: string;
  inviteEmail: string;
  role: string;
  inviteToken: string;
  expiresAt: Date;
  tenantName: string;
}

export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer';

export const TEAM_ROLES: Record<TeamRole, { name: string; permissions: string[] }> = {
  owner: {
    name: 'Owner',
    permissions: [
      'manage:team',
      'manage:billing',
      'manage:branding',
      'manage:settings',
      'write:ads',
      'read:ads',
      'read:analytics',
    ],
  },
  admin: {
    name: 'Admin',
    permissions: ['manage:team', 'manage:branding', 'write:ads', 'read:ads', 'read:analytics'],
  },
  editor: {
    name: 'Editor',
    permissions: ['write:ads', 'read:ads', 'read:analytics'],
  },
  viewer: {
    name: 'Viewer',
    permissions: ['read:ads', 'read:analytics'],
  },
};
