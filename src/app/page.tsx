// import HomeEight from "@/components/homes/home-eight";
// import HomeFive from "@/components/homes/home-five";
// import HomeFour from "@/components/homes/home-four";
import HomeOne from "@/components/homes/home-one";
import HomeSeven from "@/components/homes/home-seven";
// import HomeSix from "@/components/homes/home-six";
// import HomeThree from "@/components/homes/home-three";
// import HomeTwo from "@/components/homes/home-two";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "MedSchool Simplified | Online Medical Learning Platform",
  description: "Streamline your medical school journey with expert-led courses, interactive MCQs, and curriculum planning tools tailored for aspiring doctors.",
  keywords: "medical courses, medschool simplified, online medical education, med school curriculum, usmle prep, medical student resources",
  openGraph: {
    title: "MedSchool Simplified | Online Medical Learning Platform",
    description: "Streamline your medical school journey with expert-led courses, interactive MCQs, and curriculum planning tools tailored for aspiring doctors.",
    type: "website",
  },
};

const index = () => {
  return (
    <Wrapper>
      <HomeOne />
    </Wrapper>
  )
}

export default index