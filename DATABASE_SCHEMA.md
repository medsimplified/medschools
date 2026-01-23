# Database Schema Documentation

**Database:** PostgreSQL  
**ORM:** Prisma  
**Schema File:** `prisma/schema.prisma`

---

## Table of Contents

1. [User Models](#user-models)
2. [Course Models](#course-models)
3. [Enrollment & Progress](#enrollment--progress)
4. [Quiz & Questions](#quiz--questions)
5. [Content Models](#content-models)
6. [Payment Models](#payment-models)
7. [Relationships Diagram](#relationships-diagram)

---

## User Models

### User
Main user account model for students, instructors, and admins.

```prisma
model User {
  id                    String    @id @default(cuid())
  name                  String
  email                 String    @unique
  emailVerified         DateTime?
  password              String
  image                 String?
  role                  String    @default("user")      // "user" | "instructor" | "admin"
  country               String?
  phone                 String?
  bio                   String?
  isActive              Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  instructor            Instructor?
  courses               Course[]
  enrollments           CourseEnrollment[]
  quizAttempts          QuizAttempt[]
  payments              Payment[]
  blogs                 Blog[]
}
```

**Indexes:**
- `email` (unique)
- `role`
- `createdAt`

---

### Instructor
Instructor profile and metadata.

```prisma
model Instructor {
  id                    String    @id @default(cuid())
  userId                String    @unique
  qualification         String?   // e.g., "MD", "MBBS", "PhD"
  experience            String?   // e.g., "5 years"
  specialization        String?
  certifications        String?
  bio                   String?
  profileImage          String?
  rating                Float     @default(5)
  totalStudents         Int       @default(0)
  totalCourses          Int       @default(0)
  isVerified            Boolean   @default(false)
  bankAccount           String?
  bankCode              String?
  payoutAccountId       String?   // Razorpay payout account reference (optional)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  courses               Course[]
  reviews               InstructorReview[]
}
```

---

## Course Models

### Course
Main course information and metadata.

```prisma
model Course {
  id                    String    @id @default(cuid())
  title                 String
  slug                  String    @unique
  description           String
  shortDescription      String?
  category              String?   // e.g., "NEETPG", "FMGE", "USMLE"
  subcategory           String?
  level                 String?   // "beginner" | "intermediate" | "advanced"
  thumbnail             String?   // Cloudinary image URL
  price                 Float
  discountedPrice       Float?
  currency              String    @default("USD")
  duration              Int?      // in hours
  lessons               Int?      // number of lessons
  students              Int       @default(0)
  rating                Float     @default(5)
  ratingCount           Int       @default(0)
  language              String    @default("English")
  isPublished           Boolean   @default(false)
  isFeatured            Boolean   @default(false)
  prerequisites         String?
  objectives            String?   // JSON array of learning objectives
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  instructorId          String
  instructor            Instructor @relation(fields: [instructorId], references: [id])
  lessons               Lesson[]
  enrollments           CourseEnrollment[]
  reviews               CourseReview[]
  quiz                  Quiz[]
  curriculumLinks       CurriculumCourseLink[]

  @@index([instructorId])
  @@index([category])
  @@index([isPublished])
}
```

---

### Lesson
Individual lessons/modules within a course.

```prisma
model Lesson {
  id                    String    @id @default(cuid())
  courseId              String
  title                 String
  description           String?
  content               String?   // HTML or markdown
  videoUrl              String?   // YouTube or Cloudinary
  videoThumbnail        String?
  duration              Int?      // in minutes
  order                 Int       // lesson order in course
  isPublished           Boolean   @default(false)
  resources             String?   // JSON array of resource URLs
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  course                Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  topics                Topic[]

  @@index([courseId])
}
```

---

## Enrollment & Progress

### CourseEnrollment
Student enrollment in a course.

```prisma
model CourseEnrollment {
  id                    String    @id @default(cuid())
  userId                String
  courseId              String
  enrollmentDate        DateTime  @default(now())
  completionDate        DateTime?
  status                String    @default("active")  // "active" | "completed" | "dropped"
  progress              Float     @default(0)         // 0-100%
  lastAccessedAt        DateTime  @default(now())
  paymentId             String?   // Link to payment record
  certificateIssued     Boolean   @default(false)
  certificateUrl        String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  course                Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  payment               Payment?  @relation(fields: [paymentId], references: [id])
  lessonProgress        LessonProgress[]

  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@index([status])
}
```

---

### LessonProgress
Track individual lesson completion.

```prisma
model LessonProgress {
  id                    String    @id @default(cuid())
  enrollmentId          String
  lessonId              String
  isCompleted           Boolean   @default(false)
  completedAt           DateTime?
  timeSpent             Int?      // in seconds
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  enrollment            CourseEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)

  @@unique([enrollmentId, lessonId])
}
```

---

## Quiz & Questions

### Quiz
Quiz/exam configuration for courses.

```prisma
model Quiz {
  id                    String    @id @default(cuid())
  courseId              String
  title                 String
  description           String?
  totalQuestions        Int
  passingScore          Int       @default(70)    // percentage
  duration              Int?      // in minutes
  allowRetakes          Boolean   @default(true)
  maxRetakes            Int       @default(3)
  shuffleQuestions      Boolean   @default(false)
  showAnswersAfter      Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  course                Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  questions             QuizQuestion[]
  attempts              QuizAttempt[]

  @@index([courseId])
}
```

---

### QuizQuestion (MCQ)
Multiple choice questions with explanations.

```prisma
model QuizQuestion {
  id                    String    @id @default(cuid())
  quizId                String
  question              String
  questionType          String    @default("multiple-choice") // "multiple-choice" | "true-false"
  questionImage         String?   // Cloudinary image URL
  optionA               String
  optionB               String
  optionC               String?
  optionD               String?
  correctOption         String    // "A" | "B" | "C" | "D"
  explanation           String?   // HTML content
  explanationImage      String?
  difficulty            String    @default("medium")  // "easy" | "medium" | "hard"
  topicId               String?
  order                 Int
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  quiz                  Quiz      @relation(fields: [quizId], references: [id], onDelete: Cascade)
  topic                 Topic?    @relation(fields: [topicId], references: [id])
  answers               QuizAnswer[]

  @@index([quizId])
  @@index([topicId])
}
```

---

### QuizAttempt
Student quiz attempt record.

```prisma
model QuizAttempt {
  id                    String    @id @default(cuid())
  userId                String
  quizId                String
  score                 Int       // 0-100
  correctAnswers        Int
  totalQuestions        Int
  attemptNumber         Int       @default(1)
  startedAt             DateTime  @default(now())
  submittedAt           DateTime?
  duration              Int?      // in seconds
  isPassed              Boolean   @default(false)
  createdAt             DateTime  @default(now())

  // Relations
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers               QuizAnswer[]

  @@index([userId])
}
```

---

### QuizAnswer
Student answer to a specific question.

```prisma
model QuizAnswer {
  id                    String    @id @default(cuid())
  attemptId             String
  questionId            String
  selectedOption        String?   // Student's chosen answer
  isCorrect             Boolean
  timeSpent             Int?      // in seconds

  // Relations
  attempt               QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question              QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@unique([attemptId, questionId])
}
```

---

## Content Models

### Blog
Blog posts by instructors/admins.

```prisma
model Blog {
  id                    String    @id @default(cuid())
  title                 String
  slug                  String    @unique
  description           String
  content               String    // HTML content
  thumbnail             String?
  authorId              String
  category              String?
  tags                  String?   // JSON array
  isPublished           Boolean   @default(false)
  publishedAt           DateTime?
  views                 Int       @default(0)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  author                User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

---

### LatestVideo
Video metadata for latest videos/news section.

```prisma
model LatestVideo {
  id                    String    @id @default(cuid())
  title                 String
  description           String?
  videoUrl              String?   // Cloudinary video URL
  youtubeUrl            String?   // YouTube link
  thumbnailUrl          String?   // Cloudinary image
  tag                   String?   // Category tag
  duration              Int?      // in seconds
  views                 Int       @default(0)
  createdAt             DateTime  @default(now())

  @@map("latestvideo")
}
```

---

### Subject & Chapter (Curriculum)
Educational curriculum structure.

```prisma
model Subject {
  id                    String    @id @default(cuid())
  name                  String    @unique
  description           String?
  chapters              SubjectChapter[]
}

model SubjectChapter {
  id                    String    @id @default(cuid())
  title                 String
  subjectId             String
  description           String?
  order                 Int?
  subject               Subject   @relation(fields: [subjectId], references: [id])
  topics                Topic[]

  @@unique([subjectId, title])
}

model Topic {
  id                    String    @id @default(cuid())
  title                 String
  chapterId             String
  description           String?
  order                 Int?
  chapter               SubjectChapter @relation(fields: [chapterId], references: [id])
  questions             QuizQuestion[]
}
```

---

### Curriculum Links
Map curriculum to courses.

```prisma
model CurriculumCourseLink {
  id                    String    @id @default(cuid())
  curriculumId          String    // Subject ID
  courseId              String
  course                Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  coverage              Float?    // Percentage coverage
  priority              Int?      // Coverage priority
  createdAt             DateTime  @default(now())

  @@unique([curriculumId, courseId])
}
```

---

## Payment Models

### Payment
Payment/transaction records.

```prisma
model Payment {
  id                    String    @id @default(cuid())
  userId                String
  courseId              String?
  amount                Float
  currency              String    @default("INR")
  paymentMethod         String?   // "razorpay" | "paypal" | etc.
  paymentReference      String?   @unique
  status                String    @default("pending")  // "pending" | "completed" | "failed" | "refunded"
  refundedAt            DateTime?
  refundAmount          Float?
  notes                 String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollments           CourseEnrollment[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

---

### RazorpayConfig
Store encrypted Razorpay API credentials.

```prisma
model RazorpayConfig {
  id            String   @id @default(cuid())
  keyId         String   @map("publishableKey")
  keySecret     String   @map("secretKey")
  webhookSecret String?  @map("webhookSecret")
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@map("stripe_config") // Table name retained for backward compatibility while storing Razorpay secrets
}
```

---

## Review Models

### CourseReview
Student reviews on courses.

```prisma
model CourseReview {
  id                    String    @id @default(cuid())
  courseId              String
  userId                String
  rating                Int       // 1-5
  comment               String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  // Relations
  course                Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([courseId, userId])
}

model InstructorReview {
  id                    String    @id @default(cuid())
  instructorId          String
  rating                Int       // 1-5
  comment               String?
  createdAt             DateTime  @default(now())

  // Relations
  instructor            Instructor @relation(fields: [instructorId], references: [id], onDelete: Cascade)
}
```

---

## Relationships Diagram

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ role            │──────┐
└─────────────────┘      │
        │                 │
        ├────────────┬────┴──→ ┌──────────────┐
        │            │         │  Instructor  │
        │            │         └──────────────┘
        │            │
        │            └────┐
        │                 ├─→ ┌──────────┐
        │                 │   │  Course  │
        │                 │   └──────────┘
        │                 │        │
        │                 │        ├──→ ┌────────┐
        │                 │        │    │ Lesson │
        │                 │        │    └────────┘
        │                 │        │
        │                 │        └──→ ┌──────┐
        │                 │             │ Quiz │
        │                 │             └──────┘
        │                 │                  │
        │                 └─→ ┌────────────────────┐
        │                     │ CourseEnrollment   │
        │                     └────────────────────┘
        │                              │
        │                              └──→ ┌──────────────┐
        │                                   │LessonProgress│
        │                                   └──────────────┘
        │
        ├──→ ┌─────────────┐
        │    │ QuizAttempt │
        │    └─────────────┘
        │          │
        │          └──→ ┌───────────┐
        │               │QuizAnswer │
        │               └───────────┘
        │
        ├──→ ┌─────────┐
        │    │ Payment │
        │    └─────────┘
        │
        └──→ ┌──────┐
             │ Blog │
             └──────┘
```

---

## Database Queries

### Get Course with All Content
```sql
SELECT c.*, 
       COUNT(DISTINCT e.id) as total_enrollments,
       AVG(cr.rating) as avg_rating
FROM "Course" c
LEFT JOIN "CourseEnrollment" e ON c.id = e."courseId"
LEFT JOIN "CourseReview" cr ON c.id = cr."courseId"
WHERE c.id = $1
GROUP BY c.id;
```

### Get Student Progress
```sql
SELECT 
  c.title,
  COUNT(l.id) as total_lessons,
  COUNT(CASE WHEN lp."isCompleted" = true THEN 1 END) as completed_lessons,
  ROUND(100.0 * COUNT(CASE WHEN lp."isCompleted" = true THEN 1 END) / 
        COUNT(l.id), 2) as progress_percent
FROM "CourseEnrollment" ce
JOIN "Course" c ON ce."courseId" = c.id
LEFT JOIN "Lesson" l ON c.id = l."courseId"
LEFT JOIN "LessonProgress" lp ON ce.id = lp."enrollmentId" AND l.id = lp."lessonId"
WHERE ce."userId" = $1
GROUP BY c.id, c.title;
```

### Get Quiz Performance by Student
```sql
SELECT 
  q.title,
  COUNT(qa.id) as total_attempts,
  AVG(qa.score) as avg_score,
  MAX(qa.score) as best_score,
  SUM(CASE WHEN qa."isPassed" = true THEN 1 ELSE 0 END) as passed_attempts
FROM "QuizAttempt" qa
JOIN "Quiz" q ON qa."quizId" = q.id
WHERE qa."userId" = $1
GROUP BY q.id, q.title;
```

---

## Maintenance & Performance

**Recommended Indexes:**
- `User(email)` - For login lookups
- `Course(instructorId, isPublished)` - For instructor dashboard
- `CourseEnrollment(userId, courseId)` - For enrollment lookups
- `QuizAttempt(userId, quizId)` - For student progress
- `Payment(userId, status)` - For payment queries

**Backup Strategy:**
- Daily automated backups via Render
- Weekly manual exports to S3
- Test restore procedures monthly

**Data Retention:**
- User data: Retain indefinitely (GDPR considerations)
- Payment logs: 7 years (financial compliance)
- Session logs: 90 days
- Deleted user data: 30-day grace period before purge

---

**Last Updated:** January 8, 2026  
**Prisma Version:** 6.19.0  
**Database:** PostgreSQL 14+
