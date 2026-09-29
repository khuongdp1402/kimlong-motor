import React, { useState, useEffect } from 'react';
import { X, Phone, ArrowRight, Loader2, Gift } from 'lucide-react';
import { createLead } from '../api/client';

// Vietnamese mobile numbers: 10 digits starting with 03/05/07/08/09.
const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

// Auto-popup that appears after 5-7 seconds on homepage, asking for phone only.
const QuotePopup = () => {
    const [visible, setVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success
    const [error, setError] = useState('');
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Don't show again if user already dismissed or submitted in this session
        const alreadyShown = sessionStorage.getItem('quote-popup-shown');
        if (alreadyShown) return;

        const delay = 5000 + Math.random() * 2000; // 5-7 seconds
        const timer = setTimeout(() => {
            setVisible(true);
            sessionStorage.setItem('quote-popup-shown', '1');
        }, delay);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setDismissed(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const digits = phone.replace(/\D/g, '');
        if (!VN_PHONE_REGEX.test(digits)) {
            setError('Vui lòng nhập đúng số điện thoại (VD: 0912345678)');
            return;
        }
        setError('');
        setStatus('submitting');
        try {
            await createLead({ phone: digits, source: 'auto-popup' });
        } catch (err) {
            console.warn('Lead submission failed:', err.message);
        }
        setStatus('success');
    };

    if (!visible || dismissed) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div
                className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient header */}
                <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 px-6 pt-6 pb-8 text-white text-center relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                        aria-label="Đóng"
                    >
                        <X size={18} />
                    </button>

                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
                        <Gift size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        🔥 Nhận Báo Giá Ưu Đãi
                    </h3>
                    <p className="mt-2 text-sm text-white/80 max-w-xs mx-auto">
                        Chỉ cần số điện thoại — chuyên viên Kim Long Motor sẽ gọi lại tư vấn & gửi báo giá ưu đãi nhất trong 5 phút!
                    </p>
                </div>

                {/* Form body */}
                <div className="bg-white dark:bg-gray-900 px-6 py-6">
                    {status === 'success' ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Đã nhận thông tin!</h4>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Kim Long Motor sẽ gọi lại số <strong className="text-gray-900 dark:text-white">{phone}</strong> trong ít phút.
                            </p>
                            <button
                                onClick={handleClose}
                                className="mt-4 px-6 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                                    <Phone size={13} className="inline mr-1.5 text-red-500" />
                                    Số điện thoại của bạn
                                </label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="VD: 0912 345 678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-base focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all"
                                    autoFocus
                                />
                                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        Nhận Báo Giá Ngay
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                                🔒 Thông tin được bảo mật — Tư vấn miễn phí, không làm phiền
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuotePopup;
