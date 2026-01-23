"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FaStar } from "@/lib/fontAwesomeIconsComplete";

interface DataType {
   id: number;
   desc: string;
   title: string;
   designation: string;
}[];

const testi_data: DataType[] = [
   {
      id: 1,
      desc: "“ Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.“",
      title: "Brooklyn Simmons",
      designation: "Student",
   },
   {
      id: 2,
      desc: "“ It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. “",
      title: "Brooklyn Simmons",
      designation: "Student",
   },
   {
      id: 3,
      desc: "“ Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. “",
      title: "Brooklyn Simmons",
      designation: "Student",
   },
];

const setting = {
   slidesPerView: 1,
   spaceBetween: 30,
   observer: true,
   observeParents: true,
   loop: true,
   breakpoints: {
      '1500': {
         slidesPerView: 1,
      },
      '1200': {
         slidesPerView: 1,
      },
      '992': {
         slidesPerView: 1,
         spaceBetween: 24,
      },
      '768': {
         slidesPerView: 1,
         spaceBetween: 24,
      },
      '576': {
         slidesPerView: 1,
      },
      '0': {
         slidesPerView: 1,
      },
   },
   pagination: {
      el: '.testimonial-pagination',
      clickable: true,
   },
}

const CommonTestimonial = () => {
   return (
      <Swiper {...setting} modules={[Pagination]} className="swiper-container testimonial-active-four">
         {testi_data.map((item) => (
            <SwiperSlide key={item.id} className="swiper-slide">
               <div className="testimonial__item-four">
                  <div className="rating">
                     <FaStar aria-hidden />
                     <FaStar aria-hidden />
                     <FaStar aria-hidden />
                     <FaStar aria-hidden />
                     <FaStar aria-hidden />
                  </div>
                  <p>{item.desc}</p>
                  <div className="testimonial__bottom-two">
                     <h4 className="title">{item.title}</h4>
                     <span>{item.designation}</span>
                  </div>
               </div>
            </SwiperSlide>
         ))}
         <div className="testimonial-pagination testimonial-pagination-two"></div>
      </Swiper>
   )
}

export default CommonTestimonial
