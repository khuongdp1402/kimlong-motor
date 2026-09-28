import { useEffect, useRef } from 'react';

/**
 * Hook that applies scroll-triggered animations using IntersectionObserver.
 *
 * Usage:
 *   const ref = useScrollAnimation();
 *   <div ref={ref} className="scroll-fade-up"> ... </div>
 *
 * Staggered children:
 *   <div ref={ref} className="scroll-fade-up">
 *     <div className="scroll-child" style={{ '--child-i': 0 }}>A</div>
 *     <div className="scroll-child" style={{ '--child-i': 1 }}>B</div>
 *   </div>
 *
 * @param {object} options
 * @param {number} options.threshold - visibility ratio to trigger (default 0.15)
 * @param {string} options.rootMargin - margin around root (default '0px 0px -60px 0px')
 */
export function useScrollAnimation({ threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('scroll-visible');
                    observer.unobserve(el);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return ref;
}
