import React from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';
import ZaloIcon from './ZaloIcon';

// Persistent floating contact bubbles, fixed to the bottom-right corner of
// the viewport on every section — independent of (not inline next to) the
// "Gọi ngay" buttons elsewhere on the page.
const LandingFloatingContact = () => (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
        <a
            href={businessInfo.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn Zalo"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#0068FF] shadow-lg hover:scale-105 transition-transform"
        >
            <span className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-40" />
            <ZaloIcon size={26} className="relative" bare />
        </a>
        <a
            href={`tel:${businessInfo.hotlineSalesRaw}`}
            aria-label="Gọi ngay"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg hover:scale-105 transition-transform"
        >
            <Phone size={24} className="text-white" fill="white" />
        </a>
    </div>
);

export default LandingFloatingContact;
