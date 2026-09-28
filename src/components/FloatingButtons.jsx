import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, Youtube, X, MessageSquare } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';

const FloatingButtons = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Close FAB when clicking outside
    useEffect(() => {
        if (!fabOpen) return;
        const close = () => setFabOpen(false);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, [fabOpen]);

    const socialItems = [
        {
            href: `tel:${businessInfo.hotlineSalesRaw}`,
            label: `Gọi: ${businessInfo.hotlineSales}`,
            icon: <Phone size={18} />,
            bgClass: 'bg-red-600 hover:bg-red-700 text-white',
            external: false,
        },
        {
            href: businessInfo.zaloUrl,
            label: 'Chat Zalo',
            icon: <MessageSquare size={18} />,
            bgClass: 'bg-blue-600 hover:bg-blue-700 text-white',
            external: true,
        },
        {
            href: businessInfo.youtubeUrl,
            label: 'YouTube',
            icon: <Youtube size={18} />,
            bgClass: 'bg-red-600 hover:bg-red-700 text-white',
            external: true,
        },
        {
            href: businessInfo.tiktokUrl,
            label: 'TikTok',
            icon: <span className="text-sm">🎵</span>,
            bgClass: 'bg-gray-900 hover:bg-gray-800 text-white',
            external: true,
        },
    ];

    return (
        <aside aria-label="Nút liên hệ nhanh">
            {/* Right Bottom: FAB + Expandable Social Menu */}
            <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5">
                {/* Expanded items */}
                {fabOpen && (
                    <div
                        className="flex flex-col items-end gap-2 mb-1 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {socialItems.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                rel={item.external ? 'noopener noreferrer' : undefined}
                                className={`flex items-center gap-2.5 pl-4 pr-3 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 ${item.bgClass}`}
                                style={{
                                    animation: `heroFadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s both`,
                                }}
                            >
                                <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
                                {item.icon}
                            </a>
                        ))}
                    </div>
                )}

                {/* FAB Main Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setFabOpen((o) => !o);
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer border-2 border-white/30 ${
                        fabOpen
                            ? 'bg-gray-800 hover:bg-gray-700 text-white rotate-0'
                            : 'bg-red-600 hover:bg-red-700 text-white animate-pulse-ring'
                    }`}
                    aria-label={fabOpen ? 'Đóng menu liên hệ' : 'Mở menu liên hệ'}
                >
                    {fabOpen ? <X size={22} /> : <Phone size={22} />}
                </button>

                {/* Scroll to Top */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 bg-gray-800/90 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110 cursor-pointer"
                        aria-label="Lên đầu trang"
                    >
                        <ArrowUp size={18} />
                    </button>
                )}
            </div>

            {/* Inline keyframe for FAB item animation (reuses hero keyframe) */}
            <style>{`
                @keyframes heroFadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </aside>
    );
};

export default FloatingButtons;
