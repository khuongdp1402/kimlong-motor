import React, { useState } from 'react';
import { X, Phone, CheckCircle2, MessageCircle, Send, Shield, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';

const VehicleModal = ({ car, isOpen, onClose, onOpenQuote }) => {
    if (!isOpen || !car) return null;

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        plan: 'Trả góp ngân hàng (85%)',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
            {/* Modal Container */}
            <div 
                className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-6 py-4 flex items-center justify-between shadow-md flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-white/20 text-white text-xs uppercase px-2 py-0.5 rounded font-semibold tracking-wide">
                                {car.categoryName}
                            </span>
                            <span className="text-yellow-300 text-xs font-semibold">★ {car.rating} ({car.reviews} đánh giá)</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight uppercase">
                            {car.name}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors flex-shrink-0 ml-4"
                        aria-label="Đóng popup"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
                    {/* Top Section: Vehicle Image & Quick Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Car Image Preview */}
                        <div className="lg:col-span-7 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 relative overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                            {car.promoTag && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow uppercase tracking-wide">
                                    {car.promoTag}
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                                {car.badge}
                            </div>
                            <img
                                src={car.image}
                                alt={car.name}
                                className="w-full max-h-[340px] object-contain rounded-lg drop-shadow-xl transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                    e.target.src = '/images/banners/slider-1.jpg';
                                }}
                            />
                            <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                💡 Hình ảnh thực tế từ Nhà máy & Showroom Kim Long Motor
                            </div>
                        </div>

                        {/* Car Highlights & Pricing */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                            <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
                                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
                                    Chính sách giá Kim Long:
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400 mt-1">
                                    {car.price}
                                </div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                                    <span>{car.priceNote}</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {car.summary}
                            </p>

                            {/* Direct Consultation Box */}
                            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Hỗ trợ tư vấn 24/7 trực tiếp:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={`tel:${businessInfo.hotlineSalesRaw}`}
                                        className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-sm shadow transition-colors"
                                    >
                                        <Phone size={16} />
                                        <span>{businessInfo.hotlineSales}</span>
                                    </a>
                                    <a
                                        href={businessInfo.zaloUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-sm shadow transition-colors"
                                    >
                                        <MessageCircle size={16} />
                                        <span>Nhắn Zalo</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Specifications Table */}
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                            <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
                            Thông Số Kỹ Thuật Nổi Bật
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {car.specsHighlights?.map((spec, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        {spec.label}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white text-right ml-2">
                                        {spec.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features List */}
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                            <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
                            Trang Bị & Tiện Nghi Vượt Trội
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {car.features?.map((feat, index) => (
                                <div key={index} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: Fast Quote Lead Form inside Modal */}
                    <div className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl p-5 sm:p-6 shadow-xl">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-4">
                                <h3 className="text-xl font-bold uppercase tracking-wide">
                                    Yêu Cầu Báo Giá Lăn Bánh & Đăng Ký Lái Thử
                                </h3>
                                <p className="text-xs sm:text-sm text-red-100 mt-1">
                                    Kim Long sẽ liên hệ gửi bảng tính chi tiết lăn bánh xe <span className="font-bold underline">{car.name}</span> trong 5 phút!
                                </p>
                            </div>

                            {formSubmitted ? (
                                <div className="bg-white text-gray-900 rounded-lg p-6 text-center shadow-lg animate-fadeIn">
                                    <CheckCircle2 size={48} className="text-green-600 mx-auto mb-2" />
                                    <h4 className="text-lg font-bold text-gray-900">Gửi Yêu Cầu Thành Công!</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Cảm ơn quý khách! Chuyên viên <strong>Kim Long (0379.398.798)</strong> sẽ liên hệ ngay để gửi báo giá ưu đãi tốt nhất.
                                    </p>
                                    <div className="mt-4 flex justify-center gap-3">
                                        <a
                                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-sm inline-flex items-center gap-2"
                                        >
                                            <Phone size={16} /> Gọi Ngay: {businessInfo.hotlineSales}
                                        </a>
                                        <button
                                            onClick={onClose}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium text-sm"
                                        >
                                            Đóng lại
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Họ tên của bạn *"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Số điện thoại / Zalo *"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-white text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-lg text-sm shadow transition-colors flex items-center justify-center gap-2 uppercase"
                                    >
                                        <Send size={16} />
                                        Nhận Báo Giá Ngay
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer Bar */}
                <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        📍 Showroom: <span className="font-semibold text-gray-800 dark:text-gray-200">{businessInfo.addressShort}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Đóng
                        </button>
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow"
                        >
                            <Phone size={16} />
                            Gọi Báo Giá ({businessInfo.hotlineSales})
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleModal;
