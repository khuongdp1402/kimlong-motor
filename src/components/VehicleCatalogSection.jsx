import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { carsData, businessInfo } from '../data/hongthuong-data';

// Curated set of 8 diverse vehicles (one or two per category) for a clean,
// non-redundant landing page grid. The full catalog remains browsable via
// category pages.
const FEATURED_IDS = [
    'g24-giuong-nam',
    'g34-giuong-nam',
    'n29-ghe-ngoi',
    'n47-ghe-ngoi',
    'gk48ev-van-dien',
    'kiman9-xe-tai-nhe',
    'kiman9-thung-dong-lanh',
    'k9kev-dau-keo-dien'
];

const featuredCars = FEATURED_IDS
    .map((id) => carsData.find((car) => car.id === id))
    .filter(Boolean);

const VehicleCatalogSection = ({ onOpenDetail, onOpenQuote }) => {
    const navigate = useNavigate();

    return (
        <section id="danh-muc-xe" className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Section Title & Intro */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={12} />
                        Danh Mục Xe Chính Hãng
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                        CÁC DÒNG XE THƯƠNG MẠI KIM LONG MOTOR
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Phân phối trực tiếp từ nhà máy: Xe khách giường nằm VIP, Xe ghế Universe, Xe Van điện 24/7, Xe tải KIMAN9 và Đầu kéo thuần điện K9KEV.
                    </p>
                </div>

                {/* Curated Grid: 2 Rows x 4 Columns on Desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                    {featuredCars.map((car) => (
                        <div
                            key={car.id}
                            onClick={() => onOpenDetail(car)}
                            className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200 dark:border-gray-700/80 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                        >
                            {/* Card Image */}
                            <div className="relative w-full pt-[65%] sm:pt-[68%] bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                                {car.promoTag && (
                                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow uppercase tracking-wide truncate max-w-[70%]">
                                        MỚI
                                    </div>
                                )}
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="absolute inset-0 w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-108 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = '/images/banners/slider-1.jpg';
                                    }}
                                />
                            </div>

                            {/* Card Content - Concise */}
                            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] uppercase tracking-tight leading-snug">
                                        {car.shortName}
                                    </h3>
                                    <div className="mt-1.5 mb-2.5 sm:mb-3 text-xs sm:text-base font-extrabold text-red-600 dark:text-red-400 truncate">
                                        {car.price}
                                    </div>
                                </div>

                                {/* Single CTA */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenQuote(car);
                                    }}
                                    className="w-full py-1.5 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] sm:text-xs font-bold transition-colors shadow-sm flex items-center justify-center uppercase tracking-wider"
                                >
                                    Xem & Báo Giá
                                </button>
                            </div>
                        </div>
                    ))}
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
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-lg">
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-base sm:text-xl font-bold uppercase tracking-tight">
                            Bạn Cần Tư Vấn Phiên Bản Xe Hoặc Đóng Thùng Theo Yêu Cầu?
                        </h3>
                        <p className="text-xs sm:text-sm text-red-100">
                            Đội ngũ chuyên viên hỗ trợ báo giá lăn bánh, tư vấn hồ sơ vay trả góp ngân hàng 85% và lái thử tận nơi!
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
