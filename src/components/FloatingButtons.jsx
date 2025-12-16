import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp, Mail } from 'lucide-react';

const FloatingButtons = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Right Side Floating Buttons (Social + Scroll to Top) */}
            <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
                {/* Messenger */}
                <div className="relative flex flex-col items-end">
                    <div className="mb-2 px-3 py-1 rounded-full bg-white text-gray-800 shadow-md text-xs font-medium whitespace-nowrap border border-gray-200">
                        Nhấn để chat ngay với chúng tôi!
                    </div>
                    <a
                        href="https://m.me/kimlongmotor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-bounce"
                        aria-label="Messenger"
                    >
                        <MessageCircle size={24} />
                    </a>
                </div>

                {/* Zalo */}
                <a
                    href="https://zalo.me/0911545499"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse"
                    aria-label="Zalo"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c.169.422.26.873.26 1.334v.67c0 .405-.092.798-.26 1.16l-2.443 4.825a.616.616 0 01-.567.376h-1.8a.5.5 0 01-.481-.363l-.74-2.607a.27.27 0 00-.26-.19.27.27 0 00-.26.19l-.74 2.607a.5.5 0 01-.48.363H8.682a.616.616 0 01-.567-.376L5.672 11.324c-.168-.362-.26-.755-.26-1.16v-.67c0-.461.091-.912.26-1.334L7.115 3.19a.616.616 0 01.567-.376h8.636a.616.616 0 01.567.376l2.443 4.825z"/>
                    </svg>
                </a>

                {/* Phone */}
                <a
                    href="tel:0911545499"
                    className="w-14 h-14 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-pulse"
                    aria-label="Gọi điện"
                >
                    <Phone size={24} />
                </a>

                {/* Scroll to Top */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="w-14 h-14 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                        aria-label="Lên đầu trang"
                    >
                        <ArrowUp size={24} />
                    </button>
                )}
            </div>
        </>
    );
};

export default FloatingButtons;

