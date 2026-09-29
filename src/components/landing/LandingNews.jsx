import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../../api/client';
import Reveal from '../motion/Reveal';

const LandingNews = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles()
            .then((data) => setArticles(
                (data || [])
                    // `featured` is the admin's show/hide switch. With dozens of
                    // articles in the catalogue, the landing page shows only
                    // what an editor has deliberately turned on.
                    .filter((a) => a.featured)
                    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
                    .slice(0, 3)
            ))
            .catch(() => setArticles([]));
    }, []);

    if (articles.length === 0) return null;

    return (
        <section id="tin-tuc" className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                <Reveal>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Tin Tức</h2>
                    <p className="mt-2 text-slate-500 text-center">Cập nhật mới nhất từ Kim Long Motor</p>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {articles.map((a, i) => (
                        <Reveal key={a.id} delay={i * 0.08} as={Link} to={`/news/${a.slug || a.id}`}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                        >
                            <div className="h-40 bg-slate-100 overflow-hidden">
                                {a.image && <img src={a.image} alt={a.title} className="h-full w-full object-cover" />}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 line-clamp-2">{a.title}</h3>
                                {a.excerpt && <p className="mt-2 text-sm text-slate-500 line-clamp-2">{a.excerpt}</p>}
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Only a curated few are shown above; the rest stay reachable. */}
                <Reveal delay={0.24} className="mt-10 text-center">
                    <Link
                        to="/news"
                        className="inline-flex items-center gap-2 border border-slate-300 hover:border-red-600 hover:text-red-600 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                    >
                        Xem tất cả tin tức
                    </Link>
                </Reveal>
            </div>
        </section>
    );
};

export default LandingNews;
