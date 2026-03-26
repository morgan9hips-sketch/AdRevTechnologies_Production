/*
  Warnings:

  - You are about to alter the column `rewardAmount` on the `Ad` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `amount` on the `PayoutBatch` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PayoutBatch` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `durationSeconds` to the `Ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `PayoutBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Payout" DROP CONSTRAINT "Payout_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payout" DROP CONSTRAINT "Payout_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PayoutBatch" DROP CONSTRAINT "PayoutBatch_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "durationSeconds" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "rewardAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PayoutBatch" DROP COLUMN "amount",
DROP COLUMN "userId",
ADD COLUMN     "totalAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hash",
DROP COLUMN "role",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Payout";

-- DropTable
DROP TABLE "public"."Session";

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchEvent" (
    "id" SERIAL NOT NULL,
    "adId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "watchedSeconds" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "referenceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutItem" ADD CONSTRAINT "PayoutItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "PayoutBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
