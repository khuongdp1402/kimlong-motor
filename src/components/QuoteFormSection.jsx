import React, { useState } from 'react';
import { ArrowRight, Phone, Loader2 } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';
import { createLead } from '../api/client';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';

// Vietnamese mobile numbers: 10 digits starting with 03/05/07/08/09.
const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

// Stub: wire to a real transactional-email provider once one is configured.
async function sendConfirmationEmailStub(lead) {
    console.info('[email-stub] Would send confirmation email for lead:', lead);
}

// Cinematic one-field quote CTA.
const QuoteFormSection = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success
    const [error, setError] = useState('');

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
            const lead = await createLead({ phone: digits, source: 'home-1click-quote' });
            sendConfirmationEmailStub(lead).catch(() => {});
        } catch (err) {
            console.warn('Lead submission failed:', err.message);
        }
        setStatus('success');
    };

    return (
        <section id="bang-bao-gia" className="relative overflow-hidden bg-noir-950 py-28 sm:py-40">
            <img src="/images/banners/banner-xetai.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-noir-950 via-noir-950/70 to-noir-950" />

            <div className="relative max-w-3xl mx-auto px-5 sm:px-6 text-center">
                <Reveal className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">Báo giá lăn bánh</Reveal>
                <SplitHeading className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink">
                    Nhận báo giá trong 5 phút
                </SplitHeading>
                <Reveal delay={0.1}>
                    <p className="mt-5 text-base sm:text-lg text-ink-muted">Chỉ cần số điện thoại — chuyên viên Kim Long Motor sẽ gọi lại tư vấn và gửi báo giá ngay.</p>
                </Reveal>

                <Reveal delay={0.2} className="mt-10">
                    {status === 'success' ? (
                        <div className="rounded-[24px] border border-line bg-graphite-800/80 backdrop-blur p-8">
                            <p className="text-lg font-bold text-ink">Đã nhận yêu cầu của bạn!</p>
                            <p className="mt-2 text-sm text-ink-muted">Kim Long Motor sẽ liên hệ số <strong className="text-ink">{phone}</strong> trong ít phút.</p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <button type="button" onClick={() => { setStatus('idle'); setPhone(''); }} className="px-5 py-2.5 rounded-full border border-white/20 text-ink text-sm font-semibold hover:border-white/50 cursor-pointer">Gửi số khác</button>
                                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold inline-flex items-center justify-center gap-2"><Phone size={15} /> {businessInfo.hotlineSales}</a>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
                            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-[28px] sm:rounded-full border border-white/15 bg-graphite-800/80 backdrop-blur">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    aria-label="Số điện thoại"
                                    placeholder="Nhập số điện thoại của bạn..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 bg-transparent px-5 py-3 text-ink placeholder:text-ink-muted focus:outline-none"
                                />
                                <button type="submit" disabled={status === 'submitting'} className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full whitespace-nowrap cursor-pointer disabled:cursor-not-allowed">
                                    {status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : <>Nhận báo giá <ArrowRight size={16} /></>}
                                </button>
                            </div>
                            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                            <p className="mt-4 text-xs text-ink-muted">Thông tin được bảo mật, tư vấn miễn phí.</p>
                        </form>
                    )}
                </Reveal>
            </div>
        </section>
    );
};

export default QuoteFormSection;
