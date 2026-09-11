import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChevronRight, Zap } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
    {
        id: 1,
        image: '/images/banners/slider-1.jpg',
        badge: 'Đại Lý Phân Phối Chính Hãng',
        title: 'KIM LONG MOTOR',
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

const HeroSlider = () => {
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
                        {/* Clean, Unobstructed Vehicle Photo - Full Height, No Blocking Box */}
                        <div className="relative h-[380px] sm:h-[500px] lg:h-[640px] overflow-hidden">
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.src = '/images/banners/slider-1.jpg';
                                }}
                            />

                            {/* Subtle bottom gradient so caption text stays readable over the photo */}
                            <div className="absolute inset-x-0 bottom-0 h-40 sm:h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                            {/* Minimal Caption Overlaid on Image - Doesn't Cover the Banner */}
                            <div className="absolute inset-x-0 bottom-0 px-4 pb-5 sm:pb-8 text-center text-white">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                                    <Zap size={12} className="text-yellow-300" />
                                    {slide.badge}
                                </div>

                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight leading-tight drop-shadow-md">
                                    {slide.title}
                                </h1>

                                <button
                                    onClick={() => scrollTo(slide.targetId)}
                                    className="mt-3.5 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md"
                                >
                                    Khám Phá Dòng Xe
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default HeroSlider;
