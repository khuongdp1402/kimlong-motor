import { useEffect } from 'react';

// Freezes the page behind a modal: stops Lenis smooth scrolling and hides
// the document scrollbar while `locked` is true, restoring both afterwards.
// The modal itself keeps native scrolling (see the `prevent` option in
// components/motion/SmoothScroll.jsx).
export function useScrollLock(locked) {
    useEffect(() => {
        if (!locked) return undefined;
        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        root.style.overflow = 'hidden';
        window.__lenis?.stop();
        return () => {
            root.style.overflow = previousOverflow;
            window.__lenis?.start();
        };
    }, [locked]);
}
