import React, { useEffect, useState } from 'react';
import { getLandingBanner } from '../../api/client';
import Reveal from '../motion/Reveal';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';

const DEFAULT_SLIDES = [
    {
        image: '/media/showcase/img_sciene1.jpg',
        mobileImage: '/media/showcase/img_sciene1_9x16.jpg',
        title: 'Kim Long Motor',
        subtitle: 'Xe thương mại chính hãng — giường nằm, ghế ngồi, van, tải, đầu kéo',
        // Desktop: vehicle spans center-right → text goes bottom-left
        desktopTextPos: 'bottom-left',
    },
    {
        image: '/media/showcase/img_sciene2.jpg',
        mobileImage: '/media/showcase/img_sciene2_9x16.jpg',
        title: 'Đẳng Cấp Vượt Trội.\nVận Hành Êm Ái.',
        subtitle: 'Nội thất chuẩn Châu Âu, sẵn sàng cho mọi hành trình dài',
        desktopTextPos: 'bottom-left',
    },
    {
        image: '/media/showcase/img_sciene3.jpg',
        mobileImage: '/media/showcase/img_sciene3_9x16.jpg',
        title: 'Bền Bỉ Mọi Hành Trình.\nĐáng Tin Cậy.',
        subtitle: 'Đa dạng tải trọng, tối ưu chi phí vận hành cho doanh nghiệp',
        desktopTextPos: 'bottom-left',
    },
];

const LandingBanner = () => {
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [active, setActive] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getLandingBanner()
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) setSlides(data);
            })
            .catch(() => { /* keep defaults */ });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (slides.length < 2 || isPaused) return undefined;
        const timer = setInterval(() => {
            setActive((i) => (i + 1) % slides.length);
            setAnimKey((k) => k + 1);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length, isPaused]);

    const goTo = (i) => { setActive(i); setAnimKey((k) => k + 1); };
    const prev = () => goTo((active - 1 + slides.length) % slides.length);
    const next = () => goTo((active + 1) % slides.length);

    const scrollToProducts = () => {
        document.getElementById('san-pham')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const currentSlide = slides[active] || {};

    return (
        <>
            {/* ═══════════════════════════════════════════
                DESKTOP BANNER — panoramic, vehicle slides right
               ═══════════════════════════════════════════ */}
            <section
                className="hidden sm:block relative w-full h-[62vh] min-h-[420px] max-h-[600px] overflow-hidden bg-slate-900 select-none"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background images — NO overlay, vehicle drives right */}
                {slides.map((slide, i) => (
                    <img
                        key={`desktop-${slide.image}-${i}`}
                        src={slide.image}
                        alt={slide.title || ''}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                            i === active ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={i === active ? {
                            animation: `bannerDriveRight-${animKey} 6s cubic-bezier(0.25,0.1,0.25,1) both`,
                        } : undefined}
                    />
                ))}

                {/* Text panel — bottom-left, subtle scrim only behind text */}
                <div
                    key={`dt-${active}`}
                    className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-8 md:px-12 lg:px-16"
                    style={{
                        background:
                            'linear-gradient(to top, rgba(8,10,18,0.82) 0%, rgba(8,10,18,0.5) 45%, rgba(8,10,18,0) 100%)',
                    }}
                >
                    <div className="max-w-lg text-white">
                        <Reveal as="span" y={10} className="inline-block text-xs font-bold tracking-widest uppercase text-red-400 mb-3">
                            Kim Long Motor
                        </Reveal>
                        <Reveal as="h1" y={14} delay={0.06} className="text-2xl lg:text-3xl font-extrabold leading-tight whitespace-pre-line drop-shadow-md">
                            {currentSlide.title}
                        </Reveal>
                        <Reveal as="p" y={12} delay={0.12} className="mt-2 text-sm text-white/85 leading-relaxed max-w-[400px]">
                            {currentSlide.subtitle}
                        </Reveal>
                        <Reveal delay={0.18} className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                                onClick={scrollToProducts}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-lg cursor-pointer"
                            >
                                Xem danh mục xe
                            </button>
                            <a
                                href={`tel:${businessInfo.hotlineSalesRaw}`}
                                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors"
                            >
                                <Phone size={14} />
                                {businessInfo.hotlineSales}
                            </a>
                        </Reveal>
                        {slides.length > 1 && (
                            <div className="mt-5 flex gap-1.5">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i)}
                                        aria-label={`Banner ${i + 1}`}
                                        className={`h-[3px] rounded-full transition-all duration-400 cursor-pointer ${
                                            i === active ? 'w-7 bg-red-500' : 'w-3.5 bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Arrow nav */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Slide trước"
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Slide tiếp theo"
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}
            </section>

            {/* ═══════════════════════════════════════════
                MOBILE BANNER — image top, text below (no overlay)
               ═══════════════════════════════════════════ */}
            <section
                className="sm:hidden relative w-full bg-slate-900 select-none overflow-hidden"
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* Image area — uses the same panoramic image, cropped to show the vehicle */}
                <div className="relative w-full aspect-video overflow-hidden">
                    {slides.map((slide, i) => (
                        <img
                            key={`mobile-${slide.image}-${i}`}
                            src={slide.image}
                            alt={slide.title || ''}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                                i === active ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={i === active ? {
                                animation: `bannerDriveRight-${animKey} 6s cubic-bezier(0.25,0.1,0.25,1) both`,
                            } : undefined}
                        />
                    ))}

                    {/* Arrow nav on image */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                aria-label="Slide trước"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Slide tiếp theo"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </>
                    )}
                </div>

                {/* Text area — below the image, on a dark background */}
                <div
                    key={`mb-${active}`}
                    className="px-5 pt-4 pb-5 bg-slate-900"
                >
                    <Reveal as="span" y={8} className="inline-block text-[11px] font-bold tracking-widest uppercase text-red-400 mb-2">
                        Kim Long Motor
                    </Reveal>
                    <Reveal as="h1" y={12} delay={0.06} className="text-xl font-extrabold leading-tight whitespace-pre-line text-white">
                        {currentSlide.title}
                    </Reveal>
                    <Reveal as="p" y={10} delay={0.12} className="mt-2 text-sm text-white/75 leading-relaxed max-w-[340px]">
                        {currentSlide.subtitle}
                    </Reveal>
                    <Reveal delay={0.18} className="mt-4 flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={scrollToProducts}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-lg cursor-pointer"
                        >
                            Xem danh mục xe
                        </button>
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors"
                        >
                            <Phone size={12} />
                            {businessInfo.hotlineSales}
                        </a>
                    </Reveal>
                    {slides.length > 1 && (
                        <div className="mt-4 flex gap-1.5">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Banner ${i + 1}`}
                                    className={`h-[3px] rounded-full transition-all duration-400 cursor-pointer ${
                                        i === active ? 'w-7 bg-red-500' : 'w-3.5 bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Shared keyframe — subtle slide-right simulating vehicle driving */}
            <style>{`
                @keyframes bannerDriveRight-${animKey} {
                    from { transform: scale(1.04) translateX(-0.5%); }
                    to   { transform: scale(1.02) translateX(0.5%);  }
                }
            `}</style>
        </>
    );
};

export default LandingBanner;
