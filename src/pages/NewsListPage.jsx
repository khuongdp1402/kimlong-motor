import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { newsArticles } from '../data/news-updated';

const ITEMS_PER_PAGE = 12;

const NewsListPage = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(newsArticles.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentNews = newsArticles.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl uppercase">
                            Tin tức & Sự kiện
                        </h1>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                            Thông tin mới nhất về sản phẩm, khuyến mãi và hoạt động của Kim Long Motor.
                        </p>
                    </div>

                    {/* News Grid */}
                    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {currentNews.map((item) => (
                            <Link
                                key={item.id}
                                to={`/news/${item.id}`}
                                className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                            >
                                <div className="flex-shrink-0 relative">
                                    <img
                                        className="h-48 w-full object-cover"
                                        src={item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=News+Image'
                                        }}
                                    />
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                                        {item.category === 'tin-tuc' ? 'Tin tức' :
                                            item.category === 'kien-thuc' ? 'Kiến thức' :
                                                item.category === 'khuyen-mai' ? 'Khuyến mãi' : 'Sự kiện'}
                                    </span>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                                        </div>
                                        <span className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm">
                                            Xem chi tiết &rarr;
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${currentPage === 1
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Trước
                                </button>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                    ? 'z-10 bg-red-600 border-red-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium ${currentPage === totalPages
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Sau
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NewsListPage;
