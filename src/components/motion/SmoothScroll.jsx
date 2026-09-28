import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, MOTION_OK } from './gsap';

// Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in
// sync. Also resets scroll on route change and refreshes trigger positions
// when async content (API data, images) changes the page height.
const SmoothScroll = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (!window.matchMedia(MOTION_OK).matches) return undefined;

        const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
        window.__lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    useEffect(() => {
        let timeout;
        const observer = new ResizeObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => ScrollTrigger.refresh(), 150);
        });
        observer.observe(document.body);
        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default SmoothScroll;
