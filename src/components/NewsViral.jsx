import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { getArticles } from '../api/client';
import { getNewsCategoryLabel } from '../data/newsCategories';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import ImageReveal from './motion/ImageReveal';
import { GhostButton } from './ui/Buttons';

const formatDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Section 06 — one large featured story + three side stories.
const NewsViral = () => {
    const navigate = useNavigate();
    const { data: articles } = useApiData(getArticles, []);
    const all = articles || [];
    const featured = all.filter((a) => a.featured);
    const news = (featured.length ? featured : all)
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 4);

    if (!news.length) return null;
    const [main, ...rest] = news;
    const href = (a) => `/news/${a.slug || a.id}`;

    return (
        <section id="news" className="bg-noir-900 py-24 sm:py-36">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
                    <SectionHeader number="06" eyebrow="Tin tức" title="Câu chuyện từ Kim Long Motor" />
                    <GhostButton onClick={() => navigate('/news')}>Tất cả tin tức</GhostButton>
                </div>

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <Reveal className="lg:col-span-7">
                        <Link to={href(main)} className="group block">
                            <ImageReveal src={main.image} alt={main.title} className="rounded-[24px] aspect-[16/10]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                            <div className="mt-5 flex items-center gap-3 text-xs text-ink-muted">
                                <span className="text-accent font-semibold uppercase tracking-[0.18em]">{getNewsCategoryLabel(main.category)}</span>
                                <span>{formatDate(main.date)}</span>
                            </div>
                            <h3 data-cms-content className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-ink leading-snug group-hover:text-white">{main.title}</h3>
                        </Link>
                    </Reveal>

                    <div className="lg:col-span-5 border-t border-line">
                        {rest.map((item, idx) => (
                            <Reveal key={item.id} delay={idx * 0.08}>
                                <Link to={href(item)} className="group grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] gap-5 py-6 border-b border-line">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-graphite-800">
                                        {item.image && <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] text-ink-muted">{formatDate(item.date)}</div>
                                        <h3 data-cms-content className="mt-1.5 text-sm sm:text-base font-semibold text-ink leading-snug line-clamp-3 group-hover:text-white">{item.title}</h3>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsViral;
