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

export const metadata: Metadata = {
  title: "Bhanuprakash - Online Learning Platform",
  description: "Quality education and courses for your career growth",
  keywords: "education, online courses, learning platform",
  openGraph: {
    title: "Bhanuprakash - Online Learning Platform",
    description: "Quality education and courses for your career growth",
    url: process.env.NEXTAUTH_URL || "https://bhanuprakash.com",
    siteName: "Bhanuprakash",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhanuprakash - Online Learning Platform",
    description: "Quality education and courses for your career growth",
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
