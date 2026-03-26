-- AlterTable Ad - Add new fields
ALTER TABLE "Ad" ADD COLUMN "provider" TEXT;
ALTER TABLE "Ad" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "Ad" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable WatchEvent - Add Phase 4 anti-fraud fields
ALTER TABLE "WatchEvent" ADD COLUMN "networkEventId" INTEGER;
ALTER TABLE "WatchEvent" ADD COLUMN "uniqueWatchKey" TEXT;
ALTER TABLE "WatchEvent" ADD COLUMN "confirmedAt" TIMESTAMP(3);
ALTER TABLE "WatchEvent" ADD COLUMN "deviceId" TEXT;

-- Backfill uniqueWatchKey for existing records (generate UUIDs)
UPDATE "WatchEvent" SET "uniqueWatchKey" = gen_random_uuid()::text WHERE "uniqueWatchKey" IS NULL;

-- Make uniqueWatchKey required and unique after backfill
ALTER TABLE "WatchEvent" ALTER COLUMN "uniqueWatchKey" SET NOT NULL;
CREATE UNIQUE INDEX "WatchEvent_uniqueWatchKey_key" ON "WatchEvent"("uniqueWatchKey");

-- Add indexes for WatchEvent
CREATE INDEX "WatchEvent_uniqueWatchKey_idx" ON "WatchEvent"("uniqueWatchKey");
CREATE INDEX "WatchEvent_deviceId_idx" ON "WatchEvent"("deviceId");

-- AlterTable LedgerEntry - Enhance with Phase 4 fields
ALTER TABLE "LedgerEntry" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "LedgerEntry" ADD COLUMN "balanceAfter" INTEGER;
ALTER TABLE "LedgerEntry" ADD COLUMN "reference" TEXT;
ALTER TABLE "LedgerEntry" ADD COLUMN "feeCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "LedgerEntry" ADD COLUMN "metadata" JSONB;

-- Add indexes for LedgerEntry
CREATE INDEX "LedgerEntry_userId_createdAt_idx" ON "LedgerEntry"("userId", "createdAt");
CREATE INDEX "LedgerEntry_type_idx" ON "LedgerEntry"("type");

-- AlterTable PayoutBatch - Add Phase 4 fields
ALTER TABLE "PayoutBatch" RENAME COLUMN "totalAmount" TO "totalAmountCents";
ALTER TABLE "PayoutBatch" ADD COLUMN "createdByAdminId" INTEGER;
ALTER TABLE "PayoutBatch" ADD COLUMN "platformFeeCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "PayoutBatch" ADD COLUMN "executedAt" TIMESTAMP(3);

-- Add index for PayoutBatch
CREATE INDEX "PayoutBatch_createdByAdminId_idx" ON "PayoutBatch"("createdByAdminId");

-- AlterTable PayoutItem - Add Phase 4 fields
ALTER TABLE "PayoutItem" ADD COLUMN "recipientIdentifier" TEXT;
ALTER TABLE "PayoutItem" ADD COLUMN "feeCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "PayoutItem" ADD COLUMN "payoutReference" TEXT;
ALTER TABLE "PayoutItem" ADD COLUMN "executedAt" TIMESTAMP(3);
ALTER TABLE "PayoutItem" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add index for PayoutItem
CREATE INDEX "PayoutItem_batchId_idx" ON "PayoutItem"("batchId");

-- CreateTable AdNetworkEvent
CREATE TABLE "AdNetworkEvent" (
    "id" SERIAL NOT NULL,
    "adId" INTEGER,
    "network" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "revenueCents" INTEGER NOT NULL DEFAULT 0,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdNetworkEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdNetworkEvent_eventId_key" ON "AdNetworkEvent"("eventId");
CREATE INDEX "AdNetworkEvent_network_eventType_idx" ON "AdNetworkEvent"("network", "eventType");
CREATE INDEX "AdNetworkEvent_eventId_idx" ON "AdNetworkEvent"("eventId");
CREATE INDEX "AdNetworkEvent_adId_idx" ON "AdNetworkEvent"("adId");

-- CreateTable OfferConversion
CREATE TABLE "OfferConversion" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "offerId" TEXT NOT NULL,
    "offerName" TEXT,
    "network" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rewardCents" INTEGER NOT NULL,
    "payoutCents" INTEGER NOT NULL,
    "networkEventId" TEXT,
    "rawPayload" JSONB,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferConversion_networkEventId_key" ON "OfferConversion"("networkEventId");
CREATE INDEX "OfferConversion_userId_idx" ON "OfferConversion"("userId");
CREATE INDEX "OfferConversion_networkEventId_idx" ON "OfferConversion"("networkEventId");
CREATE INDEX "OfferConversion_status_idx" ON "OfferConversion"("status");

-- CreateTable DeviceFingerprint
CREATE TABLE "DeviceFingerprint" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "deviceId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userAgentHash" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceFingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceFingerprint_deviceId_key" ON "DeviceFingerprint"("deviceId");
CREATE INDEX "DeviceFingerprint_userId_idx" ON "DeviceFingerprint"("userId");
CREATE INDEX "DeviceFingerprint_deviceId_idx" ON "DeviceFingerprint"("deviceId");
CREATE INDEX "DeviceFingerprint_ipHash_idx" ON "DeviceFingerprint"("ipHash");

-- CreateTable FraudFlag
CREATE TABLE "FraudFlag" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" INTEGER,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FraudFlag_entityType_entityId_idx" ON "FraudFlag"("entityType", "entityId");
CREATE INDEX "FraudFlag_status_idx" ON "FraudFlag"("status");
CREATE INDEX "FraudFlag_score_idx" ON "FraudFlag"("score");

-- AddForeignKey
ALTER TABLE "AdNetworkEvent" ADD CONSTRAINT "AdNetworkEvent_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE SET NULL ON UPDATE CASCADE;
