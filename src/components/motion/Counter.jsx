import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

const format = (n) => Math.round(n).toLocaleString('vi-VN');

// Number that rolls up from 0 when it scrolls into view. Renders the final
// value in the markup so it is correct without animation.
const Counter = ({ to, suffix = '', className = '' }) => {
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const state = { value: 0 };
            gsap.to(state, {
                value: to,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => { ref.current.textContent = `${format(state.value)}${suffix}`; },
                scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
            });
        });
        return () => mm.revert();
    }, { scope: ref, dependencies: [to, suffix] });

    return (
        <span ref={ref} className={`tabular-nums ${className}`}>
            {format(to)}{suffix}
        </span>
    );
};

export default Counter;
