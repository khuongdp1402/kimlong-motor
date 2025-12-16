import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { scrapedBanners } from '../data/scraped-data';

// Filter valid banners and map to slide format
const validBanners = scrapedBanners.filter(b => b.image && !b.image.startsWith('data:'));

const heroSlides = validBanners.length > 0 ? validBanners.map(b => ({
    id: b.id,
    image: b.image,
    title: b.title || 'KIM LONG MOTOR',
    subtitle: b.subtitle || 'Giải pháp vận tải toàn diện',
    cta: 'Xem chi tiết',
    link: b.link || '#'
})) : [
    // Fallback if no banners scraped
    {
        id: 1,
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        title: 'XE KHÁCH GIƯỜNG NẰM CAO CẤP',
        subtitle: 'Tiện nghi - Sang trọng - An toàn',
        cta: 'Xem chi tiết',
        link: '/xe-khach-giuong-nam',
    }
];

const HeroSlider = () => {
    return (
        <div className="relative mt-20">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                loop={true}
                className="hero-swiper"
            >
                {heroSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950"></div>
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover opacity-40"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white px-4 max-w-4xl">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 uppercase tracking-wide">
                                        {slide.title}
                                    </h1>
                                    <p className="text-xl md:text-2xl mb-8 font-light">
                                        {slide.subtitle}
                                    </p>
                                    <a
                                        href={slide.link}
                                        className="inline-block bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        {slide.cta}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx>{`
        .hero-swiper :global(.swiper-button-next),
        .hero-swiper :global(.swiper-button-prev) {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .hero-swiper :global(.swiper-button-next):hover,
        .hero-swiper :global(.swiper-button-prev):hover {
          background: rgba(0, 0, 0, 0.7);
        }
        
        .hero-swiper :global(.swiper-button-next):after,
        .hero-swiper :global(.swiper-button-prev):after {
          font-size: 20px;
        }
        
        .hero-swiper :global(.swiper-pagination-bullet) {
          background: white;
          opacity: 0.7;
          width: 12px;
          height: 12px;
          transition: all 0.3s ease;
        }
        
        .hero-swiper :global(.swiper-pagination-bullet-active) {
          opacity: 1;
          background: #b91c1c;
        }
      `}</style>
        </div>
    );
};

export default HeroSlider;
