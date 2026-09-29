import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { getTestimonials } from '../api/client';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';

// Curated handover photos. Not taken from the /photoStrip API because some of
// its images carry another dealer's logo, hotline and website baked in.
const HANDOVER_PHOTOS = [
    { src: '/images/gallery/gallery-1-page_1783348268_5720ef28_xl.webp', alt: 'Bàn giao xe khách Kim Long Motor' },
    { src: '/images/gallery/gallery-2-page_1783348251_04740e8c_xl.webp', alt: 'Kim Long Motor bàn giao lô xe khách' },
    { src: '/images/gallery/gallery-7-page_1783348128_6fa4f6ac_xl.webp', alt: 'Khách hàng nhận xe Kim Long Motor' },
];

// Repeat the set so one half of the marquee track is always wider than the
// viewport; the track is then doubled for a seamless -50% loop.
const MARQUEE_HALF = [...HANDOVER_PHOTOS, ...HANDOVER_PHOTOS, ...HANDOVER_PHOTOS];

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase();

// Avatar with a graceful initials fallback (the CMS has some broken URLs).
const Avatar = ({ src, name }) => {
    const [broken, setBroken] = useState(!src);
    if (broken) {
        return <span className="w-11 h-11 rounded-full bg-graphite-700 text-ink text-sm font-bold flex items-center justify-center">{initials(name)}</span>;
    }
    return <img src={src} alt={name} onError={() => setBroken(true)} className="w-11 h-11 rounded-full object-cover" />;
};

// Section — Feedback / Handover photos marquee + pull quotes. 
// Video thực tế has been moved to RealVideoSection.
const CustomerStories = () => {
    const { data: testimonials } = useApiData(getTestimonials, []);
    const quotes = (testimonials || []).slice(0, 3);

    return (
        <section id="khach-hang" className="bg-noir-950 py-24 sm:py-36 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <SectionHeader
                    eyebrow="Khách hàng & bàn giao"
                    title="Hàng trăm nhà xe đã tin chọn Kim Long Motor"
                />
            </div>

            <div className="mt-14 group/marquee">
                <div className="flex w-max gap-4 motion-safe:animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:overflow-x-auto motion-reduce:px-5">
                    {[...MARQUEE_HALF, ...MARQUEE_HALF].map((p, idx) => (
                        <div key={idx} aria-hidden={idx >= HANDOVER_PHOTOS.length} className="w-[280px] sm:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-graphite-800">
                            <img src={p.src} alt={idx < HANDOVER_PHOTOS.length ? p.alt : ''} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                {quotes.length > 0 && (
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {quotes.map((t, idx) => (
                            <Reveal key={t.name || idx} delay={idx * 0.08} className="rounded-[22px] border border-line p-7 flex flex-col">
                                <p data-cms-content className="text-ink text-base sm:text-lg leading-relaxed">"{String(t.quote || '').replace(/^["\"]|["\"]$/g, '')}"</p>
                                <div className="mt-auto pt-7 flex items-center gap-3">
                                    <Avatar src={t.avatar} name={t.name} />
                                    <div>
                                        <div className="text-sm font-bold text-ink">{t.name}</div>
                                        <div className="text-xs text-ink-muted">{t.subtitle}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CustomerStories;
