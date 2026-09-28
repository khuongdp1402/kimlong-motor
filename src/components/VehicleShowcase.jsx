import React, { useRef, useState, useEffect } from 'react';
import { Shield, Zap, Gauge, Wrench } from 'lucide-react';
import { gsap, useGSAP } from './motion/gsap';
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

const SceneCopy = ({ scene, index }) => (
    <>
        <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-bold text-sm tabular-nums">0{index + 1}</span>
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
    </>
);

// Desktop: pinned stage. Scroll progress drives the crossfade between scenes.
const PinnedStage = () => {
    const rootRef = useRef(null);
    const videoRefs = useRef([]);
    const [active, setActive] = useState(0);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const videos = gsap.utils.toArray('[data-scene-video]', rootRef.current);
            const copies = gsap.utils.toArray('[data-scene-copy]', rootRef.current);
            gsap.set(videos.slice(1), { autoAlpha: 0 });
            gsap.set(copies.slice(1), { autoAlpha: 0, y: 40 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (scenes.length - 1) * 1.1}`,
                    pin: true,
                    scrub: 0.8,
                    onUpdate: (self) => setActive(Math.round(self.progress * (scenes.length - 1))),
                },
            });
            for (let i = 1; i < scenes.length; i++) {
                tl.to(copies[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 })
                  .to(videos[i - 1], { autoAlpha: 0, duration: 0.5 }, '<')
                  .to(videos[i], { autoAlpha: 1, duration: 0.5 }, '<')
                  // Start the next copy only once the previous one is nearly
                  // gone, so the two text blocks never read on top of each other.
                  .to(copies[i], { autoAlpha: 1, y: 0, duration: 0.4 }, '<0.35')
                  .to({}, { duration: 0.6 });
            }
        });
        return () => mm.revert();
    }, { scope: rootRef });

    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (!video) return;
            if (idx === active) video.play().catch(() => {});
            else video.pause();
        });
    }, [active]);

    return (
        <div ref={rootRef} className="hidden lg:block motion-reduce:lg:hidden h-screen">
            <div className="h-full max-w-[1400px] mx-auto px-10 py-24 grid grid-cols-12 gap-14 items-center">
                <div className="col-span-7 relative h-full max-h-[640px] rounded-[28px] overflow-hidden bg-graphite-800">
                    {scenes.map((scene, idx) => (
                        <video
                            key={scene.id}
                            data-scene-video
                            ref={(el) => { videoRefs.current[idx] = el; }}
                            src={scene.video}
                            poster={scene.poster}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ))}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        {scenes.map((scene, i) => (
                            <span key={scene.id} className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-accent' : 'w-4 bg-white/30'}`} />
                        ))}
                        <span className="ml-1 text-xs font-bold text-white/70 tabular-nums">0{active + 1} / 0{scenes.length}</span>
                    </div>
                </div>
                <div className="col-span-5 relative h-[420px]">
                    {scenes.map((scene, idx) => (
                        <div key={scene.id} data-scene-copy className="absolute inset-0 flex flex-col justify-center">
                            <SceneCopy scene={scene} index={idx} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mobile / reduced motion: stacked scenes, video plays while on screen.
const StackedScene = ({ scene, index }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        }, { threshold: 0.3 });
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-14 lg:items-center">
            <div className="lg:col-span-7 aspect-video rounded-[24px] overflow-hidden bg-graphite-800">
                <video ref={videoRef} src={scene.video} poster={scene.poster} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-5">
                <SceneCopy scene={scene} index={index} />
            </div>
        </Reveal>
    );
};

// Section 02 — real-world showcase.
const VehicleShowcase = () => (
    <section id="trai-nghiem" className="bg-noir-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-24 sm:pt-32">
            <SectionHeader
                number="02"
                eyebrow="Khám phá Kim Long 99"
                title="Trải nghiệm thực tế từng chi tiết"
                intro="Cuộn để xem từng khoảnh khắc — video thật về dòng xe khách hàng đầu Việt Nam."
            />
        </div>

        <PinnedStage />

        <div className="lg:hidden motion-reduce:lg:block max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-16 space-y-16">
            {scenes.map((scene, idx) => (
                <StackedScene key={scene.id} scene={scene} index={idx} />
            ))}
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pb-24 sm:pb-32">
            <GhostButton onClick={scrollToCatalog}>Xem các dòng xe khách</GhostButton>
        </div>
    </section>
);

export default VehicleShowcase;
