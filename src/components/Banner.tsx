import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

interface Banner {
  id: number
  heading: string
  subheading: string
  buttonText: string
  buttonLink: string
  youtubeUrl: string
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : url
}

export default function Banner() {
  const [banners, setBanners] = useState<Banner[]>([])

  useEffect(() => {
    fetch('/api/banner-videos') // <-- FIXED
      .then(res => res.json())
      .then(setBanners)
  }, [])

  if (!banners.length) return null

  return (
    <section className="banner">
      <Swiper loop={true} autoplay={{ delay: 5000 }}>
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="banner-content">
              <h1>{banner.heading}</h1>
              <p>{banner.subheading}</p>
              <a href={banner.buttonLink} className="btn" target="_blank" rel="noopener noreferrer">{banner.buttonText}</a>
            </div>
            <div className="banner-video">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${getYoutubeId(banner.youtubeUrl)}`}
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

