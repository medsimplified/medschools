/*
  Warnings:

  - Made the column `slug` on table `course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "course" ALTER COLUMN "slug" SET NOT NULL;

-- CreateTable
CREATE TABLE "stripe_config" (
    "id" TEXT NOT NULL,
    "publishableKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "webhookSecret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripe_config_pkey" PRIMARY KEY ("id")
);
