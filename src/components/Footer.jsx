import React from 'react';
import { Phone, MapPin, Wrench, Youtube } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { businessInfo, carCategories } from '../data/hongthuong-data';

const SocialIconButton = ({ href, label, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-full border border-line hover:border-white/40 text-ink flex items-center justify-center transition-colors">
        {children}
    </a>
);

// Noir footer with an oversized wordmark across the bottom.
const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const scrollTo = (id) => {
        if (pathname !== '/') {
            navigate('/');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer id="lien-he" className="force-dark bg-noir-900 text-ink border-t border-line overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-5 space-y-5">
                        <img src="/images/logo-official.png" alt="Kim Long Motor" className="h-12 w-auto" onError={(e) => { e.currentTarget.src = '/images/logo-ngang-do.png'; }} />
                        <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
                            Đại lý phân phối chính hãng xe khách giường nằm, xe ghế Universe, xe van điện GK 48EV, xe tải KIMAN9 và đầu kéo điện K9KEV.
                        </p>
                        <p className="flex items-start gap-2 text-sm text-ink-muted">
                            <MapPin size={16} className="text-accent shrink-0 mt-0.5" /> {businessInfo.address}
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-5">Dòng xe</h3>
                        <ul className="space-y-3 text-sm">
                            {carCategories.filter((c) => c.id !== 'all').map((cat) => (
                                <li key={cat.id}>
                                    <button onClick={() => scrollTo('danh-muc-xe')} className="text-ink hover:text-accent transition-colors cursor-pointer text-left">{cat.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-5">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                                    <Phone size={16} className="text-accent" />
                                    <span><span className="block text-xs text-ink-muted">Bán hàng</span><span className="text-lg font-bold tabular-nums">{businessInfo.hotlineSales}</span></span>
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                                    <Wrench size={16} className="text-accent" />
                                    <span><span className="block text-xs text-ink-muted">Kỹ thuật 24/7</span><span className="text-lg font-bold tabular-nums">{businessInfo.hotlineService}</span></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-ink-muted">
                    <div className="flex items-center gap-5">
                        <span>© {new Date().getFullYear()} Kim Long Motor</span>
                        <button onClick={() => scrollTo('ve-chung-toi')} className="hover:text-ink cursor-pointer">Về chúng tôi</button>
                        <button onClick={() => scrollTo('bang-bao-gia')} className="hover:text-ink cursor-pointer">Báo giá</button>
                    </div>
                    <div className="flex items-center gap-3">
                        <SocialIconButton href={businessInfo.youtubeUrl} label="YouTube"><Youtube size={16} /></SocialIconButton>
                        <SocialIconButton href={businessInfo.tiktokUrl} label="TikTok"><span className="text-sm">♪</span></SocialIconButton>
                    </div>
                </div>
            </div>

            <div aria-hidden="true" className="select-none pointer-events-none mt-10 -mb-[0.18em] text-center font-extrabold tracking-tighter leading-none text-[10.5vw] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)] whitespace-nowrap">
                KIM LONG MOTOR
            </div>
        </footer>
    );
};

export default Footer;
