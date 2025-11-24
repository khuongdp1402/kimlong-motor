import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const heroSlides = [
    {
        id: 1,
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        title: 'XE KHÁCH GIƯỜNG NẰM CAO CẤP',
        subtitle: 'Tiện nghi - Sang trọng - An toàn',
        cta: 'Xem chi tiết',
        link: '/xe-khach-giuong-nam',
    },
    {
        id: 2,
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
        title: 'XE KHÁCH GHẾ NGỒI',
        subtitle: 'Rộng rãi - Thoải mái - Tiết kiệm',
        cta: 'Khám phá ngay',
        link: '/xe-khach-ghe-ngoi',
    },
    {
        id: 3,
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
        title: 'XE KHÁCH LIMOUSINE',
        subtitle: 'Đẳng cấp - Sang trọng - VIP',
        cta: 'Tìm hiểu thêm',
        link: '/xe-khach-limousine',
    },
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
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
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
                                        className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
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
