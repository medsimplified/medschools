/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `course` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "course_slug_key" ON "course"("slug");
