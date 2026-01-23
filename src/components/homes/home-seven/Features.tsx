import { IconType } from "react-icons";
import { FaFileMedical, FaUserMd, FaHeartbeat, FaStethoscope, FaGraduationCap } from "@/lib/fontAwesomeIconsComplete";

const feature_data: { id: number; icon: IconType; title: string; tag: string }[] = [
   {
      id: 1,
      icon: FaFileMedical, // FMGE icon
      title: "FMGE",
      tag: "Foreign Medical Graduate Exam.",
   },
   {
      id: 2,
      icon: FaUserMd, // NEETPG icon
      title: "NEETPG",
      tag: "National Eligibility Test for Post Graduation.",
   },
   {
      id: 3,
      icon: FaHeartbeat, // ECG icon
      title: "ECG",
      tag: "Electrocardiography courses.",
   },
   {
      id: 4,
      icon: FaStethoscope, // USMLE icon
      title: "USMLE",
      tag: "United States Medical Licensing Exam.",
   },
   {
      id: 5,
      icon: FaGraduationCap, // Nursing icon
      title: "Nursing",
      tag: "Nursing certification and exams.",
   },
   {
      id: 6,
      icon: FaStethoscope, // PLAB icon (same as USMLE for medical exam)
      title: "PLAB",
      tag: "Professional and Linguistic Assessments Board.",
   },
];

const Features = () => {
   return (
      <section className="features__area-seven grey-bg-two">
         <div className="container">
            <div className="features__item-wrap-four">
               <div className="row">
                  {feature_data.map((item) => (
                     <div key={item.id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="features__item-six">
                           <div className="features__icon-six">
                              <item.icon aria-hidden style={{ fontSize: "3rem" }} />
                           </div>
                           <div className="features__content-six">
                              <h4 className="title">{item.title}</h4>
                              <span>{item.tag}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}

export default Features;

