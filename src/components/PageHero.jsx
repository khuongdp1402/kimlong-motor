import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';

// Shared noir hero for sub-pages. Always dark, so the transparent navbar that
// sits on top of it stays legible.
const PageHero = ({ eyebrow, title, description, image, crumbs = [] }) => (
    <section className="relative overflow-hidden bg-noir-950 pt-36 sm:pt-44 pb-16 sm:pb-24">
        {image && (
            <>
                <img src={image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-b from-noir-950/60 via-noir-950/70 to-noir-950" />
            </>
        )}
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            {crumbs.length > 0 && (
                <Reveal as="nav" aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <Link to="/" className="hover:text-ink">Trang chủ</Link>
                    {crumbs.map((c) => (
                        <React.Fragment key={c.label}>
                            <span className="text-white/25">/</span>
                            {c.to ? <Link to={c.to} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                        </React.Fragment>
                    ))}
                </Reveal>
            )}
            {eyebrow && (
                <Reveal className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-5">{eyebrow}</Reveal>
            )}
            <SplitHeading as="h1" className="max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-ink">
                {title}
            </SplitHeading>
            {description && (
                <Reveal delay={0.1}>
                    {/* May carry CMS copy (e.g. the About intro) — excluded from brand checks. */}
                    <p data-cms-content className="mt-6 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">{description}</p>
                </Reveal>
            )}
        </div>
    </section>
);

export default PageHero;
