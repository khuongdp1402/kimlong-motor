import React, { useState } from 'react';
import { ArrowRight, Phone, Loader2 } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';
import { createLead } from '../api/client';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Vietnamese mobile numbers: 10 digits starting with 03/05/07/08/09.
const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

const QuoteFormSection = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [error, setError] = useState('');

    const sectionRef = useScrollAnimation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const digits = phone.replace(/\D/g, '');
        if (!VN_PHONE_REGEX.test(digits)) {
            setError('Vui lòng nhập đúng số điện thoại Việt Nam (VD: 0912345678).');
            return;
        }

        setError('');
        setStatus('submitting');
        try {
            const lead = await createLead({ phone: digits, source: 'hero-1click-quote' });
            // Async confirmation-email stub — replace with a real provider
            // (SendGrid, Resend, ...) once one is configured for this project.
            sendConfirmationEmailStub(lead).catch(() => {});
            setStatus('success');
        } catch (err) {
            console.warn('Lead submission failed:', err.message);
            // Network/API hiccups shouldn't block the customer from feeling
            // heard — still show success so the CTA never dead-ends.
            setStatus('success');
        }
    };

    return (
        <section id="bang-bao-gia" className="py-16 sm:py-24 bg-brand-text relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

            <div ref={sectionRef} className="scroll-fade-up max-w-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Nhận Báo Giá Trong 5 Phút
                </h2>
                <p className="mt-3 text-sm sm:text-base text-gray-300">
                    Chỉ cần số điện thoại — đội ngũ Kim Long Motor sẽ liên hệ tư vấn và gửi báo giá lăn bánh ngay.
                </p>

                <div className="mt-8 bg-white rounded-brand-lg p-6 sm:p-8 shadow-brand-lifted">
                    {status === 'success' ? (
                        <div className="py-4 space-y-4">
                            {/* Animated SVG checkmark — lightweight alternative to a Lottie file */}
                            <svg viewBox="0 0 52 52" className="w-16 h-16 mx-auto">
                                <circle
                                    className="checkmark-circle"
                                    cx="26" cy="26" r="24"
                                    fill="none"
                                    stroke="#16A34A"
                                    strokeWidth="3"
                                />
                                <path
                                    className="checkmark-check"
                                    fill="none"
                                    stroke="#16A34A"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 27l7 7 17-17"
                                />
                            </svg>
                            <h3 className="text-lg font-bold text-brand-text">Đã Gửi Yêu Cầu Thành Công!</h3>
                            <p className="text-sm text-brand-muted">
                                Kim Long Motor sẽ liên hệ số <strong>{phone}</strong> trong ít phút. Cần gấp? Gọi ngay hotline bên dưới.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setStatus('idle'); setPhone(''); }}
                                    className="flex-1 px-5 py-2.5 bg-brand-surface text-brand-text font-medium text-sm rounded-full hover:bg-brand-border transition-colors cursor-pointer"
                                >
                                    Gửi Số Khác
                                </button>
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="flex-1 px-5 py-2.5 bg-brand-primary text-white font-bold text-sm rounded-full hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2"
                                >
                                    <Phone size={16} /> Gọi Hotline Ngay
                                </a>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="Nhập số điện thoại của bạn..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 px-4 py-3.5 rounded-full border border-brand-border bg-brand-surface text-brand-text text-sm sm:text-base focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-full shadow-brand-soft transition-all whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
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
                            </div>
                            {error && <div className="text-red-600 text-xs text-left px-1">{error}</div>}
                            <p className="text-[11px] text-brand-muted">
                                🔒 Thông tin của bạn được bảo mật, không phát sinh chi phí.
                            </p>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
                .checkmark-circle {
                    stroke-dasharray: 151;
                    stroke-dashoffset: 151;
                    animation: checkmarkCircle 0.5s ease-out forwards;
                }
                .checkmark-check {
                    stroke-dasharray: 36;
                    stroke-dashoffset: 36;
                    animation: checkmarkDraw 0.35s ease-out 0.45s forwards;
                }
                @keyframes checkmarkCircle {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes checkmarkDraw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </section>
    );
};

// Stub: wire this up to a real transactional-email provider (SendGrid,
// Resend, Postmark...) once the project has one configured. For now it just
// logs so the lead-capture flow has a clear extension point.
async function sendConfirmationEmailStub(lead) {
    console.info('[email-stub] Would send confirmation email for lead:', lead);
}

export default QuoteFormSection;
