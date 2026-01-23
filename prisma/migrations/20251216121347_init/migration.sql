/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Curriculum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LatestVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LegacyChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MCQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaidAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subtopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'instructor', 'course_uploader');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "LegacyChapter" DROP CONSTRAINT "LegacyChapter_courseVideoId_fkey";

-- DropForeignKey
ALTER TABLE "MCQ" DROP CONSTRAINT "MCQ_subtopicId_fkey";

-- DropForeignKey
ALTER TABLE "MCQ" DROP CONSTRAINT "MCQ_topicId_fkey";

-- DropForeignKey
ALTER TABLE "PaidAccess" DROP CONSTRAINT "PaidAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectChapter" DROP CONSTRAINT "SubjectChapter_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "Subtopic" DROP CONSTRAINT "Subtopic_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_chapterId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Banner";

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseVideo";

-- DropTable
DROP TABLE "Curriculum";

-- DropTable
DROP TABLE "LatestVideo";

-- DropTable
DROP TABLE "LegacyChapter";

-- DropTable
DROP TABLE "MCQ";

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "PaidAccess";

-- DropTable
DROP TABLE "ResetToken";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "SubjectChapter";

-- DropTable
DROP TABLE "Subtopic";

-- DropTable
DROP TABLE "Topic";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "latestvideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "tag" TEXT,
    "review" TEXT,
    "price" DOUBLE PRECISION,
    "lesson" INTEGER,
    "student" INTEGER,
    "page" TEXT,
    "thumb" TEXT,
    "youtubeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "latestvideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjectchapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "subjectchapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "pdfUrl" TEXT,
    "mcqUrl" TEXT,
    "caseStudyUrl" TEXT,
    "pdfAccess" "PdfAccessType",

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtopic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "mcqUrl" TEXT,
    "caseStudyUrl" TEXT,
    "pdfAccess" "PdfAccessType" NOT NULL DEFAULT 'VIEW',

    CONSTRAINT "subtopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "topicId" TEXT,
    "subtopicId" TEXT,
    "explanation" TEXT,

    CONSTRAINT "mcq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coursevideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "overview" TEXT,
    "pdfUrl" TEXT,
    "access" "PdfAccessType" NOT NULL DEFAULT 'VIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coursevideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legacychapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "timeStamp" TEXT NOT NULL,
    "courseVideoId" TEXT NOT NULL,

    CONSTRAINT "legacychapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'student',
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "fname" TEXT,
    "lname" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "university" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isNewUser" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionPlan" TEXT DEFAULT 'none',
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "paymentId" TEXT,
    "hasActiveSubscription" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'NONE',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resettoken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resettoken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paidaccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paidaccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "displayName" TEXT,
    "facebook" TEXT,
    "firstName" TEXT,
    "github" TEXT,
    "lastName" TEXT,
    "linkedin" TEXT,
    "phoneNumber" TEXT,
    "skill" TEXT,
    "twitter" TEXT,
    "userName" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "chapters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "introVideoUrl" TEXT,
    "mcqs" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "heading" TEXT NOT NULL,
    "subheading" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "thumb" TEXT,
    "instructors" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "image" TEXT NOT NULL,

    CONSTRAINT "blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumb" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjectchapter_subjectId_title_key" ON "subjectchapter"("subjectId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "topic_chapterId_title_key" ON "topic"("chapterId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE INDEX "otp_email_idx" ON "otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resettoken_token_key" ON "resettoken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "subjectchapter" ADD CONSTRAINT "subjectchapter_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "subjectchapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtopic" ADD CONSTRAINT "subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq" ADD CONSTRAINT "mcq_subtopicId_fkey" FOREIGN KEY ("subtopicId") REFERENCES "subtopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcq" ADD CONSTRAINT "mcq_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legacychapter" ADD CONSTRAINT "legacychapter_courseVideoId_fkey" FOREIGN KEY ("courseVideoId") REFERENCES "coursevideo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resettoken" ADD CONSTRAINT "resettoken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paidaccess" ADD CONSTRAINT "paidaccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum" ADD CONSTRAINT "curriculum_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
