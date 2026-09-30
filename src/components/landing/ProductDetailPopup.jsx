import React, { useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { businessInfo } from '../../data/hongthuong-data';
import { useScrollLock } from '../../hooks/useScrollLock';

// What a visitor sees when they tap a vehicle on the landing page: enough to
// judge whether this is the right vehicle, and no more. The catalogue carries
// 30-odd specs per model, which is a spec sheet, not a decision aid — the
// scraped `highlights` field already holds the six that matter (engine, power,
// seats, fuel, weight, dimensions), so that is what this shows.
//
// Deliberately no price: the landing page asks for a phone number instead, and
// showing a figure here would undercut that.
const ProductDetailPopup = ({ product, onClose, onRequestQuote }) => {
    useScrollLock(Boolean(product));

    useEffect(() => {
        if (!product) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [product, onClose]);

    if (!product) return null;

    const highlights = product.highlights || [];
    const badges = product.badges || [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-full overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[popupSlideUp_0.35s_ease-out]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={product.name}
            >
                <button
                    onClick={onClose}
                    aria-label="Đóng"
                    className="absolute top-3 right-3 z-10 h-9 w-9 inline-flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                    <X size={18} />
                </button>

                {product.image && (
                    <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" />
                )}

                <div className="p-5 sm:p-6">
                    {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {badges.map((b) => (
                                <span key={b} className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                                    {b}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">{product.name}</h3>

                    {highlights.length > 0 && (
                        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 border-t border-slate-200 pt-4">
                            {highlights.map((h) => (
                                <div key={h.label}>
                                    <dt className="text-xs text-slate-500">{h.label}</dt>
                                    <dd className="text-sm font-semibold text-slate-900">{h.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}

                    {product.description && (
                        <p className="mt-4 text-sm text-slate-600 leading-relaxed line-clamp-4">{product.description}</p>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                        <button
                            onClick={() => onRequestQuote(product)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded-full transition-colors"
                        >
                            Liên hệ báo giá
                        </button>
                        <a
                            href={`tel:${businessInfo.hotlineSalesRaw}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-red-600 hover:text-red-600 text-slate-700 font-semibold text-sm py-3 rounded-full transition-colors"
                        >
                            <Phone size={15} />
                            {businessInfo.hotlineSales}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPopup;
