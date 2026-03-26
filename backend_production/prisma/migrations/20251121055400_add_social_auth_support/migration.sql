-- CreateEnum for AuthProvider
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB');

-- AlterTable User - Add social authentication and enhanced security fields
ALTER TABLE "User" 
  -- Make password nullable for social-only users
  ALTER COLUMN "password" DROP NOT NULL,
  
  -- Social Authentication
  ADD COLUMN "googleId" TEXT,
  ADD COLUMN "facebookId" TEXT,
  ADD COLUMN "githubId" TEXT,
  ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
  
  -- Profile Information
  ADD COLUMN "firstName" TEXT,
  ADD COLUMN "lastName" TEXT,
  ADD COLUMN "displayName" TEXT,
  ADD COLUMN "avatar" TEXT,
  ADD COLUMN "phoneNumber" TEXT,
  
  -- Email Verification (enhanced)
  ADD COLUMN "emailVerifyToken" TEXT,
  ADD COLUMN "emailVerifyExpires" TIMESTAMP(3),
  ADD COLUMN "emailVerifyAttempts" INTEGER NOT NULL DEFAULT 0,
  
  -- Password Management (enhanced)
  ADD COLUMN "passwordResetAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "passwordChangedAt" TIMESTAMP(3),
  ADD COLUMN "passwordHistory" JSONB,
  
  -- Security & Audit
  ADD COLUMN "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN "lastLoginIP" TEXT,
  ADD COLUMN "loginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3),
  ADD COLUMN "lockReason" TEXT,
  
  -- Preferences
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN "timezone" TEXT DEFAULT 'UTC',
  ADD COLUMN "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
  
  -- Soft Delete
  ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex for User social IDs
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
CREATE UNIQUE INDEX "User_emailVerifyToken_key" ON "User"("emailVerifyToken");

-- CreateIndex for User fields
CREATE INDEX "User_googleId_idx" ON "User"("googleId");
CREATE INDEX "User_facebookId_idx" ON "User"("facebookId");
CREATE INDEX "User_githubId_idx" ON "User"("githubId");
CREATE INDEX "User_provider_idx" ON "User"("provider");
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
CREATE INDEX "User_provider_email_idx" ON "User"("provider", "email");

-- AlterTable UserSession - Add OAuth support
ALTER TABLE "UserSession"
  ADD COLUMN "provider" TEXT DEFAULT 'email',
  ADD COLUMN "accessToken" TEXT,
  ADD COLUMN "refreshTokenOAuth" TEXT,
  ADD COLUMN "tokenExpiresAt" TIMESTAMP(3);

-- CreateIndex for UserSession provider
CREATE INDEX "UserSession_provider_idx" ON "UserSession"("provider");

-- AlterTable AuditLog - Add OAuth and severity fields
ALTER TABLE "AuditLog"
  ADD COLUMN "provider" TEXT DEFAULT 'email',
  ADD COLUMN "severity" TEXT NOT NULL DEFAULT 'info';

-- CreateIndex for AuditLog provider and severity
CREATE INDEX "AuditLog_provider_idx" ON "AuditLog"("provider");
CREATE INDEX "AuditLog_severity_idx" ON "AuditLog"("severity");

-- CreateTable OAuthState
CREATE TABLE "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "returnUrl" TEXT,
    "codeVerifier" TEXT,
    "nonce" TEXT,
    "tenantId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for OAuthState
CREATE UNIQUE INDEX "OAuthState_state_key" ON "OAuthState"("state");
CREATE INDEX "OAuthState_state_idx" ON "OAuthState"("state");
CREATE INDEX "OAuthState_provider_idx" ON "OAuthState"("provider");
CREATE INDEX "OAuthState_expiresAt_idx" ON "OAuthState"("expiresAt");
CREATE INDEX "OAuthState_tenantId_idx" ON "OAuthState"("tenantId");

-- CreateTable RateLimit
CREATE TABLE "RateLimit" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for RateLimit
CREATE UNIQUE INDEX "RateLimit_identifier_action_key" ON "RateLimit"("identifier", "action");
CREATE INDEX "RateLimit_identifier_idx" ON "RateLimit"("identifier");
CREATE INDEX "RateLimit_action_idx" ON "RateLimit"("action");
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
CREATE INDEX "RateLimit_tenantId_idx" ON "RateLimit"("tenantId");

-- CreateTable VerificationAttempt
CREATE TABLE "VerificationAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "failReason" TEXT,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for VerificationAttempt
CREATE INDEX "VerificationAttempt_userId_idx" ON "VerificationAttempt"("userId");
CREATE INDEX "VerificationAttempt_email_createdAt_idx" ON "VerificationAttempt"("email", "createdAt");
CREATE INDEX "VerificationAttempt_verificationType_idx" ON "VerificationAttempt"("verificationType");
CREATE INDEX "VerificationAttempt_tenantId_idx" ON "VerificationAttempt"("tenantId");
