import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';

const QuoteFormSection = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <section id="bang-bao-gia" className="py-16 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#e53e3e_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight">
                        ĐĂNG KÝ NHẬN BÁO GIÁ & TƯ VẤN TRẢ GÓP 85%
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed">
                        Để lại thông tin, đội ngũ Kim Long Motor sẽ liên hệ gửi bảng báo giá lăn bánh chi tiết trong ít phút.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                    {isSubmitted ? (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/60 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gửi Yêu Cầu Thành Công!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                Cảm ơn quý khách <strong>{name || 'quý khách'}</strong>! Chuyên viên Kim Long Motor sẽ liên hệ với quý khách trong ít phút.
                            </p>
                            <div className="pt-4 flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSubmitted(false)}
                                    className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-sm rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                    Gửi yêu cầu khác
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                        Họ và tên: *
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
                                        Số điện thoại: *
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

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-1">
                                    Lời nhắn:
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Dòng xe quan tâm, hình thức thanh toán, thời gian nhận xe..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm sm:text-base mt-2"
                            >
                                <Send size={18} />
                                Yêu Cầu Báo Giá
                            </button>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone size={15} />
                                    {businessInfo.hotlineSales}
                                </a>
                                <a
                                    href={businessInfo.zaloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2.5 px-4 rounded-xl text-center text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={15} />
                                    Chat Zalo
                                </a>
                            </div>

                            <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                🔒 Cam kết bảo mật thông tin 100% - Tư vấn báo giá miễn phí, không phát sinh chi phí.
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default QuoteFormSection;
