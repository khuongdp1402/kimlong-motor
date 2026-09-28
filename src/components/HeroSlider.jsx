import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';

// Two hero slides — text side adapts to where the vehicle sits in the photo.
// Slide 1 (xe khách): vehicle is on the LEFT → text goes RIGHT
// Slide 2 (xe tải):   vehicle is on the RIGHT → text goes LEFT
const slides = [
    {
        id: 1,
        image: '/images/banners/banner-xekhach.jpg',
        mirror: false,
        textSide: 'right',   // vehicle is left, text is right
        eyebrow: 'Xe Khách Kim Long 99',
        title: 'Vận Hành Êm Ái.\nĐẳng Cấp Vượt Trội.',
        subtitle: 'Dòng xe khách giường nằm & xe ghế cao cấp, nội thất chuẩn Châu Âu — sẵn sàng cho mọi hành trình dài.',
        cta: 'Khám Phá Xe Khách',
        targetId: 'danh-muc-xe'
    },
    {
        id: 2,
        image: '/images/banners/banner-xetai.jpg',
        mirror: false,
        textSide: 'left',    // vehicle is right, text is left
        eyebrow: 'Xe Tải Kim Long',
        title: 'Bền Bỉ Mọi Hành Trình.\nVững Vàng Mọi Cung Đường.',
        subtitle: 'Xe tải tải trọng linh hoạt, động cơ mạnh mẽ tiết kiệm nhiên liệu — tối ưu chi phí vận hành cho doanh nghiệp.',
        cta: 'Khám Phá Xe Tải',
        targetId: 'danh-muc-xe'
    }
];

// Bottom stats row
const stats = [
    { value: '600+', label: 'Hecta tổ hợp nhà máy hiện đại' },
    { value: '50.000+', label: 'Xe/năm công suất thiết kế' },
    { value: 'Toàn Quốc', label: 'Hệ thống bảo hành & dịch vụ' }
];

const HeroSlider = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperRef, setSwiperRef] = useState(null);
    const [animKey, setAnimKey] = useState(0);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section id="hero" className="relative w-full h-screen min-h-[600px] max-h-[1000px] bg-gray-950 select-none">
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                loop={true}
                onSwiper={setSwiperRef}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.realIndex);
                    setAnimKey((k) => k + 1);
                }}
                className="hero-swiper w-full h-full"
            >
                {slides.map((slide, idx) => {
                    const isRight = slide.textSide === 'right';

                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden">
                                {/* Full-screen background image */}
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                    style={slide.mirror ? { transform: 'scaleX(-1)' } : undefined}
                                />

                                {/* Dark gradient — heavier on the TEXT side */}
                                <div className={`absolute inset-0 ${
                                    isRight
                                        ? 'bg-gradient-to-l from-black/80 via-black/40 to-black/10'
                                        : 'bg-gradient-to-r from-black/80 via-black/40 to-black/10'
                                }`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                {/* Text content — side depends on textSide config */}
                                <div
                                    key={`caption-${animKey}-${slide.id}`}
                                    className={`absolute inset-0 flex items-center ${isRight ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
                                        <div className={`max-w-2xl ${isRight ? 'ml-auto text-right' : ''}`}>
                                            {/* Eyebrow badge */}
                                            <span
                                                className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide mb-5"
                                                style={{ animation: 'heroSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}
                                            >
                                                {slide.eyebrow}
                                            </span>

                                            {/* Main headline */}
                                            <h1
                                                className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line"
                                                style={{ animation: 'heroSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both' }}
                                            >
                                                {slide.title}
                                            </h1>

                                            {/* Subtitle */}
                                            <p
                                                className={`mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed ${isRight ? 'ml-auto' : ''}`}
                                                style={{ animation: 'heroSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
                                            >
                                                {slide.subtitle}
                                            </p>

                                            {/* CTA pill button */}
                                            <div
                                                className={isRight ? 'flex justify-end' : ''}
                                                style={{ animation: 'heroSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
                                            >
                                                <button
                                                    onClick={() => scrollTo(slide.targetId)}
                                                    className={`mt-8 group inline-flex items-center gap-3 bg-white/95 hover:bg-white text-gray-900 font-semibold py-2 rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-all hover:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 cursor-pointer ${
                                                        isRight ? 'pr-6 pl-2 flex-row-reverse' : 'pl-6 pr-2'
                                                    }`}
                                                >
                                                    <span className="text-sm sm:text-base">{slide.cta}</span>
                                                    <span className={`w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center transition-transform ${
                                                        isRight ? 'group-hover:-translate-x-0.5 rotate-180' : 'group-hover:translate-x-0.5'
                                                    }`}>
                                                        <ArrowRight size={16} />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom-left stats row */}
                                <div className="hidden sm:flex absolute bottom-8 lg:bottom-10 left-0 w-full">
                                    <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10">
                                        <div className="flex items-end gap-8 lg:gap-12">
                                            {stats.map((stat, i) => (
                                                <div key={i} className="text-white">
                                                    <div className="text-xl lg:text-2xl font-black tracking-tight">{stat.value}</div>
                                                    <div className="mt-0.5 text-[11px] lg:text-xs text-gray-400 leading-snug max-w-[120px]">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom-right: slider navigation + progress */}
                                <div className="absolute bottom-8 lg:bottom-10 right-4 sm:right-6 lg:right-10 flex items-center gap-3">
                                    <button
                                        onClick={() => swiperRef?.slidePrev()}
                                        aria-label="Slide trước"
                                        className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => swiperRef?.slideNext()}
                                        aria-label="Slide tiếp theo"
                                        className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="hidden sm:flex items-center gap-3 ml-2">
                                        <div className="flex gap-1">
                                            {slides.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-[3px] rounded-full transition-all duration-500 ${
                                                        i === activeIndex ? 'w-8 bg-red-500' : 'w-4 bg-white/30'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-white text-sm font-bold tabular-nums">
                                            0{activeIndex + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            <style>{`
                @keyframes heroSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;
