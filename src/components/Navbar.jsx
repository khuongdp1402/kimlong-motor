import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Phone, Calculator } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';

const Navbar = ({ onOpenQuoteModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const scrollTo = (id) => {
        setIsOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            navigate('/');
        }
    };

    const goTo = (path) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <header className="fixed w-full z-50 top-0 left-0 shadow-md">
            {/* Single-line Navbar - Compact Height h-14 / h-16 */}
            <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Logo & Brand on a Single Clean Line */}
                        <div className="flex-shrink-0 flex items-center">
                            <button
                                onClick={() => scrollTo('hero')}
                                className="flex items-center space-x-2.5 text-left focus:outline-none group cursor-pointer"
                            >
                                <img
                                    src="/images/logo-official.png"
                                    alt="Kim Long Motor"
                                    className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = '/images/logo-ngang-do.png';
                                    }}
                                />
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm sm:text-base font-black tracking-tight text-red-600 dark:text-red-500 uppercase whitespace-nowrap">
                                        KIM LONG MOTOR
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden lg:flex items-center space-x-5 xl:space-x-6">
                            <button
                                onClick={() => scrollTo('hero')}
                                className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Trang Chủ
                            </button>
                            <button
                                onClick={() => scrollTo('danh-muc-xe')}
                                className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Danh Mục Xe
                            </button>
                            <button
                                onClick={() => scrollTo('bang-bao-gia')}
                                className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Dịch Vụ
                            </button>
                            <button
                                onClick={() => goTo('/news')}
                                className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Tin Tức
                            </button>
                            <button
                                onClick={() => scrollTo('ve-hong-thuong')}
                                className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Về Chúng Tôi
                            </button>
                        </div>

                        {/* Action Buttons & Theme Toggle */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                                onClick={onOpenQuoteModal}
                                className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg shadow-sm transition-all hover:scale-105 uppercase tracking-wider cursor-pointer"
                            >
                                <Calculator size={14} />
                                Báo Giá
                            </button>

                            <a
                                href={`tel:${businessInfo.hotlineSalesRaw}`}
                                className="bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                            >
                                <Phone size={13} className="text-red-500 animate-pulse" />
                                <span className="hidden sm:inline">{businessInfo.hotlineSales}</span>
                                <span className="sm:hidden">Gọi</span>
                            </a>

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors cursor-pointer"
                                title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
                                aria-label="Đổi giao diện"
                            >
                                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-yellow-400" />}
                            </button>

                            {/* Mobile menu toggle */}
                            <div className="lg:hidden">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    type="button"
                                    className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none cursor-pointer"
                                >
                                    {!isOpen ? <Menu size={22} /> : <X size={22} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isOpen && (
                    <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl px-4 py-3 space-y-2">
                        <button
                            onClick={() => scrollTo('hero')}
                            className="w-full text-left py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-red-600 uppercase cursor-pointer"
                        >
                            Trang Chủ
                        </button>
                        <button
                            onClick={() => scrollTo('danh-muc-xe')}
                            className="w-full text-left py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-red-600 uppercase cursor-pointer"
                        >
                            Danh Mục Xe
                        </button>
                        <button
                            onClick={() => scrollTo('bang-bao-gia')}
                            className="w-full text-left py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-red-600 uppercase cursor-pointer"
                        >
                            Dịch Vụ
                        </button>
                        <button
                            onClick={() => goTo('/news')}
                            className="w-full text-left py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-red-600 uppercase cursor-pointer"
                        >
                            Tin Tức
                        </button>
                        <button
                            onClick={() => scrollTo('ve-hong-thuong')}
                            className="w-full text-left py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-red-600 uppercase cursor-pointer"
                        >
                            Về Chúng Tôi
                        </button>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onOpenQuoteModal();
                                }}
                                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg text-center text-xs uppercase cursor-pointer"
                            >
                                Nhận Báo Giá
                            </button>
                            <a
                                href={`tel:${businessInfo.hotlineSalesRaw}`}
                                className="flex-1 bg-gray-900 dark:bg-gray-800 text-white font-bold py-2 rounded-lg text-center text-xs flex items-center justify-center gap-1.5"
                            >
                                <Phone size={13} /> {businessInfo.hotlineSales}
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
