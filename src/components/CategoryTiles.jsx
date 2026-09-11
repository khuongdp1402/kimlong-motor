import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { getCategoryTiles } from '../api/client';

// Homepage category quick-nav strip: 5-6 image tiles (Xe khách, xe cao cấp,
// xe tiêu chuẩn, xe tải, xe van...) each with a red CTA button — mirrors the
// real site's "brand accordion" widget right under the hero.
//
// The scraped `tile.link` values point at a single representative product's
// detail page on the *original* kimlongmiennam.com domain (e.g.
// "https://kimlongmiennam.com/san-pham/kim-long-...") rather than this app's
// own `/category/:slug` listing route, and some tiles have no link at all.
// Route by tile title instead of trusting that scraped URL, so every tile
// reliably lands on this app's own category listing (or the About page for
// the company-wide tile).
const TITLE_TO_CATEGORY_SLUG = [
    [/điện/i, 'xe-dien'],
    [/tải/i, 'xe-tai'],
    [/van/i, 'xe-van'],
    [/bus/i, 'xe-bus'],
    // "Cao Cấp" / "Tiêu Chuẩn" tiles both link to xe khách models on the real
    // site — anything else (incl. "Kim Long Miền Nam") falls through below.
    [/cao cấp|tiêu chuẩn|khách/i, 'xe-khach'],
];

function resolveTileTarget(title) {
    const match = TITLE_TO_CATEGORY_SLUG.find(([re]) => re.test(title || ''));
    if (match) return `/category/${match[1]}`;
    // Company-wide tile ("Kim Long Miền Nam") or anything unrecognized:
    // send to About rather than a dead/empty product link.
    return '/gioi-thieu';
}

const CategoryTiles = () => {
    const { data: tiles } = useApiData(getCategoryTiles, []);
    const navigate = useNavigate();

    if (!tiles || tiles.length === 0) return null;

    return (
        <section className="py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {tiles.map((tile, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(resolveTileTarget(tile.title))}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-40 text-left"
                        >
                            {tile.image ? (
                                <img
                                    src={tile.image}
                                    alt={tile.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col items-start gap-2">
                                <span className="text-white text-sm font-bold uppercase leading-tight drop-shadow">
                                    {tile.title}
                                </span>
                                <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold uppercase tracking-wide">
                                    Xem ngay
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryTiles;
