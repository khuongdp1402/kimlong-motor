import React from 'react';
import { Phone, MapPin, Youtube, Wrench, ExternalLink } from 'lucide-react';
import { businessInfo, carCategories } from '../data/hongthuong-data';

const Footer = () => {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <footer id="lien-he" className="bg-gray-950 text-white border-t border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src="/images/logo-official.png"
                                alt="Kim Long Motor"
                                className="h-12 w-auto object-contain"
                                onError={(e) => {
                                    e.target.src = '/images/logo-ngang-do.png';
                                }}
                            />
                            <div className="border-l border-gray-700 pl-3">
                                <div className="text-lg font-black text-red-500 uppercase tracking-tight">
                                    KIM LONG MOTOR
                                </div>
                                <div className="text-[11px] text-gray-400 uppercase font-semibold">
                                    Đại Lý Xe Thương Mại Chính Hãng
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
                            Chuyên phân phối các dòng xe thương mại Kim Long Motor: Xe khách giường nằm, xe ghế Universe, xe Van điện GK 48EV, xe tải nhẹ KIMAN9 và siêu phẩm đầu kéo điện K9KEV.
                        </p>

                        <div className="pt-1 text-xs text-gray-400 space-y-1.5">
                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                                <span>{businessInfo.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-red-600 pl-2.5">
                            Danh Mục Xe
                        </h3>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                            {carCategories.filter(c => c.id !== 'all').map(cat => (
                                <li key={cat.id}>
                                    <button
                                        onClick={() => scrollTo('danh-muc-xe')}
                                        className="hover:text-red-400 transition-colors text-left cursor-pointer"
                                    >
                                        • {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-red-600 pl-2.5">
                            Hỗ Trợ Khách Hàng
                        </h3>
                        <ul className="space-y-3 text-xs sm:text-sm text-gray-400 mb-4">
                            <li className="flex items-center gap-2.5">
                                <Phone size={16} className="text-red-500 shrink-0" />
                                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="text-red-400 font-bold hover:underline">
                                    Bán Hàng: {businessInfo.hotlineSales}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Wrench size={16} className="text-red-500 shrink-0" />
                                <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="text-white font-bold hover:underline">
                                    Kỹ Thuật: {businessInfo.hotlineService}
                                </a>
                            </li>
                        </ul>
                        <div className="space-y-2">
                            <a
                                href={businessInfo.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-red-600/20 hover:bg-red-600 text-white p-2.5 rounded-xl border border-red-500/30 flex items-center justify-between transition-colors text-xs font-semibold"
                            >
                                <span className="flex items-center gap-2">
                                    <Youtube size={16} className="text-red-500" />
                                    <span>YouTube</span>
                                </span>
                                <ExternalLink size={13} />
                            </a>
                            <a
                                href={businessInfo.zaloUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600/20 hover:bg-blue-600 text-white p-2.5 rounded-xl border border-blue-500/30 flex items-center justify-between transition-colors text-xs font-semibold"
                            >
                                <span className="flex items-center gap-2">
                                    <span>💬</span>
                                    <span>Zalo</span>
                                </span>
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <div>
                        © {new Date().getFullYear()} KIM LONG MOTOR. Bản quyền đại lý phân phối chính thức.
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => scrollTo('danh-muc-xe')} className="hover:text-gray-300 cursor-pointer">
                            Danh Mục Xe
                        </button>
                        <button onClick={() => scrollTo('bang-bao-gia')} className="hover:text-gray-300 cursor-pointer">
                            Báo Giá
                        </button>
                        <button onClick={() => scrollTo('ve-hong-thuong')} className="hover:text-gray-300 cursor-pointer">
                            Về Chúng Tôi
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
