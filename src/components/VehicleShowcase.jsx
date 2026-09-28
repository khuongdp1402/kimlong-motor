import React, { useRef, useEffect, useState } from 'react';
import { Shield, Zap, Gauge, Wrench, ArrowRight } from 'lucide-react';

/**
 * Vehicle Showcase — Scroll-driven video + content section.
 *
 * Desktop: Sticky video left (55%) + scrolling content right (45%).
 * As user scrolls through each scene card, the video crossfades.
 *
 * Inspired by Dribbble logistics reference — dark theme, kinetic text,
 * numbered service rows.
 */

const scenes = [
    {
        id: 'scene-1',
        number: '01',
        video: '/media/showcase/video_sciene1.mp4',
        poster: '/media/showcase/img_sciene1.jpg',
        eyebrow: 'Trải Nghiệm Thực Tế',
        title: 'Chinh Phục Mọi',
        titleAccent: 'Cung Đường',
        description: 'Kim Long 99 vận hành êm ái trên mọi cung đường cao tốc với hệ thống treo bóng hơi thế hệ mới, giảm rung lắc tối đa cho hành khách.',
        highlights: [
            { icon: Gauge, text: 'Động cơ Weichai / Yuchai Euro 5 mạnh mẽ' },
            { icon: Shield, text: 'Khung gầm monocoque chống lật chuẩn ECE R66' },
        ],
    },
    {
        id: 'scene-2',
        number: '02',
        video: '/media/showcase/video_sciene2.mp4',
        poster: '/media/showcase/img_sciene2.jpg',
        eyebrow: 'Thiết Kế Sang Trọng',
        title: 'Nội Thất Đẳng Cấp',
        titleAccent: 'Châu Âu',
        description: 'Mỗi chiếc xe khách Kim Long 99 được hoàn thiện tỉ mỉ với nội thất da cao cấp, hệ thống giải trí cá nhân và chiếu sáng LED ambient.',
        highlights: [
            { icon: Zap, text: '24-34 phòng VIP massage & giường nằm êm ái' },
            { icon: Wrench, text: 'Tùy chỉnh nội thất theo yêu cầu khách hàng' },
        ],
    },
    {
        id: 'scene-3',
        number: '03',
        video: '/media/showcase/video_sciene3.mp4',
        poster: '/media/showcase/img_sciene3.jpg',
        eyebrow: 'Vận Hành Bền Bỉ',
        title: 'Đồng Hành Cùng',
        titleAccent: 'Doanh Nghiệp',
        description: 'Từ nội thành đến liên tỉnh, Kim Long 99 là sự lựa chọn hàng đầu của hơn 100 nhà xe trên cả nước nhờ chi phí vận hành tối ưu và dịch vụ hậu mãi 24/7.',
        highlights: [
            { icon: Shield, text: 'Bảo hành chính hãng 3 năm / 150.000 km' },
            { icon: Gauge, text: 'Tiết kiệm nhiên liệu hàng đầu phân khúc' },
        ],
    },
];

