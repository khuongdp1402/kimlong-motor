import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

// Image that "opens" with a clip-path wipe while scaling from 1.15 to 1,
// scrubbed to scroll position.
const ImageReveal = ({ src, alt, className = '', imgClassName = '' }) => {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: 'top 90%',
                    end: 'top 35%',
                    scrub: 0.6,
                },
            });
            tl.fromTo(wrapRef.current, { clipPath: 'inset(14% 10% 14% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
              .fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);
        });
        return () => mm.revert();
    }, { scope: wrapRef });

    return (
        <div ref={wrapRef} className={`overflow-hidden ${className}`}>
            <img ref={imgRef} src={src} alt={alt} loading="lazy" className={`w-full h-full object-cover ${imgClassName}`} />
        </div>
    );
};

export default ImageReveal;
