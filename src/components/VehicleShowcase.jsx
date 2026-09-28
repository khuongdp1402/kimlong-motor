import React, { useRef, useState, useEffect } from 'react';
import { Shield, Zap, Gauge, Wrench } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

const scenes = [
    {
        id: 'scene-1',
        video: '/media/showcase/video_sciene1.mp4',
        poster: '/media/showcase/img_sciene1.jpg',
        eyebrow: 'Trải nghiệm thực tế',
        title: 'Chinh phục mọi cung đường',
        description: 'Kim Long 99 vận hành êm ái trên mọi cung đường cao tốc với hệ thống treo bóng hơi thế hệ mới, giảm rung lắc tối đa cho hành khách.',
        highlights: [
            { icon: Gauge, text: 'Động cơ Weichai / Yuchai Euro 5 mạnh mẽ' },
            { icon: Shield, text: 'Khung gầm monocoque chống lật chuẩn ECE R66' },
        ],
    },
    {
        id: 'scene-2',
        video: '/media/showcase/video_sciene2.mp4',
        poster: '/media/showcase/img_sciene2.jpg',
        eyebrow: 'Thiết kế sang trọng',
        title: 'Nội thất đẳng cấp Châu Âu',
        description: 'Mỗi chiếc xe khách Kim Long 99 được hoàn thiện tỉ mỉ với nội thất da cao cấp, hệ thống giải trí cá nhân và chiếu sáng LED ambient.',
        highlights: [
            { icon: Zap, text: '24–34 phòng VIP massage & giường nằm êm ái' },
            { icon: Wrench, text: 'Tùy chỉnh nội thất theo yêu cầu khách hàng' },
        ],
    },
    {
        id: 'scene-3',
        video: '/media/showcase/video_sciene3.mp4',
        poster: '/media/showcase/img_sciene3.jpg',
        eyebrow: 'Vận hành bền bỉ',
        title: 'Đồng hành cùng doanh nghiệp',
        description: 'Từ nội thành đến liên tỉnh, Kim Long 99 là lựa chọn của hơn 100 nhà xe trên cả nước nhờ chi phí vận hành tối ưu và dịch vụ hậu mãi 24/7.',
        highlights: [
            { icon: Shield, text: 'Bảo hành chính hãng 3 năm / 150.000 km' },
            { icon: Gauge, text: 'Tiết kiệm nhiên liệu hàng đầu phân khúc' },
        ],
    },
];

const scrollToCatalog = () => document.getElementById('danh-muc-xe')?.scrollIntoView({ behavior: 'smooth' });

// Section 02 — video carousel: the three clips play one after another (the
// next starts when the current one ends, looping back to the first), with
// the copy crossfading alongside. Playback pauses while the section is off
// screen.
const VehicleShowcase = () => {
    const stageRef = useRef(null);
    const videoRefs = useRef([]);
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return undefined;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Only the active clip plays (from the start); the rest are paused and rewound.
    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (!video) return;
            if (idx === active && inView) {
                video.play().catch(() => {});
            } else {
                video.pause();
                if (idx !== active) video.currentTime = 0;
            }
        });
    }, [active, inView]);

    const goTo = (idx) => {
        setProgress(0);
        setActive(idx);
    };
    const next = () => goTo((active + 1) % scenes.length);

    return (
        <section id="trai-nghiem" className="bg-noir-900 py-24 sm:py-32">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <SectionHeader
                    number="02"
                    eyebrow="Khám phá Kim Long 99"
                    title="Trải nghiệm thực tế từng chi tiết"
                    intro="Video thật về dòng xe khách hàng đầu Việt Nam — từ cung đường, nội thất đến vận hành."
                />

                <Reveal className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 lg:items-center">
                    {/* Video stage */}
                    <div ref={stageRef} className="lg:col-span-7 relative aspect-video rounded-[28px] overflow-hidden bg-graphite-800">
                        {scenes.map((scene, idx) => (
                            <video
                                key={scene.id}
                                ref={(el) => { videoRefs.current[idx] = el; }}
                                src={scene.video}
                                poster={scene.poster}
                                muted
                                playsInline
                                preload={idx === 0 ? 'auto' : 'metadata'}
                                onEnded={idx === active ? next : undefined}
                                onTimeUpdate={idx === active ? (e) => {
                                    const v = e.currentTarget;
                                    if (v.duration) setProgress(v.currentTime / v.duration);
                                } : undefined}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === active ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                        <span className="absolute bottom-5 right-6 text-xs font-bold text-white/80 tabular-nums">
                            0{active + 1} / 0{scenes.length}
                        </span>
                    </div>

                    {/* Copy — all scenes share one grid cell so the height never jumps */}
                    <div className="lg:col-span-5">
                        <div className="grid">
                            {scenes.map((scene, idx) => (
                                <div
                                    key={scene.id}
                                    aria-hidden={idx !== active}
                                    className={`col-start-1 row-start-1 transition-all duration-500 ${idx === active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-accent font-bold text-sm tabular-nums">0{idx + 1}</span>
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">{scene.eyebrow}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-ink">{scene.title}</h3>
                                    <p className="mt-4 text-[15px] text-ink-muted leading-relaxed max-w-md">{scene.description}</p>
                                    <ul className="mt-6 border-t border-line">
                                        {scene.highlights.map((h) => (
                                            <li key={h.text} className="flex items-center gap-3 py-3.5 border-b border-line text-sm text-ink">
                                                <h.icon size={17} className="text-accent shrink-0" />
                                                {h.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Scene selector with per-clip progress */}
                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {scenes.map((scene, idx) => (
                                <button
                                    key={scene.id}
                                    type="button"
                                    onClick={() => goTo(idx)}
                                    aria-label={`Xem video ${idx + 1}: ${scene.title}`}
                                    className="group text-left cursor-pointer"
                                >
                                    <span className="block h-[3px] rounded-full bg-ink/15 overflow-hidden">
                                        <span
                                            className="block h-full bg-accent"
                                            style={{ width: idx === active ? `${progress * 100}%` : idx < active ? '100%' : '0%' }}
                                        />
                                    </span>
                                    <span className={`mt-2 block text-xs truncate transition-colors ${idx === active ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
                                        {scene.eyebrow}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <div className="mt-14">
                    <GhostButton onClick={scrollToCatalog}>Xem các dòng xe khách</GhostButton>
                </div>
            </div>
        </section>
    );
};

export default VehicleShowcase;
