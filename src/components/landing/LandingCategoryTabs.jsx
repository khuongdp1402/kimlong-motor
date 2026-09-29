import React, { useEffect, useState } from 'react';
import { getProducts } from '../../api/client';
import { landingCategories, mapProductToLandingCategory } from '../../data/landingCategories';
import LandingProductCard from './LandingProductCard';
import Reveal from '../motion/Reveal';

const LandingCategoryTabs = ({ onRequestQuote }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(landingCategories[0].slug);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter((p) => mapProductToLandingCategory(p) === active);

    return (
        <section id="san-pham" className="py-8 sm:py-10 bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <Reveal as="div">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Danh Mục Sản Phẩm</h2>
                    <p className="mt-2 text-slate-500 text-center max-w-xl mx-auto">Chọn dòng xe phù hợp với nhu cầu của bạn</p>
                </Reveal>

                {/* Centered tab bar */}
                <Reveal as="div" delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
                    {landingCategories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => setActive(cat.slug)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${active === cat.slug
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </Reveal>

                <div className="mt-10">
                    {loading ? (
                        <p className="text-center text-slate-400">Đang tải...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-slate-400">Chưa có sản phẩm trong danh mục này.</p>
                    ) : (
                        <div key={active} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filtered.map((p, i) => (
                                <Reveal key={p.id} delay={Math.min(i, 4) * 0.06}>
                                    <LandingProductCard product={p} onRequestQuote={onRequestQuote} />
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
