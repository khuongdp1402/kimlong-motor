import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        // Close mobile menu
        setIsOpen(false);

        // Navigate to home if not already there
        if (window.location.pathname !== '/') {
            navigate('/');
            // Wait for navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
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
                                    KIM LONG MOTOR
                                </span>
                            </Link>
                        </div>
                        <div className="hidden md:ml-10 md:flex md:space-x-6">
                            <Link to="/" className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Trang chủ</Link>
                            <button onClick={() => scrollToSection('giuong-nam')} className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Xe Khách Giường Nằm</button>
                            <button onClick={() => scrollToSection('ghe-ngoi')} className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Xe Khách Ghế Ngồi</button>
                            <button onClick={() => scrollToSection('16-cho')} className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Xe Khách 16 Chỗ</button>
                            <button onClick={() => scrollToSection('limousine')} className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Xe Khách Limousine</button>
                            <button onClick={() => scrollToSection('contact')} className="text-white hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors">Liên hệ</button>
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
                        <Link to="/" onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase transition-colors">Trang chủ</Link>
                        <button onClick={() => scrollToSection('giuong-nam')} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left transition-colors">Xe Khách Giường Nằm</button>
                        <button onClick={() => scrollToSection('ghe-ngoi')} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left transition-colors">Xe Khách Ghế Ngồi</button>
                        <button onClick={() => scrollToSection('16-cho')} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left transition-colors">Xe Khách 16 Chỗ</button>
                        <button onClick={() => scrollToSection('limousine')} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left transition-colors">Xe Khách Limousine</button>
                        <button onClick={() => scrollToSection('contact')} className="text-white hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium uppercase w-full text-left transition-colors">Liên hệ</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
