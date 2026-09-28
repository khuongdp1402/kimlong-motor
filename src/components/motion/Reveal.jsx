import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

// Fades + slides its children in when they enter the viewport and back out
// when they leave (both directions). Static and fully visible when the user
// prefers reduced motion. The hidden start state is applied by GSAP at
// runtime, so content is never stuck invisible if the effect doesn't run.
const Reveal = ({ as = 'div', y = 24, delay = 0, className = '', children, ...rest }) => {
    const Tag = as;
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            gsap.fromTo(
                ref.current,
                { autoAlpha: 0, y },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 88%',
                        end: 'bottom 12%',
                        toggleActions: 'play reverse play reverse',
                    },
                }
            );
        });
        return () => mm.revert();
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className} {...rest}>
            {children}
        </Tag>
    );
};

export default Reveal;
