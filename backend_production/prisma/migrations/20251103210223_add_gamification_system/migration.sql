-- AlterTable
ALTER TABLE "User" ADD COLUMN "tier" TEXT NOT NULL DEFAULT 'Bronze';

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "badgeId" VARCHAR(50) NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tier" VARCHAR(20),

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adsWatched" INTEGER NOT NULL DEFAULT 0,
    "earningsCents" INTEGER NOT NULL DEFAULT 0,
    "loginStreak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChallenge" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" VARCHAR(50) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "target" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "totalEarnings" INTEGER NOT NULL,
    "tier" TEXT NOT NULL,
    "adsWatched" INTEGER NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserBadge_userId_idx" ON "UserBadge"("userId");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_userId_badgeId_key" ON "UserBadge"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "UserStat_userId_date_idx" ON "UserStat"("userId", "date");

-- CreateIndex
CREATE INDEX "UserStat_date_idx" ON "UserStat"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UserStat_userId_date_key" ON "UserStat"("userId", "date");

-- CreateIndex
CREATE INDEX "UserChallenge_userId_date_idx" ON "UserChallenge"("userId", "date");

-- CreateIndex
CREATE INDEX "UserChallenge_challengeId_idx" ON "UserChallenge"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallenge_userId_challengeId_date_key" ON "UserChallenge"("userId", "challengeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DemoUser_username_key" ON "DemoUser"("username");

-- CreateIndex
CREATE INDEX "DemoUser_tier_idx" ON "DemoUser"("tier");

-- CreateIndex
CREATE INDEX "DemoUser_totalEarnings_idx" ON "DemoUser"("totalEarnings");

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStat" ADD CONSTRAINT "UserStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallenge" ADD CONSTRAINT "UserChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
