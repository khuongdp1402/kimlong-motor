import React, { useEffect, useState } from 'react';
import { Youtube } from 'lucide-react';
import { getLandingSocial } from '../../api/client';
import { businessInfo, realVideos } from '../../data/hongthuong-data';
import { getYoutubeId } from '../../utils/videoEmbeds';
import Reveal from '../motion/Reveal';

const TikTokIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.58h-3.15v13.9c0 1.55-1.26 2.8-2.8 2.8a2.8 2.8 0 0 1 0-5.6c.28 0 .55.04.8.12V10.4a6 6 0 1 0 5.15 5.94V9.1a8.06 8.06 0 0 0 4.8 1.56V7.5a4.85 4.85 0 0 1-3.4-1.68Z" />
    </svg>
);

const DEFAULT_SOCIAL = {
    youtubeUrl: businessInfo.youtubeUrl,
    tiktokUrl: businessInfo.tiktokUrl,
    youtubeVideos: [],
};

/* ── YouTube thumbnail card (click → open video in tab) ── */
const YoutubeThumbnailCard = ({ url, title, thumbnailUrl, tag, idx }) => {
    const id = getYoutubeId(url) || url; // url might already be an ID string from realVideos
    const thumb = thumbnailUrl || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    return (
        <Reveal delay={Math.min(idx, 6) * 0.06}>
            <a
                href={`https://www.youtube.com/watch?v=${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-slate-900"
            >
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={thumb}
                        alt={title || `Video ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                    {tag && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {tag}
                        </span>
                    )}
                </div>
                {title && (
                    <div className="px-3 py-2.5 flex items-start gap-2">
                        <Youtube size={16} className="text-red-500 mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 leading-snug">{title}</p>
                    </div>
                )}
            </a>
        </Reveal>
    );
};

/* ── YouTube iframe embed (when admin provides embed URLs) ── */
const YoutubeIframeGrid = ({ videos }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {videos.map((url, i) => {
            const id = getYoutubeId(url);
            if (!id) return null;
            return (
                <Reveal key={id + i} delay={Math.min(i, 6) * 0.05} className="aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                        title={`YouTube video ${i + 1}`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                    />
                </Reveal>
            );
        })}
    </div>
);

/* ── Default state: show realVideos thumbnails (TikTok stays as the button up top) ── */
const DefaultVideoLayout = () => (
    <div className="mt-10">
        <div className="flex items-center gap-2 mb-5">
            <Youtube size={20} className="text-red-600" />
            <span className="text-base font-bold text-slate-800">Video YouTube</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {realVideos.map((v, i) => (
                <YoutubeThumbnailCard
                    key={v.id}
                    url={v.youtubeUrl}
                    title={v.title}
                    thumbnailUrl={v.thumbnailUrl}
                    tag={v.tag}
                    idx={i}
                />
            ))}
        </div>
    </div>
);

/* ════════════════════════════════════════════ */
const LandingSocial = () => {
    const [social, setSocial] = useState(DEFAULT_SOCIAL);

    useEffect(() => {
        getLandingSocial()
            .then((data) => {
                if (data && (data.youtubeUrl || data.tiktokUrl || data.youtubeVideos?.length)) {
                    setSocial({ ...DEFAULT_SOCIAL, ...data });
                }
            })
            .catch(() => { /* keep defaults */ });
    }, []);

    const youtubeVideos = social.youtubeVideos || [];
    const hasAdminVideos = youtubeVideos.length > 0;

    return (
        <section id="mang-xa-hoi" className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <Reveal className="mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-widest mb-2">Nội dung thực tế</p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                                Theo Dõi Chúng Tôi
                            </h2>
                            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-md">
                                Video giới thiệu xe & bàn giao thực tế từ kênh chính thức Kim Long Motor
                            </p>
                        </div>

                        {/* Channel links */}
                        <div className="flex flex-wrap gap-3 shrink-0">
                            {social.youtubeUrl && (
                                <a
                                    href={social.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow"
                                >
                                    <Youtube size={16} />
                                    YouTube
                                </a>
                            )}
                            {social.tiktokUrl && (
                                <a
                                    href={social.tiktokUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow"
                                >
                                    <TikTokIcon width={15} height={15} />
                                    TikTok
                                </a>
                            )}
                        </div>
                    </div>
                </Reveal>

                {/* Video content */}
                {hasAdminVideos ? (
                    <div>
                        <div className="flex items-center gap-2 mb-5">
                            <Youtube size={20} className="text-red-600" />
                            <span className="text-base font-bold text-slate-800">Video YouTube</span>
                        </div>
                        <YoutubeIframeGrid videos={youtubeVideos} />
                    </div>
                ) : (
                    <DefaultVideoLayout />
                )}
            </div>
        </section>
    );
};

export default LandingSocial;
