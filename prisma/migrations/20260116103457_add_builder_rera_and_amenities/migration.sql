-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "builderReraNumber" TEXT;
