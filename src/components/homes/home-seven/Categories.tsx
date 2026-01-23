import Image from "next/image";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  FaAssistiveListeningSystems,
  FaBalanceScale,
  FaBone,
  FaBrain,
  FaChild,
  FaEye,
  FaFlask,
  FaHeartbeat,
  FaHospitalUser,
  FaMedkit,
  FaPills,
  FaStethoscope,
  FaSun,
  FaUsers,
  FaVials,
  FaVirus,
  FaFemale
} from "@/lib/fontAwesomeIconsComplete";

import category_img1 from "@/assets/img/others/h7_categories_shape01.svg";
import category_img2 from "@/assets/img/others/h7_categories_shape02.svg";
import category_img3 from "@/assets/img/others/h7_categories_shape03.svg";
import category_img4 from "@/assets/img/others/h7_categories_shape04.svg";

// Data Structure for Medical Categories
interface DataType {
  id: number;
  icon: IconType;
  title: string;
  tag: string;
}

const categories_data: DataType[] = [
  { id: 1, icon: FaBrain, title: "Anatomy", tag: "12 Courses" },
  { id: 2, icon: FaFlask, title: "Biochemistry", tag: "8 Courses" },
  { id: 3, icon: FaHeartbeat, title: "Physiology", tag: "10 Courses" },
  { id: 4, icon: FaUsers, title: "Community Medicine", tag: "7 Courses" },
  { id: 5, icon: FaPills, title: "Pharmacology", tag: "15 Courses" },
  { id: 6, icon: FaVials, title: "Pathology", tag: "11 Courses" },
  { id: 7, icon: FaVirus, title: "Microbiology", tag: "9 Courses" },
  { id: 8, icon: FaBalanceScale, title: "Forensic Medicine", tag: "5 Courses" },
  { id: 9, icon: FaHospitalUser, title: "Clinical Postings", tag: "14 Courses" },
  { id: 10, icon: FaStethoscope, title: "OPD", tag: "6 Courses" },
  { id: 11, icon: FaAssistiveListeningSystems, title: "ENT", tag: "8 Courses" },
  { id: 12, icon: FaEye, title: "Ophthalmology", tag: "7 Courses" },
  { id: 13, icon: FaBrain, title: "Psychiatry", tag: "4 Courses" },
  { id: 14, icon: FaSun, title: "Dermatology", tag: "5 Courses" },
  { id: 15, icon: FaChild, title: "Pediatrics", tag: "12 Courses" },
  { id: 16, icon: FaMedkit, title: "Anesthesiology", tag: "3 Courses" },
  { id: 17, icon: FaBone, title: "Orthopaedics", tag: "6 Courses" },
  { id: 18, icon: FaFemale, title: "Obstetrics & Gynaecology", tag: "10 Courses" },
];

const Categories = () => {
  return (
    <section
      className="categories-area-three fix section-pt-140 section-pb-110 categories__bg"
      style={{ backgroundImage: `url(/assets/img/bg/categories_bg.jpg)` }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="section__title text-center mb-50">
              <span className="sub-title">Our Top Categories</span>
              <h2 className="title bold">Explore Medical Courses & Subjects</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {categories_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="categories__item-three text-center">
                <Link href="/courses" className="block p-4 border rounded-lg hover:shadow-lg transition">
                  <div className="icon text-4xl mb-3 text-blue-600">
                    <item.icon aria-hidden />
                  </div>
                  <span className="name block font-semibold mb-1">{item.title}</span>
                  <span className="courses text-gray-500">{item.tag}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Floating shapes */}
      <div className="categories__shape-wrap">
        <Image src={category_img1} alt="shape" className="rotateme" />
        <Image src={category_img2} alt="shape" data-aos="fade-down-left" data-aos-delay="400" />
        <Image src={category_img3} alt="shape" className="alltuchtopdown" />
        <Image src={category_img4} alt="shape" data-aos="fade-up-right" data-aos-delay="400" />
      </div>
    </section>
  );
};

export default Categories;
