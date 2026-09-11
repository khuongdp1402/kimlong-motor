import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { productCategories } from '../data/categories';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const closeTimeout = useRef(null);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const openProductsMenu = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
        setIsProductsOpen(true);
    };

    const closeProductsMenuDelayed = () => {
        closeTimeout.current = setTimeout(() => setIsProductsOpen(false), 150);
    };

    return (
        <nav className="bg-gray-800 dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 left-0 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <span className="text-3xl font-bold text-red-600 dark:text-red-500">K</span>
                                    <span className="text-3xl font-bold text-red-600 dark:text-red-500">L</span>
                                </div>
                                <span className="text-xl font-bold text-white tracking-tighter uppercase">
                                    KIM LONG MIỀN NAM
                                </span>
                            </Link>
                        </div>
                        <div className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
                            <Link to="/" className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Trang Chủ</Link>
                            <Link to="/gioi-thieu" className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Giới Thiệu</Link>

                            {/* Sản Phẩm dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={openProductsMenu}
                                onMouseLeave={closeProductsMenuDelayed}
                            >
                                <button
                                    onClick={() => setIsProductsOpen((prev) => !prev)}
                                    className="flex items-center text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors"
                                    aria-haspopup="true"
                                    aria-expanded={isProductsOpen}
                                >
                                    Sản Phẩm
                                    <ChevronDown size={16} className={`ml-1 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isProductsOpen && (
                                    <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 z-50">
                                        {productCategories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                to={`/category/${cat.slug}`}
                                                onClick={() => setIsProductsOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link to="/news" className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Tin Tức</Link>
                            <Link to="/lien-he" className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Liên Hệ</Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-white hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 md:mr-0 transition-colors"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="-mr-2 flex md:hidden ml-2">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
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
                <div className="md:hidden bg-gray-800 dark:bg-gray-900 border-t border-gray-700 dark:border-gray-800" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase transition-colors">Trang Chủ</Link>
                        <Link to="/gioi-thieu" onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase transition-colors">Giới Thiệu</Link>

                        {/* Sản Phẩm (mobile expandable) */}
                        <div>
                            <button
                                onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                                className="flex items-center justify-between w-full text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-base font-medium uppercase transition-colors"
                                aria-expanded={isMobileProductsOpen}
                            >
                                Sản Phẩm
                                <ChevronDown size={18} className={`transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMobileProductsOpen && (
                                <div className="pl-5 space-y-1">
                                    {productCategories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/category/${cat.slug}`}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsMobileProductsOpen(false);
                                            }}
                                            className="text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/news" onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase transition-colors">Tin Tức</Link>
                        <Link to="/lien-he" onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase transition-colors">Liên Hệ</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
