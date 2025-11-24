import React from 'react';

const Hero = () => {
    return (
        <div className="relative bg-gray-900 h-screen flex items-center justify-center overflow-hidden mt-16">
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover opacity-60"
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
                    alt="Kim Long Motor Truck"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">KIM LONG MOTOR</span>
                    <span className="block text-red-600 mt-2">ĐỐI TÁC TIN CẬY</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Chuyên cung cấp các dòng xe tải, xe bus chất lượng cao, bền bỉ và tiết kiệm nhiên liệu. Giải pháp vận tải toàn diện cho doanh nghiệp của bạn.
                </p>
                <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                    <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                        <a href="#products" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105">
                            Xem sản phẩm
                        </a>
                        <a href="#contact" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105">
                            Liên hệ ngay
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
