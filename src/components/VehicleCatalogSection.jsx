import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Bus, Armchair, Zap, Truck, Phone } from 'lucide-react';
import { carsData, businessInfo } from '../data/hongthuong-data';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Three top-level tabs group the underlying catalog categories.
const tabs = [
    { id: 'bus', label: 'Xe Khách', categories: ['giuong-nam', 'xe-ghe'] },
    { id: 'truck', label: 'Xe Tải', categories: ['xe-tai'] },
    { id: 'special', label: 'Xe Chuyên Dùng', categories: ['van-dien', 'dau-keo-dien'] },
];

// Category visual config — distinct colors & icons per category
const categoryConfig = {
    'giuong-nam': { icon: Bus, label: 'Giường Nằm', badgeClass: 'bg-amber-100 text-amber-800', borderAccent: 'group-hover:border-amber-400' },
    'xe-ghe': { icon: Armchair, label: 'Xe Ghế', badgeClass: 'bg-blue-100 text-blue-800', borderAccent: 'group-hover:border-blue-400' },
    'van-dien': { icon: Zap, label: 'Xe Điện', badgeClass: 'badge-ev text-white', borderAccent: 'group-hover:border-green-400' },
    'xe-tai': { icon: Truck, label: 'Xe Tải', badgeClass: 'bg-slate-100 text-slate-800', borderAccent: 'group-hover:border-slate-400' },
    'dau-keo-dien': { icon: Zap, label: 'Đầu Kéo Điện', badgeClass: 'badge-ev text-white', borderAccent: 'group-hover:border-emerald-400' },
};

// Tag variety instead of always "MỚI"
const getSmartTag = (car) => {
    if (car.id.includes('dien') || car.id.includes('ev')) return { text: 'EV', cls: 'badge-ev' };
    if (car.promoTag?.includes('Sẵn')) return { text: 'Sẵn Xe', cls: 'bg-blue-600 text-white' };
    if (car.promoTag?.includes('Ưu đãi') || car.promoTag?.includes('ưu đãi')) return { text: 'Ưu Đãi', cls: 'bg-amber-500 text-white' };
    if (car.badge?.includes('Bán Chạy')) return { text: 'Bán Chạy', cls: 'bg-orange-500 text-white' };
    return car.promoTag ? { text: 'MỚI', cls: 'bg-red-600 text-white' } : null;
};

const VehicleCatalogSection = ({ onOpenDetail, onOpenQuote }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const headerRef = useScrollAnimation();
    const gridRef = useScrollAnimation({ threshold: 0.08 });
    const calloutRef = useScrollAnimation();

    const activeCars = useMemo(() => {
        const cats = tabs.find((t) => t.id === activeTab)?.categories || [];
        return carsData.filter((car) => cats.includes(car.category)).slice(0, 8);
    }, [activeTab]);

    return (
        <section id="danh-muc-xe" className="py-16 sm:py-20 bg-brand-surface">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Title & Intro */}
                <div ref={headerRef} className="scroll-fade-up text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={12} />
                        Danh Mục Xe Chính Hãng
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-text uppercase tracking-tight">
                        CÁC DÒNG XE THƯƠNG MẠI KIM LONG MOTOR
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                        Phân phối trực tiếp từ nhà máy: Xe khách giường nằm VIP, Xe ghế Universe, Xe Van điện 24/7, Xe tải KIMAN9 và Đầu kéo thuần điện K9KEV.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-brand-soft'
                                    : 'bg-white text-brand-muted border border-brand-border hover:border-brand-primary hover:text-brand-primary'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid: max 2 rows — desktop 4/row, mobile 2/row */}
                <div ref={gridRef} className="scroll-fade-up grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                    {activeCars.map((car, idx) => {
                        const catCfg = categoryConfig[car.category] || {};
                        const CatIcon = catCfg.icon || Sparkles;
                        const smartTag = getSmartTag(car);

                        return (
                            <div
                                key={car.id}
                                onClick={() => onOpenDetail(car)}
                                className={`scroll-child group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200 dark:border-gray-700/80 ${catCfg.borderAccent || ''} overflow-hidden cursor-pointer transform hover:-translate-y-1`}
                                style={{ '--child-i': idx }}
                            >
                                {/* Card Image */}
                                <div className="relative w-full pt-[65%] sm:pt-[68%] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                                    {smartTag && (
                                        <div className={`absolute top-2 right-2 z-10 text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow uppercase tracking-wide ${smartTag.cls}`}>
                                            {smartTag.text}
                                        </div>
                                    )}
                                    {/* Category badge (top-left) */}
                                    <div className={`absolute top-2 left-2 z-10 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${catCfg.badgeClass || 'bg-gray-100 text-gray-600'}`}>
                                        <CatIcon size={10} />
                                        <span className="hidden sm:inline">{catCfg.label}</span>
                                    </div>
                                    <img
                                        src={car.image}
                                        alt={car.name}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-108 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = '/images/banners/slider-1.jpg';
                                        }}
                                    />
                                </div>

                                {/* Card Content - Concise */}
                                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-bold text-brand-text group-hover:text-brand-primary transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] uppercase tracking-tight leading-snug">
                                            {car.shortName}
                                        </h3>
                                        {car.specsHighlights?.[0] && (
                                            <div className="mt-1 text-[10px] sm:text-xs text-brand-muted truncate">
                                                {car.specsHighlights[0].value}
                                            </div>
                                        )}
                                        <div className="mt-1.5 mb-2.5 sm:mb-3 text-xs sm:text-base font-extrabold text-brand-primary truncate">
                                            {car.price}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenDetail(car);
                                            }}
                                            className="py-1.5 sm:py-2 rounded-lg border border-brand-border text-brand-text hover:border-brand-primary hover:text-brand-primary text-[10px] sm:text-xs font-bold transition-colors flex items-center justify-center"
                                        >
                                            Xem Chi Tiết
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenQuote(car);
                                            }}
                                            className="py-1.5 sm:py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-dark text-white text-[10px] sm:text-xs font-bold transition-colors shadow-sm flex items-center justify-center uppercase tracking-wider"
                                        >
                                            Nhận Báo Giá
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="mt-8 sm:mt-10 text-center">
                    <button
                        type="button"
                        onClick={() => navigate('/category/all')}
                        className="inline-flex items-center gap-1.5 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wide transition-colors"
                    >
                        Xem Tất Cả Dòng Xe
                    </button>
                </div>

                {/* Bottom Callout */}
                <div ref={calloutRef} className="scroll-fade-up mt-8 sm:mt-10 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-lg border border-gray-700/50">
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight">
                            Bạn Cần Tư Vấn Phiên Bản Xe Hoặc Đóng Thùng Theo Yêu Cầu?
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300">
                            Đội ngũ chuyên viên hỗ trợ báo giá lăn bánh, tư vấn hồ sơ vay trả góp ngân hàng 85% và lái thử tận nơi!
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 flex-shrink-0">
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow transition-colors flex items-center gap-1.5 uppercase tracking-wide"
                        >
                            <Phone size={14} />
                            <span>Gọi: {businessInfo.hotlineSales}</span>
                        </a>
                        <a
                            href={businessInfo.zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 transition-colors"
                        >
                            Chat Zalo
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VehicleCatalogSection;
