ALTER TABLE "User" ADD COLUMN "subscriptionPlan" TEXT DEFAULT 'none';
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT DEFAULT 'NONE';
ALTER TABLE "User" ADD COLUMN "subscriptionStart" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "subscriptionEnd" TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "paymentStatus" TEXT DEFAULT 'PENDING';
ALTER TABLE "User" ADD COLUMN "paymentId" TEXT;
ALTER TABLE "User" ADD COLUMN "hasActiveSubscription" BOOLEAN DEFAULT false;