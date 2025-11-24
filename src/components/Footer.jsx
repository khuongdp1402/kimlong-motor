import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 uppercase text-red-500">Kim Long Motor</h3>
                        <p className="text-gray-400 text-sm">
                            Đơn vị hàng đầu trong lĩnh vực sản xuất và phân phối xe thương mại tại Việt Nam.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase">Liên hệ</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Địa chỉ: Khu kinh tế Chân Mây - Lăng Cô, Thừa Thiên Huế</li>
                            <li>Hotline: 1900 xxxx</li>
                            <li>Email: info@kimlongmotor.com</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 uppercase">Kết nối</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                            <a href="#" className="text-gray-400 hover:text-white">Youtube</a>
                            <a href="#" className="text-gray-400 hover:text-white">Zalo</a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    &copy; 2025 Kim Long Motor. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
