import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { products } from '../data/products';

// Lấy 4 sản phẩm đầu tiên làm slide khuyến mãi,
// toàn bộ ảnh đều đang trỏ về domain kimlongmiennam.com.vn trong products.js
const promoSlides = products.slice(0, 4).map((p) => ({
    id: p.id,
    image: p.image,
    title: p.name,
}));

const PromoCarousel = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase mb-6">
                    Khuyến mãi nổi bật
                </h2>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                    Các chương trình ưu đãi, hỗ trợ tài chính và quà tặng đặc biệt dành cho khách hàng khi mua xe tại Kim Long.
                </p>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    centeredSlides={true}
                    slidesPerView={1.2}
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2.3 },
                        1024: { slidesPerView: 3 },
                    }}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="promo-swiper"
                >
                    {promoSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            {({ isActive }) => (
                                <div
                                    className={`transition-all duration-500 transform ${
                                        isActive
                                            ? 'scale-100 shadow-2xl z-20'
                                            : 'scale-90 opacity-70 blur-[0.5px]'
                                    } bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700`}
                                >
                                    <div className="relative h-48 md:h-60 lg:h-64 overflow-hidden">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/800x400?text=Khuyen+mai+Kim+Long';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold uppercase tracking-wide mb-2">
                                                Khuyến mãi
                                            </span>
                                            <h3 className="text-white text-sm md:text-base font-semibold drop-shadow-md">
                                                {slide.title}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <style jsx>{`
                    .promo-swiper {
                        padding-bottom: 0.5rem;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default PromoCarousel;
