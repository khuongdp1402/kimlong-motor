import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { carsData } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

const tabs = [
    { id: 'bus', label: 'Xe Khách', categories: ['giuong-nam', 'xe-ghe'] },
    { id: 'truck', label: 'Xe Tải', categories: ['xe-tai'] },
    { id: 'special', label: 'Xe Chuyên Dùng', categories: ['van-dien', 'dau-keo-dien'] },
];

// At most one badge per card, chosen by priority.
const badgeFor = (car) => {
    if (car.category === 'van-dien' || car.category === 'dau-keo-dien') return 'Thuần điện';
    if (car.promoTag?.includes('Sẵn')) return 'Sẵn xe';
    if (car.promoTag) return 'Ưu đãi';
    return null;
};

const StageCard = ({ car, onOpenDetail, onOpenQuote }) => {
    const badge = badgeFor(car);
    return (
        <article
            onClick={() => onOpenDetail(car)}
            className="group cursor-pointer rounded-[22px] bg-graphite-800 border border-line overflow-hidden flex flex-col transition-colors hover:border-ink/20"
        >
            {/* Uniform gradient "stage" so every photo sits on the same backdrop */}
            <div className="relative p-3 bg-[radial-gradient(ellipse_at_50%_70%,var(--color-graphite-700)_0%,var(--color-graphite-800)_70%)]">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                        src={car.image}
                        alt={car.shortName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = '/images/banners/slider-1.jpg'; }}
                    />
                </div>
                {badge && (
                    <span className="absolute top-6 left-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <div className="px-5 pb-5 pt-3 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">{car.shortName}</h3>
                <dl className="mt-3 text-xs sm:text-[13px]">
                    {(car.specsHighlights || []).slice(0, 2).map((s) => (
                        <div key={s.label} className="flex justify-between gap-3 py-2 border-t border-line">
                            <dt className="text-ink-muted shrink-0">{s.label}</dt>
                            <dd className="text-ink text-right truncate">{s.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-ink-muted truncate">{car.price}</span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenQuote(car); }}
                        className="shrink-0 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-accent hover:text-ink transition-colors cursor-pointer"
                    >
                        Báo giá <ArrowUpRight size={15} />
                    </button>
                </div>
            </div>
        </article>
    );
};

// Section 03 — model range.
const VehicleCatalogSection = ({ onOpenDetail, onOpenQuote }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const cars = useMemo(() => {
        const cats = tabs.find((t) => t.id === activeTab)?.categories || [];
        return carsData.filter((car) => cats.includes(car.category)).slice(0, 8);
    }, [activeTab]);

    return (
        <section id="danh-muc-xe" className="bg-noir-950 py-24 sm:py-36">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
                    <SectionHeader
                        number="03"
                        eyebrow="Dòng xe"
                        title="Mỗi hành trình, một cỗ máy phù hợp"
                        intro="Phân phối trực tiếp từ nhà máy — xe khách, xe tải và xe chuyên dùng thế hệ mới."
                    />
                    <div role="tablist" className="flex gap-7 border-b border-line">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative pb-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab.id ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                            >
                                {tab.label}
                                <span className={`absolute left-0 -bottom-px h-[2px] bg-accent transition-all duration-300 ${activeTab === tab.id ? 'w-full' : 'w-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {cars.map((car, idx) => (
                        <Reveal key={`${activeTab}-${car.id}`} delay={(idx % 4) * 0.07}>
                            <StageCard car={car} onOpenDetail={onOpenDetail} onOpenQuote={onOpenQuote} />
                        </Reveal>
                    ))}
                </div>

                <div className="mt-12">
                    <GhostButton onClick={() => navigate('/category/all')}>Xem tất cả dòng xe</GhostButton>
                </div>
            </div>
        </section>
    );
};

export default VehicleCatalogSection;
