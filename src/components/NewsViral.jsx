import React from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { getArticles } from '../api/client';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// "Tin Tức Nổi Bật" — exactly 4 cards: 1 large featured + 3 side items.
const NewsViral = () => {
    const { data: articles } = useApiData(getArticles, []);
    const all = articles || [];
    const featured = all.filter((a) => a.featured);
    const latestNews = (featured.length > 0 ? featured : all)
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 4);

    const sectionRef = useScrollAnimation();

    if (!latestNews.length) return null;

    const [main, ...rest] = latestNews;

    return (
        <section id="news" className="py-16 sm:py-20 bg-brand-bg">
            <div ref={sectionRef} className="scroll-fade-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text uppercase">
                        Tin Tức Nổi Bật
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Featured large article */}
                    <Link
                        to={`/news/${main.slug || main.id}`}
                        className="group relative rounded-brand-lg overflow-hidden border border-brand-border shadow-brand-soft bg-white flex flex-col"
                    >
                        <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden">
                            {main.image ? (
                                <img
                                    src={main.image}
                                    alt={main.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-brand-surface" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            {main.category && (
                                <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                                    {main.category}
                                </span>
                            )}
                            {formatDate(main.date) && (
                                <span className="absolute top-3 right-3 bg-white/90 text-brand-text text-[10px] font-bold px-2.5 py-1 rounded-full">
                                    {formatDate(main.date)}
                                </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                <p className="text-white text-base sm:text-xl font-bold leading-snug line-clamp-3">
                                    {main.title}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* 3 side articles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        {rest.map((item) => (
                            <Link
                                key={item.id}
                                to={`/news/${item.slug || item.id}`}
                                className="group flex gap-3 sm:flex-col lg:flex-row items-stretch bg-white rounded-brand-lg border border-brand-border shadow-brand-soft overflow-hidden hover:shadow-brand-lifted transition-shadow"
                            >
                                <div className="relative w-28 sm:w-full lg:w-28 shrink-0 h-24 sm:h-32 lg:h-24 overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-surface" />
                                    )}
                                    {formatDate(item.date) && (
                                        <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            {formatDate(item.date)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 py-2 pr-3 flex flex-col justify-center min-w-0">
                                    {item.category && (
                                        <span className="text-[10px] font-bold uppercase text-brand-primary mb-1">
                                            {item.category}
                                        </span>
                                    )}
                                    <p className="text-xs sm:text-sm font-semibold text-brand-text group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                                        {item.title}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to="/news"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-brand-primary hover:bg-brand-primary-dark font-semibold transition-colors"
                    >
                        Xem Tất Cả Tin Tức
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewsViral;
