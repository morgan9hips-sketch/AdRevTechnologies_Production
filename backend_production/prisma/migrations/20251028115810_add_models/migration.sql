/*
  Warnings:

  - You are about to drop the `Ad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LedgerEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayoutBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PayoutItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WatchEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PayoutItem" DROP CONSTRAINT "PayoutItem_batchId_fkey";

-- DropTable
DROP TABLE "public"."Ad";

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."LedgerEntry";

-- DropTable
DROP TABLE "public"."PayoutBatch";

-- DropTable
DROP TABLE "public"."PayoutItem";

-- DropTable
DROP TABLE "public"."WatchEvent";
