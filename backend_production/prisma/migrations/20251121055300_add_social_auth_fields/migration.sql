-- AlterTable
ALTER TABLE "User" 
  ALTER COLUMN "password" DROP NOT NULL,
  ALTER COLUMN "name" DROP NOT NULL,
  ADD COLUMN "googleId" TEXT,
  ADD COLUMN "facebookId" TEXT,
  ADD COLUMN "githubId" TEXT,
  ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'email',
  ADD COLUMN "avatar" TEXT,
  ADD COLUMN "passwordResetToken" TEXT,
  ADD COLUMN "passwordResetExpires" TIMESTAMP(3),
  ADD COLUMN "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN "loginAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lockedUntil" TIMESTAMP(3),
  ADD COLUMN "passwordChangedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_facebookId_idx" ON "User"("facebookId");

-- CreateIndex
CREATE INDEX "User_githubId_idx" ON "User"("githubId");

-- CreateIndex
CREATE INDEX "User_passwordResetToken_idx" ON "User"("passwordResetToken");

-- CreateTable
CREATE TABLE "OAuthState" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "redirectUri" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthState_state_key" ON "OAuthState"("state");

-- CreateIndex
CREATE INDEX "OAuthState_state_idx" ON "OAuthState"("state");

-- CreateIndex
CREATE INDEX "OAuthState_expiresAt_idx" ON "OAuthState"("expiresAt");
