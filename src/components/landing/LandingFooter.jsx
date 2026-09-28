import React from 'react';
import { businessInfo } from '../../data/hongthuong-data';

const LandingFooter = () => (
    <footer className="bg-slate-900 text-slate-300 py-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
                <img
                    src="/images/logo-official.png"
                    alt={businessInfo.shortName}
                    className="h-8 w-auto"
                    onError={(e) => { e.currentTarget.src = '/images/logo-ngang-do.png'; }}
                />
                <span>© {new Date().getFullYear()} {businessInfo.shortName}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="hover:text-white transition-colors">{businessInfo.hotlineSales}</a>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{businessInfo.addressShort}</span>
            </div>
        </div>
    </footer>
);

export default LandingFooter;
