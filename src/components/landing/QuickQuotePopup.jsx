import React, { useEffect, useState } from 'react';
import { X, Phone } from 'lucide-react';
import { createLead } from '../../api/client';
import { businessInfo } from '../../data/hongthuong-data';
import ZaloIcon from './ZaloIcon';

// Lightweight "just leave your phone number" popup — used both for the
// auto-popup shown 5s after landing on the page, and for every "Liên hệ báo
// giá" button on a product card. Only the phone number is required; the
// submission goes through the same /api/leads endpoint (and SMTP email) as
// the full contact form at the bottom of the page.
const QuickQuotePopup = ({ open, onClose, productName }) => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    useEffect(() => {
        if (open) {
            setPhone('');
            setStatus('idle');
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await createLead({
                phone,
                productName: productName || '',
                source: productName ? 'landing_product_popup' : 'landing_auto_popup',
            });
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 sm:p-7"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {status === 'sent' ? (
                    <div className="text-center py-4">
                        <p className="text-lg font-bold text-slate-900 mb-2">Cảm ơn bạn!</p>
                        <p className="text-sm text-slate-500">Chúng tôi sẽ gọi lại tư vấn trong thời gian sớm nhất.</p>
                        <button
                            onClick={onClose}
                            className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-extrabold text-slate-900">
                            {productName ? `Nhận báo giá: ${productName}` : 'Nhận báo giá nhanh'}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Để lại số điện thoại, đội ngũ Kim Long Motor sẽ gọi lại tư vấn ngay.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    required
                                    autoFocus
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Số điện thoại của bạn"
                                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wide"
                            >
                                {status === 'sending' ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                            </button>
                            {status === 'error' && (
                                <p className="text-sm text-red-600 font-medium text-center">
                                    Có lỗi xảy ra, vui lòng gọi hotline {businessInfo.hotlineSales}.
                                </p>
                            )}
                        </form>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400 text-center mb-3">Hoặc liên hệ nhanh</p>
                            <div className="flex gap-3">
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                >
                                    <Phone size={16} /> Gọi ngay
                                </a>
                                <a
                                    href={businessInfo.zaloUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                >
                                    <ZaloIcon size={16} /> Nhắn Zalo
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuickQuotePopup;
