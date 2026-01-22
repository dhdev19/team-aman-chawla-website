-- CreateEnum
CREATE TYPE "BlogType" AS ENUM ('TEXT', 'VIDEO');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "type" "BlogType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "videoUrl" TEXT;

-- CreateIndex
CREATE INDEX "blogs_type_idx" ON "blogs"("type");
