-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_UPDATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tosAccepted" TIMESTAMP(3) NOT NULL,
    "privacyAccepted" TIMESTAMP(3) NOT NULL,
    "version" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYCData" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "KYCStatus" NOT NULL DEFAULT 'PENDING',
    "documents" JSONB,
    "adminNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KYCData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_token_key" ON "EmailVerification"("token");

-- CreateIndex
CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification"("email");

-- CreateIndex
CREATE INDEX "EmailVerification_token_idx" ON "EmailVerification"("token");

-- CreateIndex
CREATE INDEX "UserConsent_userId_idx" ON "UserConsent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KYCData_userId_key" ON "KYCData"("userId");

-- AddForeignKey
ALTER TABLE "UserConsent" ADD CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYCData" ADD CONSTRAINT "KYCData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
