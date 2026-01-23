import AboutUs from "@/components/inner-pages/about-us";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "About Us | MedSchool Simplified",
  description:
    "Discover MedSchool Simplified: our mission, vision, and the team dedicated to making medical education accessible and engaging for everyone. Learn more about our journey and commitment to simplifying medicine.",
  openGraph: {
    title: "About Us | MedSchool Simplified",
    description:
      "Discover MedSchool Simplified: our mission, vision, and the team dedicated to making medical education accessible and engaging for everyone. Learn more about our journey and commitment to simplifying medicine.",
    url: "https://medschoolsimplified.com/about-us",
    siteName: "MedSchool Simplified",
    images: [
      {
        url: "https://medschoolsimplified.com/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "MedSchool Simplified About Us",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | MedSchool Simplified",
    description:
      "Discover MedSchool Simplified: our mission, vision, and the team dedicated to making medical education accessible and engaging for everyone.",
    images: ["https://medschoolsimplified.com/og-image.jpg"], // Replace with your actual OG image URL
  },
};

const page = () => {
  return (
    <Wrapper>
      <AboutUs />
    </Wrapper>
  );
};

export default page;