-- Create RefreshToken table
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- Create LoginAttempt table
CREATE TABLE "LoginAttempt" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "userAgent" TEXT,
    "failReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");
CREATE INDEX "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");

-- Create AccountLockout table
CREATE TABLE "AccountLockout" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unlockAt" TIMESTAMP(3) NOT NULL,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT true,
    "unlockedAt" TIMESTAMP(3),
    "unlockReason" TEXT,

    CONSTRAINT "AccountLockout_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AccountLockout_userId_key" ON "AccountLockout"("userId");
CREATE INDEX "AccountLockout_userId_idx" ON "AccountLockout"("userId");
CREATE INDEX "AccountLockout_unlockAt_idx" ON "AccountLockout"("unlockAt");

-- Create UserSession table
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserSession_token_key" ON "UserSession"("token");
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");
CREATE INDEX "UserSession_token_idx" ON "UserSession"("token");
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");
CREATE INDEX "UserSession_isActive_idx" ON "UserSession"("isActive");

-- Create MFASettings table
CREATE TABLE "MFASettings" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "method" TEXT,
    "secret" TEXT,
    "phoneNumber" TEXT,
    "backupCodes" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MFASettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MFASettings_userId_key" ON "MFASettings"("userId");
CREATE INDEX "MFASettings_userId_idx" ON "MFASettings"("userId");

-- Create PasswordResetToken table
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- Alter AuditLog table to add new fields
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "ipAddress" TEXT;
ALTER TABLE "AuditLog" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;

-- Add indexes to AuditLog
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
