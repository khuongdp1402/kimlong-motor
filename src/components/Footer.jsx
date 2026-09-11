import React from 'react';
import { Phone, MapPin, Youtube, Wrench, ShieldCheck, ExternalLink } from 'lucide-react';
import { businessInfo, carCategories } from '../data/hongthuong-data';

const Footer = () => {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <footer id="lien-he" className="bg-gray-950 text-white border-t border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand & Introduction */}
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
                                    KIM LONG HỒNG THƯƠNG
                                </div>
                                <div className="text-[11px] text-gray-400 uppercase font-semibold">
                                    Đại Lý Xe Thương Mại Chính Hãng
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
                            Chuyên phân phối các dòng xe thương mại Kim Long Motor: Xe khách giường nằm, xe ghế Universe, xe Van điện GK 48EV, xe tải nhẹ KIMAN9 và siêu phẩm đầu kéo điện K9KEV.
                        </p>

                        <div className="pt-2 text-xs text-gray-400 space-y-1">
                            <div><strong>Chuyên viên phụ trách:</strong> Hồng Thương</div>
                            <div><strong>Cam kết:</strong> Giá gốc xuất xưởng, hỗ trợ vay 85%, giao xe toàn quốc.</div>
                        </div>
                    </div>

                    {/* Product Categories */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-red-600 pl-2.5">
                            DANH MỤC XE KIM LONG
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

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-red-600 pl-2.5">
                            THÔNG TIN LIÊN HỆ
                        </h3>
                        <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
                            <li className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>Địa chỉ:</strong> {businessInfo.address}
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone size={16} className="text-red-500 flex-shrink-0" />
                                <span>
                                    <strong>Hotline Bán Hàng:</strong>{' '}
                                    <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="text-red-400 font-bold hover:underline">
                                        {businessInfo.hotlineSales}
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Wrench size={16} className="text-red-500 flex-shrink-0" />
                                <span>
                                    <strong>Hotline Dịch Vụ:</strong>{' '}
                                    <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="text-white font-bold hover:underline">
                                        {businessInfo.hotlineService}
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <ShieldCheck size={16} className="text-red-500 flex-shrink-0" />
                                <span>
                                    <strong>Nhà máy:</strong> Khu kinh tế Chân Mây – Lăng Cô, Thừa Thiên Huế
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Channels */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-red-600 pl-2.5">
                            KÊNH TRUYỀN THÔNG
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                            Xem video thực tế lái thử và cập nhật bảng giá trên các nền tảng:
                        </p>
                        <div className="space-y-2">
                            <a
                                href={businessInfo.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-red-600/20 hover:bg-red-600 text-white p-2.5 rounded-xl border border-red-500/30 flex items-center justify-between transition-colors text-xs font-semibold"
                            >
                                <span className="flex items-center gap-2">
                                    <Youtube size={18} className="text-red-500" />
                                    <span>YouTube @thuongkimlong</span>
                                </span>
                                <ExternalLink size={14} />
                            </a>

                            <a
                                href={businessInfo.tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-xl border border-gray-700 flex items-center justify-between transition-colors text-xs font-semibold"
                            >
                                <span className="flex items-center gap-2">
                                    <span>🎵</span>
                                    <span>TikTok @thuongkimlong</span>
                                </span>
                                <ExternalLink size={14} />
                            </a>

                            <a
                                href={businessInfo.zaloUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600/20 hover:bg-blue-600 text-white p-2.5 rounded-xl border border-blue-500/30 flex items-center justify-between transition-colors text-xs font-semibold"
                            >
                                <span className="flex items-center gap-2">
                                    <span>💬</span>
                                    <span>Zalo: {businessInfo.hotlineSales}</span>
                                </span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <div>
                        © {new Date().getFullYear()} KIM LONG HỒNG THƯƠNG. Bản quyền đại lý phân phối chính thức Kim Long Motor.
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => scrollTo('danh-muc-xe')} className="hover:text-gray-300 cursor-pointer">
                            Danh Mục Xe
                        </button>
                        <button onClick={() => scrollTo('bang-bao-gia')} className="hover:text-gray-300 cursor-pointer">
                            Báo Giá Lăn Bánh
                        </button>
                        <button onClick={() => scrollTo('ve-hong-thuong')} className="hover:text-gray-300 cursor-pointer">
                            Về Hồng Thương
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
