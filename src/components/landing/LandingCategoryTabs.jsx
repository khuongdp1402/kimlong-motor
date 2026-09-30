import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/client';
import { landingCategories } from '../../data/landingCategories';
import LandingProductCard from './LandingProductCard';
import Reveal from '../motion/Reveal';

const LandingCategoryTabs = ({ onRequestQuote, onOpenDetail }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);

    useEffect(() => {
        getProducts()
            // `featured` is the admin's show/hide switch: only products turned
            // on there belong on the landing page.
            .then((data) => setProducts((data || []).filter((p) => p.featured)))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const isProductInCategory = (p, catSlug) => {
        if (p.category === catSlug) return true;
        if (catSlug === 'xe-dien') {
            return (
                p.category === 'xe-dien' ||
                p.category === 'ev' ||
                /\b(ev|dien|điện)\b/i.test(p.name) ||
                /-ev\b/i.test(p.name)
            );
        }
        return false;
    };

    // A tab with nothing behind it is a dead end for the visitor, so only
    // categories holding at least one visible product get one.
    const tabs = landingCategories.filter((cat) => products.some((p) => isProductInCategory(p, cat.slug)));

    // Derived rather than stored, so the selection cannot point at a tab that
    // stopped existing — no effect needed to repair it.
    const activeSlug = tabs.some((t) => t.slug === active) ? active : tabs[0]?.slug;
    const filtered = products.filter((p) => isProductInCategory(p, activeSlug));

    // Nothing to show — either nothing is turned on in admin, or what is turned
    // on sits outside the five categories. A heading over an empty grid reads
    // as a broken page, so the section stands down entirely.
    if (!loading && tabs.length === 0) return null;

    return (
        <section id="san-pham" className="py-8 sm:py-10 bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <Reveal as="div">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Danh Mục Sản Phẩm</h2>
                    <p className="mt-2 text-slate-500 text-center max-w-xl mx-auto">Chọn dòng xe phù hợp với nhu cầu của bạn</p>
                </Reveal>

                {/* Centered tab bar — only categories that have something to show */}
                {tabs.length > 1 && (
                    <Reveal as="div" delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
                        {tabs.map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => setActive(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeSlug === cat.slug
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </Reveal>
                )}

                <div className="mt-10">
                    {loading ? (
                        <p className="text-center text-slate-400">Đang tải...</p>
                    ) : (
                        <div key={activeSlug} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filtered.map((p, i) => (
                                <Reveal key={p.id} delay={Math.min(i, 4) * 0.06}>
                                    <LandingProductCard product={p} onRequestQuote={onRequestQuote} onOpenDetail={onOpenDetail} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LandingCategoryTabs;
