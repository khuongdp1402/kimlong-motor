import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Phone, ChevronRight, Calculator, ShieldCheck, Zap, Award } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { businessInfo } from '../data/hongthuong-data';

const slides = [
    {
        id: 1,
        image: '/images/banners/slider-1.jpg',
        badge: 'Đại Lý Phân Phối Chính Hãng',
        title: 'KIM LONG HỒNG THƯƠNG',
        subtitle: 'Xe Khách Giường Nằm • Xe Ghế • Xe Van Điện • Xe Tải • Xe Đầu Kéo Điện',
        highlight: 'Giá gốc xuất xưởng • Hỗ trợ vay ngân hàng 85% • Giao xe toàn quốc',
        targetId: 'danh-muc-xe'
    },
    {
        id: 2,
        image: '/images/products/gk48ev-van-dien.jpg',
        badge: '100% Thuần Điện - Chạy Phố 24/7',
        title: 'VAN ĐIỆN KIM LONG GK 48EV',
        subtitle: 'Tiên phong logistics đô thị • Không cấm giờ cao điểm • Pin CATL 48.8 kWh',
        highlight: 'Tiết kiệm 70% chi phí nhiên liệu • Miễn 100% lệ phí trước bạ • Bảo hành pin 8 năm',
        targetId: 'danh-muc-xe'
    },
    {
        id: 3,
        image: '/images/products/g24-giuong-nam.jpg',
        badge: 'Chuyên Cơ Mặt Đất',
        title: 'XE KHÁCH GIƯỜNG NẰM KIM LONG 99',
        subtitle: '24 Phòng VIP Massage & 34 Phòng Động Cơ Weichai / Yuchai Euro 5',
        highlight: 'Nội thất đẳng cấp Châu Âu • Treo bóng hơi êm ái • Sẵn xe giao ngay',
        targetId: 'danh-muc-xe'
    },
    {
        id: 4,
        image: '/images/products/k9kev-dau-keo-dien.jpg',
        badge: 'Công Nghệ Đột Phá - 815 Mã Lực',
        title: 'KIMLONG K9KEV & XE TẢI KIMAN9',
        subtitle: 'Đầu kéo thuần điện tiên phong & Xe tải nhẹ thế hệ mới thùng dài 4.3m',
        highlight: 'Chỉ cần trả trước từ 80 triệu • Hồ sơ vay duyệt nhanh trong 24 giờ',
        targetId: 'bang-bao-gia'
    }
];

const HeroSlider = ({ onOpenQuoteModal }) => {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section id="hero" className="relative mt-14 md:mt-[88px] bg-gray-950 select-none">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                loop={true}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {/* Slide Container: Flex to Bottom */}
                        <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] flex flex-col justify-end overflow-hidden">
                            {/* Clear, Unobstructed Vehicle Photo */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.src = '/images/banners/slider-1.jpg';
                                }}
                            />

                            {/* Borderless Gradient Fade from Bottom Up */}
                            <div className="absolute inset-x-0 bottom-0 h-64 sm:h-72 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none"></div>

                            {/* Bottom Info Content - Clean, Borderless, Well-Proportioned */}
                            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-9 sm:pb-11 text-center text-white">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                                    <Zap size={12} className="text-yellow-300" />
                                    {slide.badge}
                                </div>

                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight drop-shadow-md">
                                    {slide.title}
                                </h1>

                                <p className="mt-1.5 text-xs sm:text-sm text-gray-200 font-medium max-w-2xl mx-auto drop-shadow">
                                    {slide.subtitle}
                                </p>

                                <div className="mt-1.5 text-[11px] sm:text-xs text-yellow-300 font-semibold drop-shadow">
                                    ✓ {slide.highlight}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                                    <button
                                        onClick={() => scrollTo(slide.targetId)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                                    >
                                        Xem Dòng Xe
                                        <ChevronRight size={14} />
                                    </button>
                                    <button
                                        onClick={onOpenQuoteModal}
                                        className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Calculator size={14} className="text-red-600" />
                                        Báo Giá Nhanh
                                    </button>
                                    <a
                                        href={`tel:${businessInfo.hotlineSalesRaw}`}
                                        className="bg-black/50 hover:bg-black/75 text-white font-bold py-2 px-3.5 rounded-lg text-xs border border-white/20 transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                        <Phone size={13} className="text-red-400" />
                                        Hotline: {businessInfo.hotlineSales}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Quick Benefits Strip */}
            <div className="bg-gray-950 text-white border-y border-gray-800 py-2.5 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <Award size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-xs font-semibold">Giá Xuất Xưởng Nhà Máy</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                        <ShieldCheck size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-xs font-semibold">Hỗ Trợ Vay Ngân Hàng 85%</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                        <Zap size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-xs font-semibold">Sẵn Xe Giao Toàn Quốc</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                        <Phone size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-xs font-semibold">Hotline: {businessInfo.hotlineSales}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;
