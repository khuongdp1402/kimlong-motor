import React, { useState } from 'react';
import { Star, Eye, Sparkles } from 'lucide-react';
import { carCategories, carsData, businessInfo } from '../data/hongthuong-data';

const VehicleCatalogSection = ({ onOpenDetail, onOpenQuote }) => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredCars = activeCategory === 'all'
        ? carsData
        : carsData.filter(car => car.category === activeCategory);

    return (
        <section id="danh-muc-xe" className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Title & Intro */}
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={12} />
                        Danh Mục Xe Chính Hãng
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                        CÁC DÒNG XE THƯƠNG MẠI KIM LONG MOTOR
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Hồng Thương phân phối trực tiếp từ nhà máy: Xe khách giường nằm VIP, Xe ghế Universe, Xe Van điện 24/7, Xe tải KIMAN9 và Đầu kéo thuần điện K9KEV.
                    </p>
                </div>

                {/* Categories Tab Bar - NO background box, NO border, Responsive Wrap (No horizontal scroll) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 px-1">
                    {carCategories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all rounded-lg ${
                                    isActive
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60'
                                }`}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* Products Grid - 2 Cards per row on Mobile, 3 on Tablet, 4 on Desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                    {filteredCars.map((car) => (
                        <div
                            key={car.id}
                            onClick={() => onOpenDetail(car)}
                            className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200 dark:border-gray-700/80 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                        >
                            {/* Card Image Container */}
                            <div className="relative w-full pt-[65%] sm:pt-[68%] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                                {car.promoTag && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow uppercase tracking-wide truncate max-w-[70%]">
                                        {car.promoTag}
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded truncate max-w-[50%]">
                                    {car.badge}
                                </div>
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="absolute inset-0 w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-108 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = '/images/banners/slider-1.jpg';
                                    }}
                                />
                            </div>

                            {/* Card Content */}
                            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Rating & reviews */}
                                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-yellow-500 mb-1 font-medium">
                                        <div className="flex text-yellow-400 text-[10px] sm:text-xs">
                                            {'★'.repeat(5)}
                                        </div>
                                        <span className="text-gray-500 dark:text-gray-400 truncate">
                                            {car.rating} ({car.reviews})
                                        </span>
                                    </div>

                                    {/* Car Title */}
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] uppercase tracking-tight leading-snug">
                                        {car.name}
                                    </h3>

                                    {/* Price & Note */}
                                    <div className="mt-1.5 mb-2 sm:mb-3">
                                        <div className="text-xs sm:text-base font-extrabold text-red-600 dark:text-red-400 truncate">
                                            {car.price}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {car.priceNote}
                                        </div>
                                    </div>

                                    {/* Spec Chips */}
                                    <div className="flex flex-wrap gap-1 mb-2.5 sm:mb-3">
                                        {car.specsHighlights?.slice(0, 2).map((spec, i) => (
                                            <span
                                                key={i}
                                                className="text-[9px] sm:text-[11px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium border border-blue-100 dark:border-blue-900/50 truncate max-w-full"
                                            >
                                                {spec.value}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons: [Xem Chi Tiết] & [Nhận Báo Giá] */}
                                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenDetail(car);
                                        }}
                                        className="w-full py-1.5 px-1 sm:py-2 sm:px-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-[10px] sm:text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Eye size={12} className="hidden sm:inline flex-shrink-0" />
                                        <span className="truncate">Chi Tiết</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenQuote(car);
                                        }}
                                        className="w-full py-1.5 px-1 sm:py-2 sm:px-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold transition-colors shadow-sm flex items-center justify-center uppercase tracking-wider"
                                    >
                                        <span className="truncate">Báo Giá</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Callout */}
                <div className="mt-10 sm:mt-12 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-lg">
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight">
                            Bạn Cần Tư Vấn Phiên Bản Xe Hoặc Đóng Thùng Theo Yêu Cầu?
                        </h3>
                        <p className="text-xs sm:text-sm text-red-100">
                            Hồng Thương hỗ trợ báo giá lăn bánh, tư vấn hồ sơ vay trả góp ngân hàng 85% và lái thử tận nơi!
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 flex-shrink-0">
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className="bg-white text-red-600 hover:bg-red-50 font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow transition-colors flex items-center gap-1.5 uppercase tracking-wide"
                        >
                            <span>Gọi: {businessInfo.hotlineSales}</span>
                        </a>
                        <a
                            href={businessInfo.zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-900/50 hover:bg-red-900/80 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm border border-white/30 transition-colors"
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
