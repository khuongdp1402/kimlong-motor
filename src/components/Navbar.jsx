import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <a href="#" className="text-2xl font-bold text-red-700 tracking-tighter uppercase">
                                Kim Long Motor
                            </a>
                        </div>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <a href="#" className="text-gray-900 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Trang chủ</a>
                            <a href="#products" className="text-gray-900 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Sản phẩm</a>
                            <a href="#about" className="text-gray-900 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Giới thiệu</a>
                            <a href="#news" className="text-gray-900 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Tin tức</a>
                            <a href="#contact" className="text-gray-900 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Liên hệ</a>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        <a href="#" className="text-gray-900 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium uppercase">Trang chủ</a>
                        <a href="#products" className="text-gray-900 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium uppercase">Sản phẩm</a>
                        <a href="#about" className="text-gray-900 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium uppercase">Giới thiệu</a>
                        <a href="#news" className="text-gray-900 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium uppercase">Tin tức</a>
                        <a href="#contact" className="text-gray-900 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium uppercase">Liên hệ</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
