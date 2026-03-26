-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ad" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationSeconds" INTEGER NOT NULL,
    "rewardAmount" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchEvent" (
    "id" SERIAL NOT NULL,
    "adId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "watchedSeconds" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "platformFeeCents" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "referenceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutBatch" (
    "id" SERIAL NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutItem" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "PayoutItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WatchEvent_userId_adId_createdAt_idx" ON "WatchEvent"("userId", "adId", "createdAt");

-- CreateIndex
CREATE INDEX "WatchEvent_ip_createdAt_idx" ON "WatchEvent"("ip", "createdAt");

-- AddForeignKey
ALTER TABLE "PayoutItem" ADD CONSTRAINT "PayoutItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PayoutBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