const VehicleShowcase = () => {
    const videoRefs = useRef([]);
    const [activeScene, setActiveScene] = useState(0);

    // Observe which scene card is in center view → switch video
    useEffect(() => {
        const cards = document.querySelectorAll('[data-scene-card]');
        if (!cards.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveScene(Number(entry.target.dataset.sceneCard));
                    }
                });
            },
            { threshold: 0.45, rootMargin: '-15% 0px -15% 0px' }
        );

        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, []);

    // Play/pause videos based on active scene
    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (!video) return;
            if (idx === activeScene) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, [activeScene]);

    return (
        <section className="bg-gray-950 text-white overflow-hidden">
            {/* ─── Section Header ─── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-10 sm:pb-14">
                <div className="max-w-3xl">
                    <span className="text-red-500 text-xs sm:text-sm font-bold uppercase tracking-widest">
                        Khám Phá Xe Kim Long 99
                    </span>
                    <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1]">
                        Trải nghiệm{' '}
                        <span className="text-red-500">thực tế</span>{' '}
                        từng chi tiết
                    </h2>
                    <p className="mt-4 sm:mt-5 text-sm sm:text-base text-gray-400 leading-relaxed max-w-xl">
                        Cuộn để khám phá — video và nội dung chi tiết về dòng xe khách hàng đầu Việt Nam.
                    </p>
                </div>
            </div>

            {/* ─── Desktop: Sticky video left + scrolling cards right ─── */}
            <div className="hidden lg:block">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex gap-12 xl:gap-16">
                        {/* LEFT — Sticky video panel */}
                        <div className="w-[55%] xl:w-[58%] shrink-0">
                            <div className="sticky top-20 h-[calc(100vh-6rem)]">
                                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-900">
                                    {scenes.map((scene, idx) => (
                                        <video
                                            key={scene.id}
                                            ref={(el) => (videoRefs.current[idx] = el)}
                                            src={scene.video}
                                            poster={scene.poster}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                                idx === activeScene ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        />
                                    ))}

                                    {/* Subtle bottom gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-gray-950/70 to-transparent pointer-events-none" />

                                    {/* Scene indicator */}
                                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            {scenes.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 rounded-full transition-all duration-500 ${
                                                        i === activeScene ? 'w-10 bg-red-500' : 'w-3 bg-white/25'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-white/60 text-xs font-bold tabular-nums">
                                            0{activeScene + 1} / 0{scenes.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Scrolling content cards */}
                        <div className="flex-1 py-6">
                            {scenes.map((scene, idx) => (
                                <div
                                    key={scene.id}
                                    data-scene-card={idx}
                                    className="min-h-[85vh] flex items-center"
                                >
                                    <div className={`transition-all duration-600 ${
                                        idx === activeScene
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-30 translate-y-6'
                                    }`}>
                                        {/* Number + Eyebrow */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl xl:text-5xl font-black text-red-600/30 tabular-nums leading-none">
                                                {scene.number}
                                            </span>
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                                                {scene.eyebrow}
                                            </span>
                                        </div>

                                        {/* Title with accent word */}
                                        <h3 className="text-2xl xl:text-3xl font-extrabold leading-tight tracking-tight">
                                            {scene.title}{' '}
                                            <span className="text-red-500">{scene.titleAccent}</span>
                                        </h3>

                                        {/* Description */}
                                        <p className="mt-4 text-[15px] text-gray-400 leading-relaxed max-w-md">
                                            {scene.description}
                                        </p>

                                        {/* Highlight rows — like numbered service list */}
                                        <div className="mt-6 space-y-3">
                                            {scene.highlights.map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3.5 py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                                                >
                                                    <div className="w-9 h-9 rounded-lg bg-red-600/15 text-red-400 flex items-center justify-center shrink-0">
                                                        <h.icon size={18} />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-300">{h.text}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA link */}
                                        <button
                                            onClick={() => {
                                                const el = document.getElementById('danh-muc-xe');
                                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="mt-8 group inline-flex items-center gap-2 text-sm font-bold text-white hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                            Xem Dòng Xe Khách
                                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Mobile: Vertical cards with inline video ─── */}
            <div className="lg:hidden px-4 sm:px-6 pb-14 space-y-6">
                {scenes.map((scene) => (
                    <MobileSceneCard key={scene.id} scene={scene} />
                ))}
            </div>
        </section>
    );
};

const MobileSceneCard = ({ scene }) => {
    const cardRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => {});
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={cardRef} className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
            <div className="relative aspect-video">
                <video
                    ref={videoRef}
                    src={scene.video}
                    poster={scene.poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-red-600/30 tabular-nums">{scene.number}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">{scene.eyebrow}</span>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">
                    {scene.title} <span className="text-red-500">{scene.titleAccent}</span>
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{scene.description}</p>
                <div className="space-y-2 pt-1">
                    {scene.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                            <h.icon size={14} className="text-red-400 shrink-0" />
                            <span>{h.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VehicleShowcase;
