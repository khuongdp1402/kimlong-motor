import React from 'react';

// Zalo brand icon — chat-bubble silhouette with "Zalo" text.
// `bare` skips the blue badge background, for use inside an already-colored
// container (e.g. a floating bubble).
const ZaloIcon = ({ size = 18, className = '', bare = false }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {!bare && <rect width="48" height="48" rx="12" fill="#0068FF" />}
        {/* Chat bubble outline */}
        <path
            d="M24 8C14.06 8 6 14.94 6 23.5c0 4.58 2.26 8.7 5.82 11.48-.16 1.98-1.04 3.76-2.4 5.16a.75.75 0 0 0 .54 1.28c3.06-.08 5.84-1.34 7.88-3.28 1.9.54 3.96.86 6.16.86 9.94 0 18-6.94 18-15.5S33.94 8 24 8Z"
            fill="white"
        />
        {/* "Zalo" text inside the bubble */}
        <text
            x="24"
            y="27"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="900"
            fontFamily="Arial, Helvetica, sans-serif"
            fill="#0068FF"
            letterSpacing="-0.3"
        >
            Zalo
        </text>
    </svg>
);

export default ZaloIcon;
