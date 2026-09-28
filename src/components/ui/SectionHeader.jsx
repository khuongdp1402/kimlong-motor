import React from 'react';
import Reveal from '../motion/Reveal';
import SplitHeading from '../motion/SplitHeading';

// Number + eyebrow + heading + optional intro, used by every home section.
const SectionHeader = ({ number, eyebrow, title, intro, align = 'left', className = '' }) => {
    const centered = align === 'center';
    return (
        <div className={`${centered ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
            <Reveal className={`flex items-center gap-3 mb-5 ${centered ? 'justify-center' : ''}`}>
                {number && <span className="text-accent font-bold text-sm tabular-nums">{number}</span>}
                {number && <span className="w-10 h-px bg-line" />}
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">{eyebrow}</span>
            </Reveal>
            <SplitHeading className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink">
                {title}
            </SplitHeading>
            {intro && (
                <Reveal delay={0.15}>
                    <p className={`mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
                        {intro}
                    </p>
                </Reveal>
            )}
        </div>
    );
};

export default SectionHeader;
