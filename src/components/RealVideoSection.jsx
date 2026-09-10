import React, { useState } from 'react';
import { Play, Youtube, ExternalLink, X, Video, Sparkles, CheckCircle2 } from 'lucide-react';
import { realVideos, businessInfo } from '../data/hongthuong-data';

const RealVideoSection = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <section id="video-thuc-te" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-wider mb-2.5">
                        <Video size={12} />
                        Kênh Video Thực Tế - Hồng Thương
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                        TRẢI NGHIỆM THỰC TẾ & BÀN GIAO XE
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Theo dõi kênh YouTube và TikTok của <strong>Hồng Thương (@thuongkimlong)</strong> để cập nhật video đánh giá chi tiết, thử xe thực tế, lễ bàn giao xe và ưu đãi mới nhất.
                    </p>
                </div>

                {/* Social Channel Highlight Cards (YouTube + TikTok) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* YouTube Card */}
                    <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-red-500">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Youtube size={36} />
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-red-200">Kênh YouTube Chính Thức</span>
                                <h3 className="text-xl font-bold">Thương Kim Long</h3>
                                <p className="text-xs text-red-100 mt-1">
                                    Đánh giá thực tế từng dòng xe • Trợ giá nhà máy • Báo giá chi tiết
                                </p>
                            </div>
                        </div>
                        <a
                            href={businessInfo.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-gray-100 text-red-600 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wider flex-shrink-0"
                        >
                            <ExternalLink size={16} />
                            Xem Kênh YouTube
                        </a>
                    </div>

                    {/* TikTok Card */}
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-pink-500 text-black flex items-center justify-center flex-shrink-0 shadow-lg font-black text-2xl">
                                🎵
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Kênh TikTok Chính Thức</span>
                                <h3 className="text-xl font-bold">@thuongkimlong</h3>
                                <p className="text-xs text-gray-300 mt-1">
                                    Khoảnh khắc bàn giao xe • Khuyến mãi chớp nhoáng • Lái thử xe
                                </p>
                            </div>
                        </div>
                        <a
                            href={businessInfo.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap uppercase tracking-wider flex-shrink-0"
                        >
                            <ExternalLink size={16} />
                            Theo Dõi TikTok
                        </a>
                    </div>
                </div>

                {/* Videos Grid - 2 Cards per row on Mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                    {realVideos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 flex flex-col group cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            {/* Thumbnail with Play Icon */}
                            <div className="relative aspect-video bg-black overflow-hidden">
                                <img
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform">
                                        <Play size={14} fill="white" className="ml-0.5 sm:hidden" />
                                        <Play size={18} fill="white" className="ml-0.5 hidden sm:inline" />
                                    </div>
                                </div>
                                <span className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow truncate max-w-[80%]">
                                    {video.tag}
                                </span>
                            </div>

                            {/* Video Title & Meta */}
                            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                                <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
                                    {video.title}
                                </h4>
                                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400 truncate">
                                        <Youtube size={12} className="flex-shrink-0" />
                                        <span className="truncate">Thương Kim Long</span>
                                    </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 group-hover:underline hidden sm:inline">
                                        Xem ngay →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Modal Player */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl border border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top bar */}
                        <div className="px-5 py-3.5 bg-gray-800 flex items-center justify-between text-white border-b border-gray-700">
                            <h3 className="text-sm sm:text-base font-bold truncate pr-4">
                                {selectedVideo.title}
                            </h3>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Video Frame */}
                        <div className="relative aspect-video w-full bg-black">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                            ></iframe>
                        </div>

                        {/* Modal Action Bar */}
                        <div className="p-4 bg-gray-900 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
                            <div>
                                Đăng ký kênh YouTube <strong>@thuongkimlong</strong> để nhận thêm nhiều video hữu ích!
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={selectedVideo.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                    <Youtube size={15} /> Mở trên YouTube
                                </a>
                                <a
                                    href={`tel:${businessInfo.hotlineSalesRaw}`}
                                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Liên hệ: {businessInfo.hotlineSales}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RealVideoSection;
