import React from 'react';
import { Play } from 'lucide-react';
import { realVideos, businessInfo } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';

// Inline SVG icons for YouTube & TikTok so we get the branded look.
const YouTubeIcon = ({ size = 20, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TikTokIcon = ({ size = 20, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.17v-3.45a4.85 4.85 0 01-3.77-1.46V6.69h3.77z" />
    </svg>
);

// Section — Video thực tế with YouTube & TikTok branding + red pulse effect.
const RealVideoSection = () => {
    return (
        <section id="video-thuc-te" className="bg-noir-900 py-24 sm:py-36">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
                    <SectionHeader
                        eyebrow="Video thực tế"
                        title="Lái thử, bàn giao & đánh giá chi tiết"
                        intro="Xem video thực tế từ kênh chính thức của Kim Long Motor."
                    />

                    {/* Platform buttons with logos + red pulse */}
                    <Reveal className="flex gap-3">
                        <a
                            href={businessInfo.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-red-500/60 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-bold text-sm transition-all duration-300 animate-pulse-platform"
                        >
                            <YouTubeIcon size={20} />
                            YouTube
                        </a>
                        <a
                            href={businessInfo.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-red-500/60 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-bold text-sm transition-all duration-300 animate-pulse-platform"
                            style={{ animationDelay: '1s' }}
                        >
                            <TikTokIcon size={18} />
                            TikTok
                        </a>
                    </Reveal>
                </div>

                <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {realVideos.map((video, idx) => (
                        <Reveal key={video.id} delay={idx * 0.06}>
                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block">
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-graphite-800">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    {/* Play button */}
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Play size={16} fill="white" />
                                        </span>
                                    </span>
                                    {/* Platform badge */}
                                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        <YouTubeIcon size={12} className="text-red-500" />
                                        YouTube
                                    </span>
                                    {/* Tag badge */}
                                    {video.tag && (
                                        <span className="absolute top-2 right-2 bg-accent/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                            {video.tag}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-3 text-xs sm:text-sm text-ink line-clamp-2 group-hover:text-accent transition-colors">{video.title}</p>
                                <p className="mt-1 text-[11px] text-ink-muted flex items-center gap-1.5">
                                    <YouTubeIcon size={12} className="text-red-500" />
                                    Kim Long Motor
                                    {video.views && <span className="ml-auto text-accent font-semibold">{video.views}</span>}
                                </p>
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>

            {/* CSS for red pulse animation on platform buttons */}
            <style>{`
                @keyframes pulsePlatform {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5); border-color: rgba(239, 68, 68, 0.6); }
                    50% { box-shadow: 0 0 16px 4px rgba(220, 38, 38, 0.35); border-color: rgba(239, 68, 68, 1); }
                }
                .animate-pulse-platform {
                    animation: pulsePlatform 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default RealVideoSection;
