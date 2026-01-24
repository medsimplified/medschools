// filepath: src/app/layout.tsx
/* eslint-disable @next/next/no-css-tags */
import "../styles/main.css";
import "../styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-modal-video/css/modal-video.css";
import "swiper/css/bundle";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ClientLayout from "./ClientLayout";
import type { Metadata } from "next";
import { generateOrganizationSchema } from "@/lib/schema";

const defaultSiteUrl = process.env.NEXTAUTH_URL || "https://medschoolsimplified.org";

export const metadata: Metadata = {
  title: "MedSchool Simplified | Online Medical Learning Platform",
  description: "Streamline your medical school journey with expert-led courses, interactive MCQs, and curriculum planning tools tailored for aspiring doctors.",
  keywords: "medical courses, medschool simplified, online medical education, med school curriculum, usmle prep",
  metadataBase: new URL(defaultSiteUrl),
  openGraph: {
    title: "MedSchool Simplified | Online Medical Learning Platform",
    description: "Streamline your medical school journey with expert-led courses, interactive MCQs, and curriculum planning tools tailored for aspiring doctors.",
    url: defaultSiteUrl,
    siteName: "MedSchool Simplified",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedSchool Simplified | Online Medical Learning Platform",
    description: "Streamline your medical school journey with expert-led courses, interactive MCQs, and curriculum planning tools tailored for aspiring doctors.",
  },
  alternates: {
    canonical: defaultSiteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <link rel="stylesheet" href="/assets/css/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/aos.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/default-icons.css" />
        <link rel="stylesheet" href="/assets/css/flaticon-skillgro-new.css" />
        <link rel="stylesheet" href="/assets/css/flaticon-skillgro.css" />
        <link rel="stylesheet" href="/assets/css/spacing.css" />
        <link rel="stylesheet" href="/assets/css/plyr.css" />
        <link rel="stylesheet" href="/assets/css/tg-cursor.css" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
