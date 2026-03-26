-- CreateTable
CREATE TABLE "ApiCall" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,

    CONSTRAINT "ApiCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageBilling" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "totalCalls" INTEGER NOT NULL DEFAULT 0,
    "totalRevenueCents" INTEGER NOT NULL DEFAULT 0,
    "tierLimits" TEXT NOT NULL DEFAULT 'free',
    "billingStatus" TEXT NOT NULL DEFAULT 'pending',
    "stripeInvoiceId" TEXT,
    "billedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiUsageBilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeveloperAccount" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "billingTier" TEXT NOT NULL DEFAULT 'free',
    "apiQuota" INTEGER NOT NULL DEFAULT 1000,
    "currentUsage" INTEGER NOT NULL DEFAULT 0,
    "quotaResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overageAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeveloperAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiCall_apiKeyId_idx" ON "ApiCall"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiCall_tenantId_idx" ON "ApiCall"("tenantId");

-- CreateIndex
CREATE INDEX "ApiCall_timestamp_idx" ON "ApiCall"("timestamp");

-- CreateIndex
CREATE INDEX "ApiCall_endpoint_idx" ON "ApiCall"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsageBilling_tenantId_month_key" ON "ApiUsageBilling"("tenantId", "month");

-- CreateIndex
CREATE INDEX "ApiUsageBilling_tenantId_idx" ON "ApiUsageBilling"("tenantId");

-- CreateIndex
CREATE INDEX "ApiUsageBilling_month_idx" ON "ApiUsageBilling"("month");

-- CreateIndex
CREATE INDEX "ApiUsageBilling_billingStatus_idx" ON "ApiUsageBilling"("billingStatus");

-- CreateIndex
CREATE UNIQUE INDEX "DeveloperAccount_tenantId_key" ON "DeveloperAccount"("tenantId");

-- CreateIndex
CREATE INDEX "DeveloperAccount_tenantId_idx" ON "DeveloperAccount"("tenantId");

-- CreateIndex
CREATE INDEX "DeveloperAccount_billingTier_idx" ON "DeveloperAccount"("billingTier");

-- AddForeignKey
ALTER TABLE "ApiCall" ADD CONSTRAINT "ApiCall_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageBilling" ADD CONSTRAINT "ApiUsageBilling_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeveloperAccount" ADD CONSTRAINT "DeveloperAccount_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
