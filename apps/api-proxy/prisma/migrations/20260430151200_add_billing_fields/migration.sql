-- Add billing fields to Tenant
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT;
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "billingStatus" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3);
ALTER TABLE "public"."Tenant" ADD COLUMN IF NOT EXISTS "requestLimit" INTEGER NOT NULL DEFAULT 100;

-- Add request count fields to ApiKey
ALTER TABLE "public"."ApiKey" ADD COLUMN IF NOT EXISTS "requestCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."ApiKey" ADD COLUMN IF NOT EXISTS "requestCountReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
