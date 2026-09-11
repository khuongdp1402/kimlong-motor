import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Phone, MessageCircle } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { getShowroom } from '../api/client';
import { productCategories } from '../data/categories';

const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

// Footer: red background, columns (company info / policy / product links /
// contact box with hotline + socials) / copyright bar — matches the real
// kimlongmiennam.com footer.
const Footer = () => {
    const { data: showrooms } = useApiData(getShowroom, []);
    const hq = (showrooms || [])[0];

    return (
        <footer className="bg-red-700 dark:bg-red-900 text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold tracking-tighter uppercase text-white">KIM LONG MIỀN NAM</span>
                        </div>
                        <p className="text-sm leading-relaxed text-red-50">
                            Đại lý ủy quyền phân phối chính hãng xe Kim Long (xe khách, xe van, xe bus, xe tải, xe điện)
                            tại khu vực Miền Nam. Chính sách giá tốt, hỗ trợ trả góp 80%.
                        </p>
                        {hq?.address && (
                            <p className="text-sm text-red-50 mt-3">{hq.address}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4 uppercase text-white tracking-wide">Chính Sách</h3>
                        <ul className="space-y-2 text-sm text-red-50">
                            <li><Link to="/gioi-thieu" className="hover:text-white transition-colors">Giới thiệu</Link></li>
                            <li><Link to="/news" className="hover:text-white transition-colors">Tin tức</Link></li>
                            <li><Link to="/lien-he" className="hover:text-white transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4 uppercase text-white tracking-wide">Sản Phẩm</h3>
                        <ul className="space-y-2 text-sm text-red-50">
                            {productCategories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link to={`/category/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-4 uppercase text-white tracking-wide">Bạn Cần Hỗ Trợ Vấn Đề Gì?</h3>
                        <a href={`tel:${HOTLINE}`} className="flex items-center gap-2 text-lg font-bold text-white mb-1 hover:text-red-100 transition-colors">
                            <Phone size={20} />
                            {HOTLINE_DISPLAY}
                        </a>
                        <p className="text-sm text-white/80 mb-4">LH/Zalo: {HOTLINE_DISPLAY} - Thương Kim Long</p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/dailykimlongmiennam" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="https://www.tiktok.com/@kimlongmiennam88" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="TikTok">
                                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            </a>
                            <a href="https://zalo.me/0379398798" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="Zalo">
                                <MessageCircle size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white/20 pt-6 text-center text-sm text-red-100">
                    Copyright © {new Date().getFullYear()} Kim Long Miền Nam - Miền Nam Auto. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
