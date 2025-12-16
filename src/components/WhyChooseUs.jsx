import React from 'react';
import { Award, Shield, Wrench, Headphones } from 'lucide-react';

const features = [
    {
        icon: Award,
        title: 'Chất Lượng Hàng Đầu',
        description: 'Sản phẩm được kiểm định nghiêm ngặt, đạt tiêu chuẩn quốc tế',
    },
    {
        icon: Shield,
        title: 'Bảo Hành Chính Hãng',
        description: 'Bảo hành toàn diện, hỗ trợ 24/7 trên toàn quốc',
    },
    {
        icon: Wrench,
        title: 'Phụ Tùng Chính Hãng',
        description: 'Phụ tùng nhập khẩu chính hãng, sẵn sàng cung cấp',
    },
    {
        icon: Headphones,
        title: 'Hỗ Trợ Tận Tâm',
        description: 'Đội ngũ chuyên viên giàu kinh nghiệm, tư vấn nhiệt tình',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Tại Sao Chọn Kim Long Motor?
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Chúng tôi cam kết mang đến giá trị tốt nhất cho khách hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-lg p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">
                        Hơn 20 Năm Kinh Nghiệm Trong Ngành
                    </h3>
                    <p className="text-lg mb-6 max-w-3xl mx-auto">
                        Kim Long Motor tự hào là đối tác tin cậy của hàng ngàn doanh nghiệp vận tải trên toàn quốc
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div>
                            <div className="text-4xl font-bold mb-2">5000+</div>
                            <div className="text-sm opacity-90">Khách hàng</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10000+</div>
                            <div className="text-sm opacity-90">Xe bán ra</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-sm opacity-90">Đại lý</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-sm opacity-90">Hỗ trợ</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
