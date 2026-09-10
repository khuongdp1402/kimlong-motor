import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, MessageCircle, Calculator, ShieldCheck, Clock, Award } from 'lucide-react';
import { businessInfo, carCategories, carsData } from '../data/hongthuong-data';

const QuoteFormSection = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCar, setSelectedCar] = useState(carsData[0].id);
    const [paymentMethod, setPaymentMethod] = useState('vay-85');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const availableCars = selectedCategory === 'all'
        ? carsData
        : carsData.filter(c => c.category === selectedCategory);

    const currentCar = carsData.find(c => c.id === selectedCar) || carsData[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <section id="bang-bao-gia" className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#e53e3e_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase tracking-wider mb-2.5">
                        <Calculator size={12} />
                        Bảng Báo Giá Lăn Bánh Nhanh
                    </span>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight">
                        ĐĂNG KÝ NHẬN BÁO GIÁ & TƯ VẤN TRẢ GÓP 85%
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                        Nhận bảng báo giá chi tiết, dự toán chi phí lăn bánh theo từng tỉnh thành, kèm lịch trả góp ngân hàng từ chuyên viên <strong>Hồng Thương (0379.398.798)</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Benefits & Information */}
                    <div className="lg:col-span-5 bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-700 flex flex-col justify-between shadow-2xl">
                        <div className="space-y-6">
                            <div className="border-b border-gray-700 pb-6">
                                <span className="text-xs uppercase tracking-wider text-red-400 font-bold">Chuyên Viên Đại Lý</span>
                                <h3 className="text-2xl font-bold mt-1 text-white">
                                    HỒNG THƯƠNG KIM LONG
                                </h3>
                                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                                    Tư vấn tận tâm, cam kết giá gốc xuất xưởng trực tiếp, không phí môi giới, đồng hành cùng quý doanh nghiệp và bác tài suốt vòng đời sử dụng xe.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Chính Sách Giá Tốt Nhất</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Chiết khấu trực tiếp từ nhà máy, nhiều quà tặng phụ kiện chính hãng.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                        <Calculator size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Gói Vay Ưu Đãi 85%</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Chỉ cần trả trước từ 15-20%, thời gian vay đến 7 năm, thủ tục trong 24h.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Sẵn Xe Đủ Màu Giao Ngay</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Giao xe tận nơi toàn quốc, hỗ trợ thủ tục đăng ký, đăng kiểm trọn gói.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-700">
                            <div className="text-xs text-gray-400 mb-3 font-semibold uppercase">
                                Hotline Hỗ Trợ 24/7 Trực Tiếp:
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Phone size={16} />
                                    {businessInfo.hotlineSales}
                                </a>
                                <a
                                    href={businessInfo.zaloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <MessageCircle size={16} />
                                    Chat Zalo
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quotation Form / Calculation Table */}
                    <div className="lg:col-span-7 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                        {isSubmitted ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/60 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={36} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Gửi Yêu Cầu Báo Giá Thành Công!
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                    Cảm ơn quý khách <strong>{name || 'quý khách'}</strong>! Chuyên viên <strong>Hồng Thương (0379.398.798)</strong> đang chuẩn bị file báo giá lăn bánh xe <strong>{currentCar.name}</strong> và sẽ liên hệ trong ít phút.
                                </p>
                                <div className="pt-4 flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsSubmitted(false)}
                                        className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-sm rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Nhập lại yêu cầu khác
                                    </button>
                                    <a
                                        href={`tel:${businessInfo.hotlineSalesRaw}`}
                                        className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow"
                                    >
                                        <Phone size={16} /> Gọi Hotline Ngay
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">
                                        Bảng Đăng Ký Nhận Báo Giá
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        Điền thông tin bên dưới để nhận ngay bảng giá ưu đãi lăn bánh mới nhất hôm nay
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Select Category */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            1. Chọn phân khúc xe:
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => {
                                                setSelectedCategory(e.target.value);
                                                const firstCar = (e.target.value === 'all' ? carsData : carsData.filter(c => c.category === e.target.value))[0];
                                                if (firstCar) setSelectedCar(firstCar.id);
                                            }}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        >
                                            {carCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Select Specific Model */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            2. Chọn dòng xe cụ thể:
                                        </label>
                                        <select
                                            value={selectedCar}
                                            onChange={(e) => setSelectedCar(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        >
                                            {availableCars.map(car => (
                                                <option key={car.id} value={car.id}>{car.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Method Radio */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1.5">
                                        3. Hình thức thanh toán:
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-semibold ${
                                            paymentMethod === 'vay-85'
                                                ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-600 dark:text-red-400'
                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={paymentMethod === 'vay-85'}
                                                onChange={() => setPaymentMethod('vay-85')}
                                                className="text-red-600 focus:ring-red-500"
                                            />
                                            <span>Trả góp ngân hàng (85%)</span>
                                        </label>

                                        <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs sm:text-sm font-semibold ${
                                            paymentMethod === 'tra-thang'
                                                ? 'bg-red-50 dark:bg-red-950/40 border-red-600 text-red-600 dark:text-red-400'
                                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                checked={paymentMethod === 'tra-thang'}
                                                onChange={() => setPaymentMethod('tra-thang')}
                                                className="text-red-600 focus:ring-red-500"
                                            />
                                            <span>Thanh toán 100% (Trả thẳng)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Customer info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            Họ và tên quý khách: *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ví dụ: Nguyễn Văn A..."
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            Số điện thoại / Zalo nhận báo giá: *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Ví dụ: 0987.xxx.xxx"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            Tỉnh/Thành phố nhận xe:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="TP.HCM, Cần Thơ, Long An, Tiền Giang..."
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                            Yêu cầu đặc biệt (Ghi chú):
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Lái thử tận nhà, màu xe, thời gian nhận xe..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm sm:text-base mt-2"
                                >
                                    <Send size={18} />
                                    Gửi Yêu Cầu Nhận Báo Giá Lăn Bánh Ngay
                                </button>
                                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    🔒 Cam kết bảo mật thông tin 100% - Tư vấn báo giá miễn phí, không phát sinh chi phí.
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuoteFormSection;
