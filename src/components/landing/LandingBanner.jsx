import React, { useEffect, useState } from 'react';
import { getLandingBanner } from '../../api/client';
import Reveal from '../motion/Reveal';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';

const DEFAULT_SLIDES = [
    {
        image: '/media/showcase/img_sciene1_9x16.jpg',
        title: 'Kim Long Motor',
        subtitle: 'Xe thương mại chính hãng — giường nằm, ghế ngồi, van, tải, đầu kéo',
    },
    {
        image: '/media/showcase/img_sciene2_9x16.jpg',
        title: 'Bền bỉ. Tiết kiệm.\nĐáng tin cậy.',
        subtitle: 'Đa dạng tải trọng, đa dạng nhu cầu vận chuyển',
    },
    {
        image: '/media/showcase/img_sciene3_9x16.jpg',
        title: 'Tư vấn & báo giá nhanh',
        subtitle: 'Để lại số điện thoại, chúng tôi liên hệ ngay',
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

    return (
        <section
            className="relative w-full aspect-[9/16] sm:aspect-auto sm:h-[62vh] sm:min-h-[420px] sm:max-h-[600px] overflow-hidden bg-slate-900 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background images — fully clear, no overlay on the photo itself */}
            {slides.map((slide, i) => (
                <img
                    key={slide.image + i}
                    src={slide.image}
                    alt={slide.title || ''}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                        i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={i === active ? {
                        animation: `bannerDrive 6s cubic-bezier(0.25,0.1,0.25,1) both`,
                        animationName: `bannerDrive-${animKey}`,
                    } : undefined}
                />
            ))}

            {/* Text panel — pinned to the bottom, overlapping the lower part of the
                photo. The scrim lives ONLY here (fading up to fully transparent),
                so the image itself stays overlay-free. */}
            <div
                key={active}
                className="absolute inset-x-0 bottom-0 pt-28 sm:pt-24 pb-7 sm:pb-8 px-5 sm:px-8 md:px-12 lg:px-16"
                style={{
                    background:
                        'linear-gradient(to top, rgba(8,10,18,0.92) 0%, rgba(8,10,18,0.75) 38%, rgba(8,10,18,0.32) 68%, rgba(8,10,18,0) 100%)'
                }}
            >
                <div className="max-w-md text-white">
                    {/* Eyebrow */}
                    <Reveal as="span" y={10} className="inline-block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-red-400 mb-3">
                        Kim Long Motor
                    </Reveal>

                    {/* Title */}
                    <Reveal as="h1" y={14} delay={0.06} className="text-2xl sm:text-4xl font-extrabold leading-tight whitespace-pre-line drop-shadow-md">
                        {slides[active]?.title}
                    </Reveal>

                    {/* Subtitle */}
                    <Reveal as="p" y={12} delay={0.12} className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed max-w-[360px]">
                        {slides[active]?.subtitle}
                    </Reveal>

                    {/* CTAs */}
                    <Reveal delay={0.18} className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            onClick={scrollToProducts}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-lg"
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

                    {/* Dot indicators sit under the CTAs, inside the text panel */}
                    {slides.length > 1 && (
                        <div className="mt-6 flex gap-1.5">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Banner ${i + 1}`}
                                    className={`h-[3px] rounded-full transition-all duration-400 ${
                                        i === active ? 'w-7 bg-red-500' : 'w-3.5 bg-white/40'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Arrow nav — only when multiple slides */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Slide trước"
                        className="absolute left-3 sm:left-5 top-[38%] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Slide tiếp theo"
                        className="absolute right-3 sm:right-5 top-[38%] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <ChevronRight size={18} />
                    </button>
                </>
            )}

            {/* Keyframe: zoom-out từ scale(1.12) + dịch trái → scale(1) + dịch phải, giống xe đang lao qua */}
            <style>{`
                ${slides.map((_, i) =>
                    `@keyframes bannerDrive-${animKey} {
                        from { transform: scale(1.12) translateX(-2%); }
                        to   { transform: scale(1.00) translateX(3%);  }
                    }`
                ).join('\n')}
            `}</style>
        </section>
    );
};

export default LandingBanner;
