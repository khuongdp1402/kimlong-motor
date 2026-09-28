import React from 'react';
import { Phone, Wrench } from 'lucide-react';
import { trustPillars, businessInfo } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import ImageReveal from './motion/ImageReveal';

// Section 04 — four numbered reasons + expert-team hotlines.
const WhyKimLong = () => (
    <section id="ve-chung-toi" className="bg-noir-900 py-24 sm:py-36">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
            <div className="lg:col-span-6">
                <SectionHeader
                    number="04"
                    eyebrow="Vì sao chọn chúng tôi"
                    title="Giá gốc nhà máy, đồng hành trọn vòng đời xe"
                />

                <ol className="mt-12 border-t border-line">
                    {trustPillars.map((pillar, idx) => (
                        <Reveal as="li" key={pillar.title} delay={idx * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 py-7 border-b border-line">
                            <span className="text-accent font-bold tabular-nums pt-0.5">0{idx + 1}</span>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-ink">{pillar.title}</h3>
                                <p className="mt-2 text-sm sm:text-[15px] text-ink-muted leading-relaxed">{pillar.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </ol>

                <Reveal className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="flex items-center gap-4 p-4 rounded-2xl border border-line hover:border-white/25 transition-colors">
                        <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shrink-0"><Phone size={18} /></span>
                        <span>
                            <span className="block text-xs text-ink-muted">Tư vấn & báo giá</span>
                            <span className="block text-lg font-bold text-ink tabular-nums">{businessInfo.hotlineSales}</span>
                        </span>
                    </a>
                    <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="flex items-center gap-4 p-4 rounded-2xl border border-line hover:border-white/25 transition-colors">
                        <span className="w-11 h-11 rounded-full bg-graphite-700 text-white flex items-center justify-center shrink-0"><Wrench size={18} /></span>
                        <span>
                            <span className="block text-xs text-ink-muted">Kỹ thuật & dịch vụ 24/7</span>
                            <span className="block text-lg font-bold text-ink tabular-nums">{businessInfo.hotlineService}</span>
                        </span>
                    </a>
                </Reveal>
            </div>

            <div className="lg:col-span-6 lg:pt-24">
                <ImageReveal
                    src="/images/about/about-0-bg-tamnhin-scaled.jpg"
                    alt="Tòa nhà Kim Long Motor"
                    className="rounded-[28px] aspect-[4/5] lg:aspect-auto lg:h-[640px]"
                    imgClassName="object-[28%_center]"
                />
                <Reveal className="mt-5 text-sm text-ink-muted flex gap-2">
                    <span className="text-accent">—</span>
                    Showroom & kho xe: {businessInfo.address}
                </Reveal>
            </div>
        </div>
    </section>
);

export default WhyKimLong;
