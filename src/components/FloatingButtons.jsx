import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, Youtube } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';

const FloatingButtons = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    return (
        <aside aria-label="Nút liên hệ nhanh">
            {/* Left Bottom: Quick Call Hotline Pill */}
            <div className="fixed left-4 bottom-4 z-40 hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white pl-2 pr-4 py-2 rounded-full shadow-2xl transition-all transform hover:scale-105 border border-white/20">
                <div className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center font-bold shadow animate-bounce">
                    <Phone size={18} />
                </div>
                <div>
                    <div className="text-[10px] uppercase font-bold text-red-100 tracking-wider">Hotline Tư Vấn</div>
                    <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="text-sm font-black tracking-wide">
                        {businessInfo.hotlineSales}
                    </a>
                </div>
            </div>

            {/* Right Bottom: Social & Action Floating Bar */}
            <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5">
                {/* TikTok */}
                <a
                    href={businessInfo.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border border-gray-700 group relative"
                    aria-label="TikTok @thuongkimlong"
                >
                    <span className="text-lg">🎵</span>
                    <span className="absolute right-14 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        TikTok @thuongkimlong
                    </span>
                </a>

                {/* YouTube */}
                <a
                    href={businessInfo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 group relative"
                    aria-label="YouTube @thuongkimlong"
                >
                    <Youtube size={22} />
                    <span className="absolute right-14 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        YouTube @thuongkimlong
                    </span>
                </a>

                {/* Zalo */}
                <a
                    href={businessInfo.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse group relative"
                    aria-label="Chat Zalo"
                >
                    <span className="font-bold text-xs tracking-tighter">ZALO</span>
                    <span className="absolute right-14 bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat Zalo: {businessInfo.hotlineSales}
                    </span>
                </a>

                {/* Direct Call Button (Sales) */}
                <a
                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                    className="w-13 h-13 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-110 animate-bounce group relative border-2 border-white"
                    aria-label="Gọi điện Hotline"
                >
                    <Phone size={22} />
                    <span className="absolute right-16 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Gọi tư vấn: {businessInfo.hotlineSales}
                    </span>
                </a>

                {/* Scroll to Top */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="w-10 h-10 bg-gray-800/90 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
                        aria-label="Lên đầu trang"
                    >
                        <ArrowUp size={18} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default FloatingButtons;
