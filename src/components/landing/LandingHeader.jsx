import React from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';

const NAV_LINKS = [
    { id: 'san-pham', label: 'Sản phẩm' },
    { id: 'tin-tuc', label: 'Tin tức' },
    { id: 'mang-xa-hoi', label: 'Video' },
    { id: 'lien-he', label: 'Liên hệ' },
];

const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const LandingHeader = () => {
    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between gap-4">
                <img
                    src="/images/logo-official.png"
                    alt={businessInfo.shortName}
                    className="h-9 w-auto"
                    onError={(e) => { e.currentTarget.src = '/images/logo-ngang-do.png'; }}
                />

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => scrollToId(link.id)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <a
                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                    <Phone size={15} />
                    <span className="hidden sm:inline">{businessInfo.hotlineSales}</span>
                </a>
            </div>
        </header>
    );
};

export default LandingHeader;
