import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP, MOTION_OK } from './gsap';

// Heading whose lines slide up from behind a mask as it enters the viewport,
// and slide back down when it leaves. Re-splits on resize/font load
// (autoSplit), so wrapping stays correct at every width.
const SplitHeading = ({ as = 'h2', className = '', children }) => {
    const Tag = as;
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const split = SplitText.create(ref.current, {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                onSplit: (self) =>
                    gsap.from(self.lines, {
                        yPercent: 110,
                        duration: 1,
                        stagger: 0.09,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: ref.current,
                            start: 'top 88%',
                            end: 'bottom 8%',
                            toggleActions: 'play reverse play reverse',
                        },
                    }),
            });
            return () => split.revert();
        });
        return () => mm.revert();
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
};

export default SplitHeading;
