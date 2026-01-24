-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('FAMILY_FRIENDS', 'WEBSITE', 'YOUTUBE', 'ADVERTISEMENT', 'OTHER');

-- CreateTable
CREATE TABLE "career_applications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "referralSource" "ReferralSource" NOT NULL,
    "referralOther" TEXT,
    "resumeLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_applications_email_idx" ON "career_applications"("email");

-- CreateIndex
CREATE INDEX "career_applications_referralSource_idx" ON "career_applications"("referralSource");

-- CreateIndex
CREATE INDEX "career_applications_createdAt_idx" ON "career_applications"("createdAt");
