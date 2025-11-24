import React from 'react';
import { Link } from 'react-router-dom';
import { getLatestNews } from '../data/news';

const NewsViral = () => {
    const latestNews = getLatestNews(3);

    return (
        <section id="news" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Tin tức & Sự kiện
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Cập nhật những thông tin mới nhất từ Kim Long Motor.
                    </p>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                    {latestNews.map((item) => (
                        <div key={item.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                            <div className="flex-shrink-0 relative h-48">
                                <img
                                    className="h-full w-full object-cover"
                                    src={item.image}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400';
                                    }}
                                />
                                {item.featured && (
                                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        Nổi bật
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                        {item.category === 'tin-tuc' ? 'Tin tức' :
                                            item.category === 'kien-thuc' ? 'Kiến thức' :
                                                item.category === 'khuyen-mai' ? 'Khuyến mãi' : 'Sự kiện'}
                                    </p>
                                    <Link to={`/ news / ${item.id} `} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-2">
                                            {item.title}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {item.excerpt}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={item.date}>{item.date}</time>
                                    </div>
                                    <Link
                                        to={`/ news / ${item.id} `}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm"
                                    >
                                        Đọc thêm →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link to="/news" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 transition-colors">
                        Xem tất cả tin tức
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NewsViral;
