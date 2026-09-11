import React from 'react';
import { Link } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { getArticles } from '../api/client';

// "Tin Tức Nổi Bật" — 4 news cards (image, category tag, title, excerpt,
// "Xem thêm" link), matching the real homepage section.
const NewsViral = () => {
    const { data: articles } = useApiData(getArticles, []);
    const all = articles || [];
    // Prefer admin-curated "featured" articles; if none are marked yet, fall
    // back to the 4 most recent so the section still shows something.
    const featured = all.filter((a) => a.featured);
    const latestNews = (featured.length > 0 ? featured : all)
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 4);

    if (!latestNews.length) return null;

    return (
        <section id="news" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Tin Tức Nổi Bật
                    </h2>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {latestNews.map((item) => (
                        <div key={item.id} className="flex flex-col rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                            <div className="flex-shrink-0 relative h-40">
                                {item.image ? (
                                    <img className="h-full w-full object-cover" src={item.image} alt={item.title} />
                                ) : (
                                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
                                )}
                                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
                                    {item.category}
                                </span>
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                                <Link to={`/news/${item.slug || item.id}`} className="block">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {item.excerpt}
                                    </p>
                                </Link>
                                <div className="mt-auto pt-3">
                                    <Link
                                        to={`/news/${item.slug || item.id}`}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold text-xs"
                                    >
                                        Xem thêm →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link to="/news" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors">
                        Xem tất cả tin tức
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewsViral;
