import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApiData } from '../hooks/useApiData';
import { getHeroSlides } from '../api/client';

// Premium "car manufacturer site" style hero banner: crossfade between real
// scraped slides, a subtle mouse-parallax tilt on the image layer, and an
// ambient light-sweep highlight. Implemented with pure CSS transforms/
// transitions (no framer-motion/three.js) — the effect only needs 2D
// translate/scale on a couple of layers, so a WebGL library would add
// bundle weight and complexity without a visual payoff a CSS transform
// can't already deliver at 60fps.
const AUTOPLAY_MS = 5500;

const HeroSlider = () => {
    const { data: slides } = useApiData(getHeroSlides, []);
    const [active, setActive] = useState(0);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const timerRef = useRef(null);

    const validSlides = (slides || []).filter((s) => s.image);

    const goTo = useCallback((idx) => {
        setActive((prev) => {
            const len = validSlides.length || 1;
            return (idx + len) % len;
        });
    }, [validSlides.length]);

    useEffect(() => {
        if (validSlides.length <= 1) return undefined;
        timerRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % validSlides.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(timerRef.current);
    }, [validSlides.length]);

    const handleMouseMove = (e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setPointer({ x, y });
    };

    const handleMouseLeave = () => setPointer({ x: 0, y: 0 });

    if (!validSlides.length) return null;

    return (
        <div
            ref={containerRef}
            className="relative mt-20 h-[420px] sm:h-[520px] md:h-[620px] lg:h-[700px] overflow-hidden bg-gray-900 select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {validSlides.map((slide, idx) => {
                const isActive = idx === active;
                return (
                    <div
                        key={idx}
                        className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
                        style={{
                            opacity: isActive ? 1 : 0,
                            pointerEvents: isActive ? 'auto' : 'none',
                            zIndex: isActive ? 2 : 1,
                        }}
                        aria-hidden={!isActive}
                    >
                        {/* Background depth layer - slow parallax + slight scale for depth-of-field */}
                        <div
                            className="absolute inset-0 will-change-transform"
                            style={{
                                transform: isActive
                                    ? `scale(1.12) translate3d(${pointer.x * -18}px, ${pointer.y * -12}px, 0)`
                                    : 'scale(1.12) translate3d(0,0,0)',
                                transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                        >
                            <img
                                src={slide.image}
                                alt={slide.alt || 'Kim Long Miền Nam'}
                                className="w-full h-full object-cover"
                                style={{ filter: 'brightness(0.92)' }}
                            />
                        </div>

                        {/* Foreground vehicle-plane layer: subtle independent parallax +
                            perspective tilt for a faux-3D "showroom turntable" feel. */}
                        <div
                            className="absolute inset-0 will-change-transform"
                            style={{
                                transform: isActive
                                    ? `perspective(1200px) rotateX(${pointer.y * 2.5}deg) rotateY(${pointer.x * -3.5}deg) translate3d(${pointer.x * 10}px, ${pointer.y * 6}px, 0)`
                                    : 'perspective(1200px) rotateX(0) rotateY(0)',
                                transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Ambient light sweep */}
                            <div
                                className="absolute inset-0 opacity-40 mix-blend-overlay"
                                style={{
                                    background: `radial-gradient(circle at ${50 + pointer.x * 40}% ${50 + pointer.y * 40}%, rgba(255,255,255,0.35), transparent 55%)`,
                                }}
                            />
                        </div>

                        {/* Gradient scrim for legibility + brand mood */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                    </div>
                );
            })}

            {/* Dot navigation */}
            {validSlides.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {validSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goTo(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                                width: idx === active ? 28 : 8,
                                background: idx === active ? '#dc2626' : 'rgba(255,255,255,0.6)',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Prev/Next arrows */}
            {validSlides.length > 1 && (
                <>
                    <button
                        onClick={() => goTo(active - 1)}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                        ‹
                    </button>
                    <button
                        onClick={() => goTo(active + 1)}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                        ›
                    </button>
                </>
            )}
        </div>
    );
};

export default HeroSlider;
