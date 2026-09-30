import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { X, Phone, ChevronLeft, ChevronRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';
import { getLandingCategoryName } from '../../data/landingCategories';
import { useScrollLock } from '../../hooks/useScrollLock';
import ZaloIcon from './ZaloIcon';

import 'swiper/css';

/**
 * ProductDetailPopup - Popup chi tiết sản phẩm toàn diện cho Landing Page
 * - Kích thước rộng rãi (max-w-5xl, max-h-[92vh])
 * - Ảnh bìa/chính tự động trượt (Autoplay) qua các hình ảnh ngoại thất, nội thất, động cơ...
 * - Hỗ trợ vuốt chạm (Touch Swipe) mượt mà trên mobile/tablet và kéo chuột trên desktop
 * - Xem toàn bộ thư viện ảnh (gallery) với thumbnails và nút Prev/Next
 * - Hiển thị đầy đủ thông số kỹ thuật (highlights & toàn bộ specs)
 * - Hiển thị mô tả chi tiết sản phẩm
 * - Tích hợp CTA Báo giá (mở QuickQuotePopup), Hotline và Zalo
 */
const ProductDetailPopup = ({ product, onClose, onRequestQuote }) => {
    useScrollLock(Boolean(product));

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [swiperRef, setSwiperRef] = useState(null);

    // Gom danh sách toàn bộ ảnh từ product.gallery và fallback về product.image
    const gallery = useMemo(() => {
        const list = [];
        if (Array.isArray(product?.gallery) && product.gallery.length > 0) {
            list.push(...product.gallery);
        } else if (product?.image) {
            list.push(product.image);
        }
        const unique = Array.from(new Set(list.filter(Boolean)));
        return unique.length > 0 ? unique : ['/images/banners/slider-1.jpg'];
    }, [product]);

    // Reset về slide đầu tiên và bật autoplay mỗi khi mở popup xe mới
    useEffect(() => {
        setActiveImageIndex(0);
        if (swiperRef && !swiperRef.destroyed) {
            swiperRef.slideToLoop ? swiperRef.slideToLoop(0, 0) : swiperRef.slideTo(0, 0);
            if (gallery.length > 1 && swiperRef.autoplay) {
                swiperRef.autoplay.start();
            }
        }
    }, [product?.id, product?.slug, swiperRef, gallery.length]);

    useEffect(() => {
        if (!product) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [product, onClose]);

    if (!product) return null;

    const highlights = product.highlights || [];
    const specs = product.specs || [];
    const badges = product.badges || [];
    const categoryName = getLandingCategoryName(product.category);

    const handleThumbnailClick = (idx) => {
        setActiveImageIndex(idx);
        if (swiperRef && !swiperRef.destroyed) {
            if (swiperRef.slideToLoop) {
                swiperRef.slideToLoop(idx);
            } else {
                swiperRef.slideTo(idx);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-5 md:p-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-[popupSlideUp_0.35s_ease-out]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={product.name}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 sm:px-6 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0">
                    <div className="min-w-0 pr-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {categoryName && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white uppercase tracking-wider">
                                    {categoryName}
                                </span>
                            )}
                            {badges.map((b) => (
                                <span key={b} className="px-2 py-0.5 rounded-full bg-white/15 text-white/90 text-xs font-medium">
                                    {b}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold truncate text-white uppercase">
                            {product.name}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Đóng popup"
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-slate-800">
                    {/* Top section: Gallery (Slider & Touch Swipe) + Main Specs & CTA */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Gallery (col 7) */}
                        <div className="lg:col-span-7 flex flex-col gap-3">
                            {/* Main Image Stage with Swiper Auto-Slide & Touch Swipe */}
                            <div className="relative aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 select-none group">
                                <Swiper
                                    modules={[Autoplay]}
                                    autoplay={
                                        gallery.length > 1
                                            ? {
                                                  delay: 3500,
                                                  disableOnInteraction: false,
                                                  pauseOnMouseEnter: true,
                                              }
                                            : false
                                    }
                                    loop={gallery.length > 1}
                                    allowTouchMove={true}
                                    grabCursor={gallery.length > 1}
                                    onSwiper={setSwiperRef}
                                    onSlideChange={(swiper) => {
                                        setActiveImageIndex(swiper.realIndex);
                                    }}
                                    className="w-full h-full"
                                >
                                    {gallery.map((img, idx) => (
                                        <SwiperSlide key={idx} className="w-full h-full">
                                            <img
                                                src={img}
                                                alt={`${product.name} - ảnh ${idx + 1}`}
                                                className="w-full h-full object-cover select-none pointer-events-none"
                                                draggable={false}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = product?.image || '/images/banners/slider-1.jpg';
                                                }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Navigation arrows if multiple images */}
                                {gallery.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                swiperRef?.slidePrev();
                                            }}
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 shadow-md"
                                            aria-label="Ảnh trước"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                swiperRef?.slideNext();
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 shadow-md"
                                            aria-label="Ảnh tiếp theo"
                                        >
                                            <ChevronRight size={20} />
                                        </button>

                                        {/* Status badge: Auto slide & swipe prompt */}
                                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs pointer-events-none">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            Tự động trượt ảnh • Vuốt để xem
                                        </div>

                                        {/* Counter badge */}
                                        <div className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 rounded-md bg-black/60 text-white text-xs font-semibold backdrop-blur-xs pointer-events-none">
                                            {activeImageIndex + 1} / {gallery.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails Strip */}
                            {gallery.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                    {gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleThumbnailClick(idx)}
                                            className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                                activeImageIndex === idx
                                                    ? 'border-red-600 ring-2 ring-red-100 shadow-sm opacity-100 scale-102'
                                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                draggable={false}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = product?.image || '/images/banners/slider-1.jpg';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Price & Key Specs & CTAs (col 5) */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                            {/* Price policy box */}
                            <div className="bg-red-50/80 border border-red-200 rounded-xl p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1">
                                    Chính sách giá & Ưu đãi
                                </div>
                                <div className="text-2xl font-black text-red-600">
                                    {product.priceDisplay || (product.price ? `${product.price.toLocaleString('vi-VN')} đ` : 'Liên hệ nhận giá ưu đãi')}
                                </div>
                                <div className="mt-2.5 space-y-1.5 text-xs text-slate-700 font-medium">
                                    <div className="flex items-center gap-1.5 text-emerald-700">
                                        <CheckCircle2 size={14} className="flex-shrink-0" />
                                        <span>Hỗ trợ trả góp ngân hàng đến 80 - 85%</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-700">
                                        <CheckCircle2 size={14} className="flex-shrink-0" />
                                        <span>Bảo hành chính hãng 3 năm / 270.000 km</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-emerald-700">
                                        <CheckCircle2 size={14} className="flex-shrink-0" />
                                        <span>Dịch vụ sửa chữa lưu động 24/7 toàn quốc</span>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights quick specs */}
                            {highlights.length > 0 && (
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-red-500" />
                                        Thông số nổi bật
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {highlights.slice(0, 6).map((h) => (
                                            <div key={h.label} className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                                                <div className="text-xs text-slate-500 truncate">{h.label}</div>
                                                <div className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">{h.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick CTA Buttons */}
                            <div className="space-y-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => onRequestQuote(product)}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wide"
                                >
                                    <FileText size={16} />
                                    Yêu Cầu Báo Giá Lăn Bánh
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <a
                                        href={`tel:${businessInfo.hotlineSalesRaw}`}
                                        className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-red-600 hover:text-red-600 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors bg-white shadow-xs"
                                    >
                                        <Phone size={15} className="text-red-600" />
                                        {businessInfo.hotlineSales}
                                    </a>
                                    <a
                                        href={businessInfo.zaloUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors bg-white shadow-xs"
                                    >
                                        <ZaloIcon size={16} />
                                        Nhắn Zalo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Full Technical Specifications (Specs Table) */}
                    {specs.length > 0 && (
                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                                    <span className="w-1.5 h-4.5 bg-red-600 rounded-sm"></span>
                                    Thông Số Kỹ Thuật Đầy Đủ ({specs.length} mục)
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm">
                                {specs.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-2.5 rounded-lg border border-slate-100 ${
                                            idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                                        }`}
                                    >
                                        <span className="text-slate-600 font-medium pr-2">{item.label}</span>
                                        <span className="font-semibold text-slate-900 text-right">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Section: Full Description */}
                    {product.description && (
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide mb-3">
                                <span className="w-1.5 h-4.5 bg-red-600 rounded-sm"></span>
                                Mô Tả & Thông Tin Chi Tiết
                            </h3>
                            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky/Fixed Footer */}
                <div className="px-5 py-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Showroom Kim Long Motor:</span>
                        <span className="hidden sm:inline">{businessInfo.addressShort || businessInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            onClick={() => onRequestQuote(product)}
                            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
                        >
                            Báo giá xe này
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPopup;
