-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "durationDays" INTEGER NOT NULL,
    "durationLabel" TEXT NOT NULL,
    "features" TEXT[] NOT NULL DEFAULT '{}',
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "highlight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_slug_key" ON "subscription_plan"("slug");

-- AddForeignKey
ALTER TABLE "subscription_plan" ADD CONSTRAINT "subscription_plan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default plans for backwards compatibility
INSERT INTO "subscription_plan" (
    "id", "slug", "title", "price", "currency", "durationDays", "durationLabel", "features", "isPopular", "isPublished", "displayOrder", "highlight"
) VALUES
    (
        'plan_monthly',
        'monthly',
        'Monthly Plan',
        2499,
        'INR',
        30,
        '/month',
        ARRAY[
            'Access to all video lectures',
            'Download PDF materials',
            'Advanced MCQ with explanations',
            'Case study practice',
            'Email support',
            'Mobile app access'
        ],
        false,
        true,
        1,
        NULL
    ),
    (
        'plan_quarterly',
        'quarterly',
        'Quarterly Plan',
        6999,
        'INR',
        90,
        '/3 months',
        ARRAY[
            'Everything in Monthly',
            'Save ₹500 per month',
            'Priority email support',
            'Progress tracking',
            'Download access for all PDFs',
            'Case study materials'
        ],
        true,
        true,
        2,
        'Best value'
    ),
    (
        'plan_yearly',
        'yearly',
        'Yearly Plan',
        24999,
        'INR',
        365,
        '/year',
        ARRAY[
            'Everything in Quarterly',
            'Best value - Save ₹5,000',
            '1-on-1 doubt clearing sessions',
            'Mock exams & assessments',
            'Personalized study plan',
            'Certificate of completion',
            '24/7 priority support'
        ],
        false,
        true,
        3,
        NULL
    );
