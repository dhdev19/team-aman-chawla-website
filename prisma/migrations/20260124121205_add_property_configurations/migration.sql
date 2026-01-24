-- CreateEnum
CREATE TYPE "PropertyFormat" AS ENUM ('APARTMENT', 'VILLA', 'PLOT', 'SHOP', 'OFFICE', 'PENTHOUSE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PropertyStatus" ADD VALUE 'FOR_SALE';
ALTER TYPE "PropertyStatus" ADD VALUE 'FOR_RENT';
ALTER TYPE "PropertyStatus" ADD VALUE 'UNDER_CONSTRUCTION';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "builderReraQrCode" TEXT,
ADD COLUMN     "format" "PropertyFormat",
ADD COLUMN     "mapImage" TEXT,
ADD COLUMN     "possession" TEXT,
ADD COLUMN     "projectLaunchDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "property_configurations" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "configType" TEXT NOT NULL,
    "carpetAreaSqft" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "floorPlanImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "property_configurations_propertyId_idx" ON "property_configurations"("propertyId");

-- AddForeignKey
ALTER TABLE "property_configurations" ADD CONSTRAINT "property_configurations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
