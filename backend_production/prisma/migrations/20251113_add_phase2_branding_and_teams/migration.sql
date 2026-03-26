-- CreateTable
CREATE TABLE "TenantBranding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "logo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10B981',
    "accentColor" TEXT DEFAULT '#F59E0B',
    "fontFamily" TEXT DEFAULT 'Inter',
    "customCss" TEXT,
    "customDomain" TEXT,
    "subdomain" TEXT,
    "emailFrom" TEXT,
    "supportEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" INTEGER,
    "inviteEmail" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "inviteStatus" TEXT NOT NULL DEFAULT 'pending',
    "invitedBy" INTEGER,
    "inviteToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantBranding_tenantId_key" ON "TenantBranding"("tenantId");

-- CreateIndex
CREATE INDEX "TenantBranding_tenantId_idx" ON "TenantBranding"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_inviteToken_key" ON "TeamMember"("inviteToken");

-- CreateIndex
CREATE INDEX "TeamMember_tenantId_idx" ON "TeamMember"("tenantId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE INDEX "TeamMember_inviteToken_idx" ON "TeamMember"("inviteToken");

-- CreateIndex
CREATE INDEX "TeamMember_inviteStatus_idx" ON "TeamMember"("inviteStatus");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_tenantId_inviteEmail_key" ON "TeamMember"("tenantId", "inviteEmail");

-- AddForeignKey
ALTER TABLE "TenantBranding" ADD CONSTRAINT "TenantBranding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
