import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { getTestimonials } from '../api/client';
import { realVideos, businessInfo } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

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

// Section 05 — handover photo marquee, pull quotes, and video channels.
const CustomerStories = () => {
    const { data: testimonials } = useApiData(getTestimonials, []);
    const quotes = (testimonials || []).slice(0, 3);

    return (
        <section id="khach-hang" className="bg-noir-950 py-24 sm:py-36 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <SectionHeader
                    number="05"
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
                                <p data-cms-content className="text-ink text-base sm:text-lg leading-relaxed">“{String(t.quote || '').replace(/^[“"]|[”"]$/g, '')}”</p>
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

                <div className="mt-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <Reveal>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">Video thực tế</h3>
                        <p className="mt-2 text-sm text-ink-muted">Lái thử, bàn giao và đánh giá chi tiết trên kênh chính thức.</p>
                    </Reveal>
                    <Reveal className="flex gap-3">
                        <GhostButton as="a" href={businessInfo.youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</GhostButton>
                        <GhostButton as="a" href={businessInfo.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</GhostButton>
                    </Reveal>
                </div>

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {realVideos.map((video, idx) => (
                        <Reveal key={video.id} delay={idx * 0.06}>
                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block">
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-graphite-800">
                                    <img src={video.thumbnailUrl} alt={video.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center"><Play size={16} fill="white" /></span>
                                    </span>
                                </div>
                                <p className="mt-3 text-xs sm:text-sm text-ink line-clamp-2 group-hover:text-accent">{video.title}</p>
                                <p className="mt-1 text-[11px] text-ink-muted flex items-center gap-1"><Youtube size={12} /> Kim Long Motor</p>
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerStories;
