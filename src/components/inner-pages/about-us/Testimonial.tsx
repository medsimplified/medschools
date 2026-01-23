"use client"
import Image, { StaticImageData } from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';

import testi_avatar1 from "@/assets/img/others/testi_author01.png"
import testi_avatar2 from "@/assets/img/others/testi_author02.png"
import testi_avatar3 from "@/assets/img/others/testi_author03.png"

interface DataType {
   id: number;
   avatar_thumb: StaticImageData;
   avatar_name: string;
   desc: string;
}[];

const testi_data: DataType[] = [
   {
      id: 1,
      avatar_thumb: testi_avatar1,
      avatar_name: "Wade Warren",
      desc: "“ when an unknown printer took alley ffferer area typey and scrambled to make a type specimen book hass”",
   },
   {
      id: 2,
      avatar_thumb: testi_avatar2,
      avatar_name: "Jenny Wilson",
      desc: "“ when an unknown printer took alley ffferer area typey and scrambled to make a type specimen book hass”",
   },
   {
      id: 3,
      avatar_thumb: testi_avatar3,
      avatar_name: "Guy Hawkin",
      desc: "“ when an unknown printer took alley ffferer area typey and scrambled to make a type specimen book hass”",
   },
   {
      id: 4,
      avatar_thumb: testi_avatar2,
      avatar_name: "Jenny Wilson",
      desc: "“ when an unknown printer took alley ffferer area typey and scrambled to make a type specimen book hass”",
   },
];

const setting = {
   slidesPerView: 3,
   spaceBetween: 30,
   observer: true,
   observeParents: true,
   loop: true,
   breakpoints: {
      '1500': {
         slidesPerView: 3,
      },
      '1200': {
         slidesPerView: 3,
      },
      '992': {
         slidesPerView: 3,
         spaceBetween: 24,
      },
      '768': {
         slidesPerView: 2,
         spaceBetween: 24,
      },
      '576': {
         slidesPerView: 1,
      },
      '0': {
         slidesPerView: 1,
      },
   },
   // Navigation arrows
   navigation: {
      nextEl: ".testimonial-button-next",
      prevEl: ".testimonial-button-prev",
   },
}

const Testimonial = ({ testimonials = [] }: { testimonials?: any[] }) => {
   const data = testimonials.length ? testimonials : testi_data;
   const [current, setCurrent] = useState(0);

   const item = data[current];

   return (
      <section className="testimonial__area section-py-120" style={{ background: "#eaf3e2" }}>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-8">
                  <div className="section__title text-center mb-40">
                     <h2 className="title" style={{ fontWeight: 700, fontSize: 32 }}>Our Student Testimonial</h2>
                  </div>
                  <div className="row align-items-center" style={{
                     background: "#fff",
                     borderRadius: 16,
                     boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                     maxWidth: 800,
                     margin: "0 auto",
                     padding: 32
                  }}>
                     <div className="col-md-4 text-center mb-4 mb-md-0">
                        <Image
                           src={item.avatar_thumb || item.image}
                           alt={item.avatar_name || item.studentName}
                           width={140}
                           height={140}
                           style={{ borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
                        />
                     </div>
                     <div className="col-md-8">
                        <div style={{ fontSize: 18, color: "#222", marginBottom: 20, minHeight: 80 }}>
                           <span style={{ fontSize: 32, color: "#7bb661", fontWeight: 700, marginRight: 8 }}>&ldquo;</span>
                           {item.desc || item.text}
                           <span style={{ fontSize: 32, color: "#7bb661", fontWeight: 700, marginLeft: 8 }}>&rdquo;</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4 }}>
                           {item.avatar_name || item.studentName}
                        </div>
                        {item.rating && (
                           <div style={{ marginBottom: 4 }}>
                              <span style={{ color: "#ffc107", fontWeight: 500 }}>
                                 {typeof item.rating === "number"
                                    ? "★".repeat(Math.round(item.rating))
                                    : item.rating}
                              </span>
                           </div>
                        )}
                        {item.youtubeUrl && (
                           <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-success"
                              style={{ marginBottom: 8 }}
                           >
                              Watch on YouTube
                           </a>
                        )}
                        <div className="d-flex justify-content-between mt-4">
                           <button
                              className="btn btn-outline-secondary"
                              disabled={current === 0}
                              onClick={() => setCurrent(c => Math.max(0, c - 1))}
                           >
                              Prev
                           </button>
                           <button
                              className="btn btn-outline-secondary"
                              disabled={current === data.length - 1}
                              onClick={() => setCurrent(c => Math.min(data.length - 1, c + 1))}
                           >
                              Next
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

export default Testimonial
