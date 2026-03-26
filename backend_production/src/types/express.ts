import { Request } from 'express';
import { User } from '@prisma/client';
import { TenantContext } from './tenant';

/**
 * Extended Express Request with authentication and tenant context
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: number;
  tenantContext?: TenantContext;
}

/**
 * Request with tenant context (may not be authenticated)
 */
export interface TenantRequest extends Request {
  tenantContext?: TenantContext;
}

/**
 * Authenticated request with required tenant context
 */
export interface AuthenticatedTenantRequest extends Request {
  user: User;
  userId: number;
  tenantContext: TenantContext;
}
