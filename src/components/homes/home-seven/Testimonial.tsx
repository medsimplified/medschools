"use client"
import Image from "next/image";
import InjectableSvg from '@/hooks/InjectableSvg';
import SvgAnimation from '@/hooks/SvgAnimation';
import { useEffect, useState } from "react";

// Add a type for testimonials
interface TestimonialType {
	image: string;
	rating: number;
	studentName: string;
	text: string;
	youtubeUrl?: string;
}

const Testimonial = () => {
	const svgIconRef = SvgAnimation('/assets/img/others/h7_testimonial_img_shape.svg');
	const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);

	useEffect(() => {
		fetch("/api/testimonials")
			.then(res => res.json())
			.then(data => {
				// Ensure data is always an array
				if (Array.isArray(data)) {
					setTestimonials(data);
				} else if (data && typeof data === "object") {
					setTestimonials([data]);
				} else {
					setTestimonials([]);
				}
			})
			.catch(() => setTestimonials([]));
	}, []);

	return (
		<section className="testimonial__area-five section-pb-120">
			<div className="container">
				<div className="row">
					<div className="col-12 text-center mb-4">
						<h2 className="title" style={{ fontWeight: 700, fontSize: 32 }}>Our Student Testimonials</h2>
					</div>
				</div>
				<div className="row align-items-center justify-content-center">
					{testimonials.map((t, idx) => (
						<div className="col-xl-8 col-lg-10 col-md-10 mb-5" key={idx}>
							<div className="row align-items-center bg-white rounded-4 shadow p-4">
								<div className="col-md-4 text-center mb-4 mb-md-0">
									<div className="testimonial__img-three testimonial__img-four tg-svg" ref={svgIconRef}>
										<Image src={t.image} alt="img" width={180} height={180} style={{ borderRadius: "50%", objectFit: "cover" }} />
										<div className="banner__review" data-aos="fade-right" data-aos-delay="400">
											<div className="icon">
												<InjectableSvg src="/assets/img/icons/star.svg" alt="" className="injectable" />
											</div>
											<h6 className="title">{t.rating}/5 <span>Real Reviews</span></h6>
										</div>
										<div className="testimonial__img-icon">
											<InjectableSvg src="/assets/img/icons/quote02.svg" alt="" className="injectable" />
										</div>
										<span className="svg-icon"></span>
									</div>
								</div>
								<div className="col-md-8">
									<div className="testimonial__content-three testimonial__content-four">
										<div className="section__title mb-2">
											<span className="sub-title" style={{ fontWeight: 500, fontSize: 20 }}>{t.studentName}</span>
											<h2 className="title" style={{ fontSize: 16, marginBottom: 16, fontWeight: 400 }}>{t.text}</h2>
										</div>
										{t.rating && (
											<div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12, color: "#5dba47" }}>
												Rating: <span style={{ color: "#ffc107" }}>{typeof t.rating === "number" ? "★".repeat(Math.round(t.rating)) : t.rating}</span>
											</div>
										)}
										{t.youtubeUrl && (
											<a href={t.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-danger mb-2">
												Watch Testimonial Video
											</a>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
					{!testimonials.length && (
						<div className="col-12 text-center text-muted py-5">
							No testimonials found.
						</div>
					)}
				</div>
			</div>
		</section>
	)
}

export default Testimonial
