import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getNewsById, newsArticles } from '../data/news-updated';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';

const NewsDetailPage = () => {
    const { id } = useParams();
    const article = getNewsById(id);

    // Get related articles (same category, exclude current)
    const relatedArticles = newsArticles
        .filter(n => n.category === article?.category && n.id !== article?.id)
        .slice(0, 3);

    if (!article) {
        return (
            <>
                <Navbar />
                <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Không tìm thấy bài viết
                        </h1>
                        <Link
                            to="/news"
                            className="inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Quay lại danh sách tin tức
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryName = (category) => {
        const categories = {
            'tin-tuc': 'Tin tức',
            'kien-thuc': 'Kiến thức',
            'khuyen-mai': 'Khuyến mãi',
            'su-kien': 'Sự kiện'
        };
        return categories[category] || category;
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link
                        to="/news"
                        className="inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mb-6 transition-colors"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Quay lại danh sách tin tức
                    </Link>

                    {/* Article Header */}
                    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
                        {/* Featured Image */}
                        <div className="relative h-96 w-full">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x400?text=News+Image'
                                }}
                            />
                            <div className="absolute top-4 right-4">
                                <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                                    {getCategoryName(article.category)}
                                </span>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-8 md:p-12">
                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                {article.title}
                            </h1>

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Calendar size={18} className="mr-2" />
                                    <span className="text-sm">{formatDate(article.date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <User size={18} className="mr-2" />
                                    <span className="text-sm">{article.author}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-400">
                                    <Tag size={18} className="mr-2" />
                                    <span className="text-sm">{getCategoryName(article.category)}</span>
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-red-600">
                                <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </div>

                            {/* Article Body */}
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none
                                    prose-headings:text-gray-900 dark:prose-headings:text-white
                                    prose-p:text-gray-700 dark:prose-p:text-gray-300
                                    prose-a:text-red-600 dark:prose-a:text-red-400
                                    prose-strong:text-gray-900 dark:prose-strong:text-white
                                    prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                                    prose-li:text-gray-700 dark:prose-li:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    </article>

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Bài viết liên quan
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.id}
                                        to={`/news/${related.id}`}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <img
                                            src={related.image}
                                            alt={related.title}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200?text=News'
                                            }}
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                {related.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                            <div className="mt-3 text-sm text-gray-500 dark:text-gray-500">
                                                {formatDate(related.date)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NewsDetailPage;
