import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, FileText, Sun, Moon } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';
import { useThemeMode } from '../context/themeMode';

const Navbar = ({ onOpenQuoteModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mode, toggleMode } = useThemeMode();
    const isDark = mode === 'dark';
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    // Detail pages have no dark hero behind the header, so in light mode the
    // transparent top state would put white text on a light page.
    const onHeroLessPage = /^\/(product|news)\/.+/.test(location.pathname);
    const solidBar = scrolled || (!isDark && onHeroLessPage);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const goTo = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    const navLinks = [
        { label: 'Trang Chủ', action: () => scrollTo('hero'), active: true },
        { label: 'Danh Mục Xe', action: () => scrollTo('danh-muc-xe') },
        { label: 'Dịch Vụ', action: () => scrollTo('bang-bao-gia') },
        { label: 'Tin Tức', action: () => goTo('/news') },
        { label: 'Về Chúng Tôi', action: () => scrollTo('ve-chung-toi') },
    ];

    return (
        <header className="fixed w-full z-50 top-0 left-0">
            <nav
                className={`transition-all duration-500 ${
                    solidBar
                        ? 'bg-gray-950/98 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.3)]'
                        : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent'
                }`}
            >
                <div className={`max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 flex items-center transition-all duration-500 ${
                    scrolled ? 'h-14' : 'h-16 sm:h-20'
                }`}>

                    {/* ─── LEFT: Navigation Links ─── */}
                    <div className="hidden lg:flex items-center gap-1 flex-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                className={`relative text-[13px] font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap rounded-md px-3.5 py-1.5 ${
                                    link.active
                                        ? 'text-white bg-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* ─── CENTER: Logo ─── */}
                    <button
                        onClick={() => scrollTo('hero')}
                        className="flex items-center gap-3 focus:outline-none group cursor-pointer mx-auto lg:mx-0 shrink-0"
                    >
                        <img
                            src="/images/logo-official.png"
                            alt="Kim Long Motor"
                            className={`w-auto object-contain transition-all duration-500 ${
                                scrolled ? 'h-8' : 'h-9 sm:h-12'
                            }`}
                            onError={(e) => { e.target.src = '/images/logo-ngang-do.png'; }}
                        />
                    </button>

                    {/* ─── RIGHT: Action Buttons ─── */}
                    <div className="flex items-center gap-2.5 flex-1 justify-end">
                        {/* Dark / light mode toggle */}
                        <button
                            type="button"
                            onClick={toggleMode}
                            aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                            title={isDark ? 'Giao diện sáng' : 'Giao diện tối'}
                            className="w-9 h-9 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Phone — ghost/outlined style */}
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className={`hidden md:inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-all rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 ${
                                scrolled
                                    ? 'text-xs px-3.5 py-1.5'
                                    : 'text-[13px] px-4 py-2'
                            }`}
                        >
                            <Phone size={13} className="text-green-400" />
                            {businessInfo.hotlineSales}
                        </a>

                        {/* CTA — filled red */}
                        <button
                            onClick={onOpenQuoteModal}
                            className={`inline-flex items-center gap-1.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-full shadow-md transition-all hover:shadow-lg hover:shadow-red-600/20 cursor-pointer ${
                                scrolled
                                    ? 'text-xs px-3.5 py-1.5'
                                    : 'text-[13px] px-4 sm:px-5 py-2 sm:py-2.5'
                            }`}
                        >
                            <FileText size={14} />
                            <span className="hidden sm:inline">Nhận Báo Giá</span>
                            <span className="sm:hidden">Báo Giá</span>
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none cursor-pointer"
                        >
                            {!isOpen ? <Menu size={22} /> : <X size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── Mobile Dropdown ─── */}
            {isOpen && (
                <div className="lg:hidden bg-gray-950/98 backdrop-blur-lg border-t border-white/5 animate-fadeIn">
                    <div className="max-w-lg mx-auto px-5 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                className={`w-full text-left py-2.5 px-4 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                                    link.active
                                        ? 'text-white bg-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}

                        <div className="pt-3 mt-2 border-t border-white/10 flex gap-2">
                            <button
                                onClick={() => { setIsOpen(false); onOpenQuoteModal(); }}
                                className="flex-1 bg-accent text-white font-bold py-2.5 rounded-full text-center text-sm cursor-pointer"
                            >
                                Nhận Báo Giá
                            </button>
                            <a
                                href={`tel:${businessInfo.hotlineSalesRaw}`}
                                className="flex-1 bg-white/10 text-white font-bold py-2.5 rounded-full text-center text-sm flex items-center justify-center gap-1.5"
                            >
                                <Phone size={13} /> Gọi Ngay
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
