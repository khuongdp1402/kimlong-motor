import React, { useState } from 'react';
import { X, Phone, MessageCircle, Send, CheckCircle2, Car, User, MapPin } from 'lucide-react';
import { businessInfo, carsData } from '../data/hongthuong-data';

const QuickQuoteModal = ({ isOpen, onClose, defaultCar = null }) => {
    if (!isOpen) return null;

    const [selectedCarId, setSelectedCarId] = useState(defaultCar?.id || carsData[0]?.id);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerCity, setCustomerCity] = useState('');
    const [financeType, setFinanceType] = useState('Trả góp vay 85%');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const currentCar = carsData.find(c => c.id === selectedCarId) || defaultCar || carsData[0];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
            <div 
                className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
                    <div>
                        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded uppercase">
                            Báo Giá Trực Tiếp Nhà Máy
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-tight mt-1">
                            Nhận Báo Giá Lăn Bánh & Ưu Đãi
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
                        aria-label="Đóng"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {submitted ? (
                        <div className="text-center py-6 space-y-4">
                            <CheckCircle2 size={56} className="text-green-600 mx-auto" />
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Tiếp Nhận Thông Tin Thành Công!
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                Cảm ơn quý khách <strong>{customerName || 'bạn'}</strong>. Chuyên viên <strong>Hồng Thương (0379.398.798)</strong> sẽ liên hệ ngay để gửi bảng tính lăn bánh, hồ sơ vay góp và ưu đãi tốt nhất cho dòng xe <strong>{currentCar?.name}</strong>.
                            </p>
                            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 shadow"
                                >
                                    <Phone size={18} />
                                    Gọi Ngay: {businessInfo.hotlineSales}
                                </a>
                                <a
                                    href={businessInfo.zaloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 shadow"
                                >
                                    <MessageCircle size={18} />
                                    Chat Zalo Trực Tiếp
                                </a>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Selected Car preview */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                                    <Car size={15} className="text-red-600" />
                                    Dòng xe quý khách quan tâm:
                                </label>
                                <select
                                    value={selectedCarId}
                                    onChange={(e) => setSelectedCarId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                >
                                    {carsData.map((car) => (
                                        <option key={car.id} value={car.id}>
                                            {car.name} ({car.categoryName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Customer Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                                    <User size={15} className="text-red-600" />
                                    Họ và tên của bạn: *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Anh Tuấn / Chị Lan..."
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>

                            {/* Customer Phone */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                                    <Phone size={15} className="text-red-600" />
                                    Số điện thoại nhận báo giá (Zalo): *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Số điện thoại nhận tin nhắn / cuộc gọi"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>

                            {/* Province / City */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                                    <MapPin size={15} className="text-red-600" />
                                    Khu vực đăng ký xe (Tỉnh/Thành):
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: TP.HCM, Long An, Tiền Giang, Cần Thơ, Bình Dương..."
                                    value={customerCity}
                                    onChange={(e) => setCustomerCity(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>

                            {/* Financing Type */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                                    Hình thức mua xe:
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFinanceType('Trả góp vay 85%')}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                                            financeType === 'Trả góp vay 85%'
                                                ? 'bg-red-600 text-white border-red-600 shadow'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        Trả Góp Vay Ngân Hàng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFinanceType('Trả thẳng 100%')}
                                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                                            financeType === 'Trả thẳng 100%'
                                                ? 'bg-red-600 text-white border-red-600 shadow'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                                        }`}
                                    >
                                        Trả Thẳng 100%
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide mt-2 text-sm"
                            >
                                <Send size={18} />
                                Gửi Yêu Cầu Cho Hồng Thương
                            </button>

                            <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-1">
                                🔒 Thông tin được bảo mật tuyệt đối - Tư vấn tận tâm, không làm phiền!
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickQuoteModal;
