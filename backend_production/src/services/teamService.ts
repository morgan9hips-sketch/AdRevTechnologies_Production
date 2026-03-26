import { PrismaClient, TeamMember } from '@prisma/client';
import crypto from 'crypto';
import { logger, logBusinessEvent } from '../utils/logger';
import { CreateTeamMemberData, UpdateTeamMemberData, TeamInvitation } from '../types/tenant';

const prisma = new PrismaClient();

/**
 * Get all team members for a tenant
 */
export const getTeamMembers = async (tenantId: string): Promise<TeamMember[]> => {
  return prisma.teamMember.findMany({
    where: { tenantId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get a team member by ID
 */
export const getTeamMember = async (memberId: string): Promise<TeamMember | null> => {
  return prisma.teamMember.findUnique({
    where: { id: memberId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
};

/**
 * Get team member by invite token
 */
export const getTeamMemberByToken = async (token: string): Promise<TeamMember | null> => {
  return prisma.teamMember.findUnique({
    where: { inviteToken: token },
    include: {
      tenant: true,
    },
  });
};

/**
 * Create a team member invitation
 */
export const createTeamInvitation = async (
  data: CreateTeamMemberData
): Promise<TeamMember & { inviteLink: string }> => {
  // Check if email is already invited to this tenant
  const existing = await prisma.teamMember.findUnique({
    where: {
      tenantId_inviteEmail: {
        tenantId: data.tenantId,
        inviteEmail: data.inviteEmail,
      },
    },
  });

  if (existing && existing.inviteStatus === 'pending') {
    throw new Error('User is already invited to this tenant');
  }

  if (existing && existing.inviteStatus === 'accepted') {
    throw new Error('User is already a member of this tenant');
  }

  // Generate unique invite token
  const inviteToken = crypto.randomBytes(32).toString('hex');

  // Set expiration to 7 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create or update the team member
  const teamMember = await prisma.teamMember.upsert({
    where: {
      tenantId_inviteEmail: {
        tenantId: data.tenantId,
        inviteEmail: data.inviteEmail,
      },
    },
    create: {
      tenantId: data.tenantId,
      inviteEmail: data.inviteEmail,
      role: data.role,
      invitedBy: data.invitedBy,
      inviteToken,
      inviteStatus: 'pending',
      expiresAt,
    },
    update: {
      role: data.role,
      invitedBy: data.invitedBy,
      inviteToken,
      inviteStatus: 'pending',
      expiresAt,
    },
  });

  logBusinessEvent('team_invitation_created', {
    tenantId: data.tenantId,
    inviteEmail: data.inviteEmail,
    role: data.role,
    invitedBy: data.invitedBy,
  });

  logger.info(`Team invitation created for ${data.inviteEmail} to tenant ${data.tenantId}`);

  // Generate invite link
  const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/team/invite/${inviteToken}`;

  return {
    ...teamMember,
    inviteLink,
  };
};

/**
 * Accept a team invitation
 */
export const acceptInvitation = async (token: string, userId: number): Promise<TeamMember> => {
  const invitation = await prisma.teamMember.findUnique({
    where: { inviteToken: token },
  });

  if (!invitation) {
    throw new Error('Invalid invitation token');
  }

  if (invitation.inviteStatus !== 'pending') {
    throw new Error('Invitation is no longer valid');
  }

  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    // Mark as expired
    await prisma.teamMember.update({
      where: { id: invitation.id },
      data: { inviteStatus: 'expired' },
    });
    throw new Error('Invitation has expired');
  }

  // Update team member with user ID and mark as accepted
  const teamMember = await prisma.teamMember.update({
    where: { id: invitation.id },
    data: {
      userId,
      inviteStatus: 'accepted',
      acceptedAt: new Date(),
    },
  });

  logBusinessEvent('team_invitation_accepted', {
    tenantId: invitation.tenantId,
    userId,
    memberId: invitation.id,
  });

  logger.info(`Team invitation accepted by user ${userId} for tenant ${invitation.tenantId}`);

  return teamMember;
};

/**
 * Update team member role
 */
export const updateTeamMember = async (
  memberId: string,
  data: UpdateTeamMemberData
): Promise<TeamMember> => {
  const teamMember = await prisma.teamMember.update({
    where: { id: memberId },
    data,
  });

  logBusinessEvent('team_member_updated', {
    memberId,
    updates: Object.keys(data),
  });

  logger.info(`Team member ${memberId} updated`);

  return teamMember;
};

/**
 * Remove team member
 */
export const removeTeamMember = async (memberId: string): Promise<void> => {
  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new Error('Team member not found');
  }

  await prisma.teamMember.delete({
    where: { id: memberId },
  });

  logBusinessEvent('team_member_removed', {
    memberId,
    tenantId: member.tenantId,
  });

  logger.info(`Team member ${memberId} removed from tenant ${member.tenantId}`);
};

/**
 * Check if user has permission for a tenant
 */
export const getUserTeamRole = async (userId: number, tenantId: string): Promise<string | null> => {
  const member = await prisma.teamMember.findFirst({
    where: {
      userId,
      tenantId,
      inviteStatus: 'accepted',
    },
  });

  return member?.role || null;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (role: string, permission: string): boolean => {
  const rolePermissions: Record<string, string[]> = {
    owner: [
      'manage:team',
      'manage:billing',
      'manage:branding',
      'manage:settings',
      'write:ads',
      'read:ads',
      'read:analytics',
    ],
    admin: ['manage:team', 'manage:branding', 'write:ads', 'read:ads', 'read:analytics'],
    editor: ['write:ads', 'read:ads', 'read:analytics'],
    viewer: ['read:ads', 'read:analytics'],
  };

  return rolePermissions[role]?.includes(permission) || false;
};

/**
 * Resend invitation email
 */
export const resendInvitation = async (
  memberId: string
): Promise<TeamMember & { inviteLink: string }> => {
  const member = await prisma.teamMember.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new Error('Team member not found');
  }

  if (member.inviteStatus !== 'pending') {
    throw new Error('Can only resend pending invitations');
  }

  // Generate new token and extend expiration
  const inviteToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const updatedMember = await prisma.teamMember.update({
    where: { id: memberId },
    data: {
      inviteToken,
      expiresAt,
    },
  });

  logBusinessEvent('team_invitation_resent', {
    memberId,
    tenantId: member.tenantId,
  });

  logger.info(`Team invitation resent for member ${memberId}`);

  const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/team/invite/${inviteToken}`;

  return {
    ...updatedMember,
    inviteLink,
  };
};
