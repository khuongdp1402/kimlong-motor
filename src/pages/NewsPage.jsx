import React from 'react';
import { Link } from 'react-router-dom';

const allNews = [
    {
        id: 1,
        title: 'Kim Long Motor ra mắt dòng xe bus giường nằm thế hệ mới',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        summary: 'Dòng xe bus giường nằm cao cấp với thiết kế hiện đại, tiện nghi sang trọng, đáp ứng nhu cầu ngày càng cao của hành khách.',
        date: '25/04/2025',
        category: 'Sản phẩm mới'
    },
    {
        id: 2,
        title: 'Lễ bàn giao lô xe tải nặng cho đối tác chiến lược',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-tai-nang-kim-long-1.jpg',
        summary: 'Kim Long Motor vừa tổ chức lễ bàn giao 50 xe tải nặng cho công ty vận tải Logistics hàng đầu Việt Nam.',
        date: '20/04/2025',
        category: 'Sự kiện'
    },
    {
        id: 3,
        title: 'Chương trình khuyến mãi đặc biệt tháng 5',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/khuyen-mai-kim-long-motor.jpg',
        summary: 'Ưu đãi lớn khi mua xe tải và xe bus trong tháng 5 với gói quà tặng trị giá lên đến 50 triệu đồng.',
        date: '15/04/2025',
        category: 'Khuyến mãi'
    },
    {
        id: 4,
        title: 'Hội nghị khách hàng thường niên 2025',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
        summary: 'Tri ân khách hàng đã đồng hành cùng Kim Long Motor trong suốt chặng đường phát triển vừa qua.',
        date: '10/04/2025',
        category: 'Sự kiện'
    },
    {
        id: 5,
        title: 'Mở rộng hệ thống đại lý tại miền Trung',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
        summary: 'Khai trương thêm 3 đại lý 3S mới tại Đà Nẵng, Quảng Nam và Quảng Ngãi nhằm phục vụ khách hàng tốt hơn.',
        date: '05/04/2025',
        category: 'Tin tức'
    },
    {
        id: 6,
        title: 'Hướng dẫn bảo dưỡng xe tải đúng cách',
        image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop',
        summary: 'Những lưu ý quan trọng giúp kéo dài tuổi thọ động cơ và đảm bảo an toàn khi vận hành.',
        date: '01/04/2025',
        category: 'Kỹ thuật'
    }
];

const NewsPage = () => {
    return (
        <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl uppercase">
                        Tin tức & Sự kiện
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Thông tin mới nhất về sản phẩm, khuyến mãi và hoạt động của Kim Long Motor.
                    </p>
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {allNews.map((item) => (
                        <div key={item.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300 hover:shadow-xl">
                            <div className="flex-shrink-0 relative">
                                <img className="h-48 w-full object-cover" src={item.image} alt={item.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=News+Image' }} />
                                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 m-2 rounded">
                                    {item.category}
                                </span>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <Link to={`/news/${item.id}`} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                            {item.title}
                                        </p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                                            {item.summary}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={item.date}>{item.date}</time>
                                    </div>
                                    <Link to={`/news/${item.id}`} className="text-red-600 hover:text-red-800 font-medium text-sm">
                                        Xem chi tiết &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsPage;
