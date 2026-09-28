import React from 'react';

// Small Zalo brand mark ("Z" glyph) — lucide-react has no Zalo icon, so this
// mirrors the site's other inline-SVG brand icon (TikTok) pattern and drops
// in anywhere a lucide icon would. `bare` skips the blue badge background,
// for use inside an already-colored container (e.g. a floating bubble).
const ZaloIcon = ({ size = 18, className = '', bare = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        {!bare && <rect width="24" height="24" rx="6" fill="#0068FF" />}
        <text
            x="12"
            y="16.5"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="800"
            fontFamily="Arial, sans-serif"
            fill="#ffffff"
        >
            Z
        </text>
    </svg>
);

export default ZaloIcon;
