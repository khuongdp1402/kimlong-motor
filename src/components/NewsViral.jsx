import React from 'react';
import { Link } from 'react-router-dom';

const newsItems = [
    {
        id: 1,
        title: 'Kim Long Motor ra mắt dòng xe bus giường nằm thế hệ mới',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        summary: 'Dòng xe bus giường nằm cao cấp với thiết kế hiện đại, tiện nghi sang trọng, đáp ứng nhu cầu ngày càng cao của hành khách.',
        date: '25/04/2025',
    },
    {
        id: 2,
        title: 'Lễ bàn giao lô xe tải nặng cho đối tác chiến lược',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-tai-nang-kim-long-1.jpg',
        summary: 'Kim Long Motor vừa tổ chức lễ bàn giao 50 xe tải nặng cho công ty vận tải Logistics hàng đầu Việt Nam.',
        date: '20/04/2025',
    },
    {
        id: 3,
        title: 'Chương trình khuyến mãi đặc biệt tháng 5',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/khuyen-mai-kim-long-motor.jpg',
        summary: 'Ưu đãi lớn khi mua xe tải và xe bus trong tháng 5 với gói quà tặng trị giá lên đến 50 triệu đồng.',
        date: '15/04/2025',
    },
];

const NewsViral = () => {
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
                    {newsItems.map((item) => (
                        <div key={item.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300 hover:shadow-xl">
                            <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover" src={item.image} alt={item.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=News+Image' }} />
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                        Tin tức
                                    </p>
                                    <Link to={`/news/${item.id}`} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                            {item.title}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                                            {item.summary}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={item.date}>{item.date}</time>
                                    </div>
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
