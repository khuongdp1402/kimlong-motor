import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-red-600 dark:text-red-500">K</span>
                                <span className="text-3xl font-bold text-red-600 dark:text-red-500">L</span>
                            </div>
                            <span className="text-xl font-bold tracking-tighter uppercase text-white">KIM LONG MIỀN NAM</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300 dark:text-gray-400">
                            KIM LONG MIỀN NAM là đại lý ủy quyền chính thức, chuyên cung cấp các dòng xe khách, xe tải chất lượng cao. 
                            Cam kết sản phẩm chính hãng, bảo hành toàn diện và dịch vụ hậu mãi chuyên nghiệp.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase text-white">LÝ DO CHỌN KIM LONG MIỀN NAM</h3>
                        <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-2 text-red-600 dark:text-red-500">•</span>
                                <span>Sản phẩm chính hãng, giá cả cạnh tranh</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-red-600 dark:text-red-500">•</span>
                                <span>Hỗ trợ đăng ký, vay vốn ngân hàng</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-red-600 dark:text-red-500">•</span>
                                <span>Dịch vụ bảo hành, bảo dưỡng chuyên nghiệp</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-red-600 dark:text-red-500">•</span>
                                <span>Đội ngũ tư vấn nhiệt tình, tận tâm</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase text-white">Thông tin liên hệ</h3>
                        <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                            <li>
                                <strong className="text-white">Chi nhánh 1:</strong><br />
                                Khu kinh tế Chân Mây - Lăng Cô, Thừa Thiên Huế
                            </li>
                            <li>
                                <strong className="text-white">Chi nhánh 2:</strong><br />
                                [Địa chỉ chi nhánh 2]
                            </li>
                            <li>
                                <strong className="text-white">Hotline:</strong> 1900 xxxx
                            </li>
                            <li>
                                <strong className="text-white">Email:</strong> info@kimlongmotor.com
                            </li>
                            <li>
                                <strong className="text-white">Website:</strong> www.kimlongmotor.com
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-white hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="tel:1900xxxx" className="text-white hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 dark:border-gray-800 pt-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    Copyright 2025 © Kim Long Miền Nam. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
