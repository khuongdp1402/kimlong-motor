import { useEffect } from 'react';
import { businessInfo } from '../data/hongthuong-data';

const SCRIPT_ID = 'seo-jsonld-autodealer';

// Injects AutoDealer + AutomotiveBusiness structured data for local SEO/GEO.
// Uses the real dealer address (Tân Nhựt, TP.HCM) — the Huế site is the
// factory, not the customer-facing point of sale, so it isn't the subject
// of this schema.
const SeoJsonLd = () => {
    useEffect(() => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': ['AutoDealer', 'AutomotiveBusiness'],
            name: 'Kim Long Motor',
            image: `${window.location.origin}${businessInfo.logoUrl}`,
            url: window.location.origin,
            telephone: businessInfo.hotlineSalesRaw,
            priceRange: '$$',
            address: {
                '@type': 'PostalAddress',
                streetAddress: businessInfo.addressShort,
                addressLocality: 'Thành phố Hồ Chí Minh',
                addressCountry: 'VN',
            },
            areaServed: {
                '@type': 'Country',
                name: 'Vietnam',
            },
            sameAs: [businessInfo.youtubeUrl, businessInfo.tiktokUrl].filter(Boolean),
            makesOffer: {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Product',
                    name: 'Xe khách, xe tải và xe chuyên dùng Kim Long Motor',
                },
            },
        };

        let script = document.getElementById(SCRIPT_ID);
        if (!script) {
            script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema);

        return () => {
            // Leave the tag in place across route changes within the SPA;
            // only the Home page mounts this component today.
        };
    }, []);

    return null;
};

export default SeoJsonLd;
