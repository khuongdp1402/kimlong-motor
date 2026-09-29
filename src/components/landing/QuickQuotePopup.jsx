import React, { useEffect, useState } from 'react';
import { X, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { createLead } from '../../api/client';
import { businessInfo } from '../../data/hongthuong-data';
import ZaloIcon from './ZaloIcon';

// Full-featured "Contact us for a quote" popup — shown automatically when the
// user first visits the site. Contains name + phone form, plus all business
// contact channels (hotline, Zalo, address, hours).
const QuickQuotePopup = ({ open, onClose, productName }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    useEffect(() => {
        if (open) {
            setName('');
            setPhone('');
            setNote('');
            setStatus('idle');
        }
    }, [open]);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await createLead({
                name,
                phone,
                note,
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[popupSlideUp_0.35s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header banner */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 sm:px-8 sm:py-6">
                    <button
                        onClick={onClose}
                        aria-label="Đóng"
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={22} />
                    </button>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                        {productName ? `Báo giá: ${productName}` : 'Liên hệ nhận báo giá'}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/85">
                        Đội ngũ Kim Long Motor sẽ tư vấn & báo giá tốt nhất cho bạn
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5 sm:px-8 sm:py-6">
                    {status === 'sent' ? (
                        <div className="text-center py-4">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-bold text-slate-900 mb-1">Cảm ơn bạn!</p>
                            <p className="text-sm text-slate-500">Chúng tôi sẽ gọi lại tư vấn trong thời gian sớm nhất.</p>
                            <button
                                onClick={onClose}
                                className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                    />
                                </div>
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="tel"
                                            required
                                            autoFocus
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="0912 345 678"
                                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                        />
                                    </div>
                                </div>
                                {/* Note */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú (tùy chọn)</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Tôi quan tâm dòng xe khách 34 chỗ..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wide cursor-pointer"
                                >
                                    {status === 'sending' ? 'Đang gửi...' : 'Gửi Yêu Cầu Báo Giá'}
                                </button>
                                {status === 'error' && (
                                    <p className="text-sm text-red-600 font-medium text-center">
                                        Có lỗi xảy ra, vui lòng gọi hotline {businessInfo.hotlineSales}.
                                    </p>
                                )}
                            </form>

                            {/* Divider */}
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 text-center mb-3 uppercase tracking-wide">Hoặc liên hệ trực tiếp</p>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <a
                                        href={`tel:${businessInfo.hotlineSalesRaw}`}
                                        className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                    >
                                        <Phone size={15} className="text-red-500" /> {businessInfo.hotlineSales}
                                    </a>
                                    <a
                                        href={businessInfo.zaloUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                                    >
                                        <ZaloIcon size={16} /> Nhắn Zalo
                                    </a>
                                </div>

                                {/* Business info */}
                                <div className="mt-4 space-y-2 text-xs text-slate-500">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                        <span>{businessInfo.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-slate-400 shrink-0" />
                                        <span>Thứ 2 – Chủ nhật: 7:30 – 17:30</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Animation */}
            <style>{`
                @keyframes popupSlideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default QuickQuotePopup;
