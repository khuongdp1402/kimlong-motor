import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 left-0 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-red-700 dark:text-red-500 tracking-tighter uppercase">
                                Kim Long Motor
                            </Link>
                        </div>
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link to="/" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Trang chủ</Link>
                            <a href="/#products" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Sản phẩm</a>
                            <Link to="/about" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Giới thiệu</Link>
                            <Link to="/news" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Tin tức</Link>
                            <a href="#contact" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Liên hệ</a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 md:mr-0 transition-colors"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="-mr-2 flex md:hidden ml-2">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="bg-white dark:bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? <Menu size={24} /> : <X size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium uppercase">Trang chủ</Link>
                        <a href="/#products" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium uppercase">Sản phẩm</a>
                        <Link to="/about" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium uppercase">Giới thiệu</Link>
                        <Link to="/news" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium uppercase">Tin tức</Link>
                        <a href="#contact" className="text-gray-900 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 block px-3 py-2 rounded-md text-base font-medium uppercase">Liên hệ</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
