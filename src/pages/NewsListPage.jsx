import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { useApiData } from '../hooks/useApiData';
import { getArticles, createLead } from '../api/client';
import { productCategories } from '../data/categories';

const ITEMS_PER_PAGE = 6;
const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';
const HERO_IMAGE = '/images/about/about-1-page_1784600468_998950b3_medium.webp';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString || '';
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const ArticleCard = ({ item }) => (
    <Link
        to={`/news/${item.slug || item.id}`}
        className="flex flex-col rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
        <div className="relative h-44">
            {item.image ? (
                <img className="h-full w-full object-cover" src={item.image} alt={item.title} />
            ) : (
                <div className="h-full w-full bg-gray-200 dark:bg-gray-700" />
            )}
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                {item.category}
            </span>
        </div>
        <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-2">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span>•</span>
                <span>{item.author}</span>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2 mb-2">
                {item.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">{item.excerpt}</p>
            <span className="mt-3 text-red-600 dark:text-red-400 font-semibold text-sm">Xem thêm →</span>
        </div>
    </Link>
);

const NewsListPage = () => {
    const [page, setPage] = useState(1);
    const [phone, setPhone] = useState('');
    const [sent, setSent] = useState(false);
    const { data: articles, loading } = useApiData(getArticles, []);
    const all = (articles || []).slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    const brandArticles = all.filter((a) => a.category === 'Thương Hiệu');
    const newsArticles = all.filter((a) => a.category === 'Tin Tức');

    const totalPages = Math.max(1, Math.ceil(newsArticles.length / ITEMS_PER_PAGE));
    const start = (page - 1) * ITEMS_PER_PAGE;
    const currentNews = newsArticles.slice(start, start + ITEMS_PER_PAGE);

    const handlePageChange = (p) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmitPhone = async (e) => {
        e.preventDefault();
        if (!phone) return;
        try {
            await createLead({ phone, topic: 'Tư vấn từ trang tin tức', source: 'news_list_page' });
            setSent(true);
            setPhone('');
        } catch {
            setSent(true);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Hero */}
                <section className="relative h-64 md:h-80 overflow-hidden">
                    <img src={HERO_IMAGE} alt="Tin tức Kim Long Miền Nam" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
                        <h1 className="text-3xl md:text-4xl font-extrabold uppercase mb-3">
                            Cẩm Nang Vận Tải &amp; Tin Tức Kim Long
                        </h1>
                        <p className="text-gray-200 max-w-2xl">
                            Cập nhật tin tức thương hiệu, sản phẩm mới và kiến thức vận tải từ Kim Long Miền Nam.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors duration-300">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tìm Kiếm Sản Phẩm</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {productCategories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/category/${cat.slug}`}
                                            className="text-center bg-gray-50 dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg py-3 px-2 transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-red-600 rounded-xl p-5 text-white">
                                <h3 className="font-bold mb-2">Bạn cần hỗ trợ tư vấn?</h3>
                                <p className="text-sm text-red-100 mb-4">Để lại số điện thoại, Kim Long Miền Nam sẽ gọi lại tư vấn miễn phí.</p>
                                {sent ? (
                                    <p className="text-sm font-semibold bg-white/15 rounded-lg px-3 py-2">
                                        Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.
                                    </p>
                                ) : (
                                    <form onSubmit={handleSubmitPhone} className="flex gap-2">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Số điện thoại"
                                            required
                                            className="flex-1 min-w-0 px-3 py-2 rounded-lg text-gray-900 text-sm focus:outline-none"
                                        />
                                        <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                            Gửi
                                        </button>
                                    </form>
                                )}
                                <a href={`tel:${HOTLINE}`} className="flex items-center gap-2 text-sm font-bold mt-4">
                                    <Phone size={16} /> {HOTLINE_DISPLAY}
                                </a>
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="lg:col-span-3">
                            {loading && <div className="text-center py-16 text-gray-500 dark:text-gray-400">Đang tải tin tức...</div>}

                            {!loading && brandArticles.length > 0 && (
                                <div className="mb-14">
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase mb-6 border-l-4 border-red-600 pl-3">
                                        Thương Hiệu
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {brandArticles.slice(0, 3).map((item) => (
                                            <ArticleCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!loading && (
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase mb-6 border-l-4 border-red-600 pl-3">
                                        Tin Tức
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {currentNews.map((item) => (
                                            <ArticleCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {newsArticles.length === 0 && (
                                        <p className="text-center py-12 text-gray-500 dark:text-gray-400">Chưa có bài viết nào.</p>
                                    )}

                                    {totalPages > 1 && (
                                        <div className="mt-10 flex justify-center gap-2">
                                            {Array.from({ length: totalPages }).map((_, i) => {
                                                const p = i + 1;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => handlePageChange(p)}
                                                        className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${page === p ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300 dark:hover:border-red-600'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <FloatingButtons />
        </>
    );
};

export default NewsListPage;
