-- AlterTable
ALTER TABLE "PayoutBatch" ADD COLUMN "paypalBatchId" TEXT;

-- AlterTable
ALTER TABLE "PayoutItem" ADD COLUMN "paypalItemId" TEXT,
ADD COLUMN "transactionId" TEXT,
ADD COLUMN "errorMessage" TEXT,
ADD COLUMN "processedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PayoutBatch_paypalBatchId_key" ON "PayoutBatch"("paypalBatchId");

-- CreateIndex
CREATE INDEX "PayoutBatch_status_idx" ON "PayoutBatch"("status");

-- CreateIndex
CREATE INDEX "PayoutBatch_paypalBatchId_idx" ON "PayoutBatch"("paypalBatchId");

-- CreateIndex
CREATE INDEX "PayoutItem_userId_idx" ON "PayoutItem"("userId");

-- CreateIndex
CREATE INDEX "PayoutItem_status_idx" ON "PayoutItem"("status");

-- CreateIndex
CREATE INDEX "PayoutItem_paypalItemId_idx" ON "PayoutItem"("paypalItemId");
