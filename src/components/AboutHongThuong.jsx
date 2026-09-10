import React from 'react';
import { Phone, Award, ShieldCheck, MapPin, CheckCircle2, UserCheck, Wrench, Clock, Youtube, ExternalLink } from 'lucide-react';
import { businessInfo, trustPillars } from '../data/hongthuong-data';

const AboutHongThuong = () => {
    return (
        <section id="ve-hong-thuong" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Intro Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 shadow-xl mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Profile Info */}
                        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider">
                                <UserCheck size={12} />
                                Giới Thiệu Chuyên Viên
                            </div>

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                                HỒNG THƯƠNG – KIM LONG MOTOR
                            </h2>

                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                Xin chào quý khách hàng và các bác tài! Tôi là <strong>Hồng Thương</strong>, đại diện kinh doanh và tư vấn bán hàng chính thức các dòng xe thương mại <strong>KIM LONG MOTOR</strong> tại khu vực TP. Hồ Chí Minh và các tỉnh Miền Nam.
                            </p>

                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                Với phương châm làm việc <em>"Tận tâm – Minh bạch – Uy tín trọn đời"</em>, tôi cam kết mang tới mức giá xuất xưởng trực tiếp tốt nhất từ Nhà máy Kim Long Motor (Khu kinh tế Chân Mây – Lăng Cô, Huế), hỗ trợ mọi thủ tục trả góp ngân hàng 85% nhanh chóng, bàn giao xe tận nơi và đồng hành hỗ trợ kỹ thuật bảo dưỡng 24/7.
                            </p>

                            {/* Contact Badges */}
                            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Hotline Tư Vấn & Báo Giá:</span>
                                        <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="text-base font-bold text-red-600 dark:text-red-400 hover:underline">
                                            {businessInfo.hotlineSales}
                                        </a>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-700 text-white flex items-center justify-center flex-shrink-0">
                                        <Wrench size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Hotline Hỗ Trợ Kỹ Thuật & Dịch Vụ:</span>
                                        <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="text-base font-bold text-gray-900 dark:text-white hover:underline">
                                            {businessInfo.hotlineService}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 pt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <MapPin size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <span><strong>Địa chỉ Showroom & Kho xe:</strong> {businessInfo.address}</span>
                            </div>
                        </div>

                        {/* Image / Card Right */}
                        <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md text-center space-y-4">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-red-600 to-red-400 text-white flex items-center justify-center font-black text-3xl shadow-lg">
                                HT
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Hồng Thương
                                </h3>
                                <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase mt-0.5">
                                    Kim Long Motor Miền Nam
                                </p>
                            </div>
                            <div className="space-y-2 text-xs text-left text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                                    <span>Hơn 8 năm kinh nghiệm xe thương mại</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                                    <span>Hỗ trợ lái thử xe tận nhà</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                                    <span>Tư vấn trả góp bao đậu hồ sơ 85%</span>
                                </div>
                            </div>
                            <a
                                href={`tel:${businessInfo.hotlineSalesRaw}`}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-colors"
                            >
                                <Phone size={15} />
                                Gọi Gặp Hồng Thương
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4 Pillars of Trust - 2 Columns on Mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                    {trustPillars.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-50 dark:bg-gray-900 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-red-600/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center mb-2.5 sm:mb-4">
                                    <ShieldCheck size={18} className="sm:hidden" />
                                    <ShieldCheck size={22} className="hidden sm:inline" />
                                </div>
                                <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 uppercase leading-snug">
                                    {pillar.title}
                                </h4>
                            </div>
                            <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1 line-clamp-4 sm:line-clamp-none">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutHongThuong;
