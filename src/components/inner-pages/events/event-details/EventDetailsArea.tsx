import Image from "next/image"
import EventDetailsSidebar from "./EventDetailsSidebar"
import Link from "next/link"
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaAngleRight } from "@/lib/fontAwesomeIconsComplete"

import event_details_img1 from "@/assets/img/events/event_details_img.jpg";
import event_details_img2 from "@/assets/img/courses/course_author001.png";
import event_details_img3 from "@/assets/img/events/event_details_img02.jpg";

const EventDetailsArea = () => {
  return (
    <section className="event__details-area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="event__details-thumb">
              <Image src={event_details_img1} alt="img" />
            </div>
            <div className="event__details-content-wrap">
              <div className="row">
                <div className="col-70">
                  <div className="event__details-content">
                    <div className="event__details-content-top">
                      <Link href="/courses" className="tag">Development</Link>
                      <span className="avg-rating"><FaStar aria-hidden />(4.8 Reviews)</span>
                    </div>
                    <h2 className="title">How To Become idiculously Self-Aware In 20 Minutes</h2>
                    <div className="event__meta">
                      <ul className="list-wrap">
                        <li className="author">
                          <Image src={event_details_img2} alt="img" />
                          By
                          <Link href="/instructor-details">David Millar</Link>
                        </li>
                        <li className="location"><FaMapMarkerAlt />LocationWashington DC, MI 2726</li>
                        <li><FaGraduationCap />2,250 Students</li>
                      </ul>
                    </div>
                    <div className="event__details-overview">
                      <h4 className="title-two">Event Overview</h4>
                      <p>Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.dolor sit amet, consectetur adipiscing elited do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                    <h4 className="title-two">What you&apos;ll learn in this event?</h4>
                    <p>Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan.</p>

                    <div className="event__details-inner">
                      <div className="row">
                        <div className="col-39">
                          <Image src={event_details_img3} alt="img" />
                        </div>
                        <div className="col-61">
                          <div className="event__details-inner-content">
                            <h4 className="title">Four major elements that we offer <br /> for this event</h4>
                            <ul className="about__info-list list-wrap">
                              <li className="about__info-list-item">
                                <FaAngleRight />
                                <p className="content">Work with color & Gradients & Grids</p>
                              </li>
                              <li className="about__info-list-item">
                                <FaAngleRight />
                                <p className="content">All the useful shortcuts</p>
                              </li>
                              <li className="about__info-list-item">
                                <FaAngleRight />
                                <p className="content">Be able to create Flyers, Brochures, Advertisements</p>
                              </li>
                              <li className="about__info-list-item">
                                <FaAngleRight />
                                <p className="content">How to work with Images & Text</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p>Morem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan.Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magn.</p>
                  </div>
                </div>
                <div className="col-30">
                  <EventDetailsSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventDetailsArea
