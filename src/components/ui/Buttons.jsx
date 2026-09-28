import React from 'react';
import { ArrowRight } from 'lucide-react';

// The only two button styles in the Showroom Noir system.
// Pass `as="a"` + href for links; defaults to <button type="button">.

export const PrimaryButton = ({ as: Tag = 'button', className = '', children, ...rest }) => (
    <Tag
        {...(Tag === 'button' ? { type: 'button' } : {})}
        {...rest}
        className={`group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white font-semibold pl-6 pr-1.5 py-1.5 rounded-full transition-all hover:-translate-y-0.5 cursor-pointer ${className}`}
    >
        <span className="text-sm sm:text-[15px]">{children}</span>
        <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={16} />
        </span>
    </Tag>
);

export const GhostButton = ({ as: Tag = 'button', className = '', children, ...rest }) => (
    <Tag
        {...(Tag === 'button' ? { type: 'button' } : {})}
        {...rest}
        className={`group inline-flex items-center gap-2 border border-ink/20 hover:border-ink/50 text-ink font-semibold px-5 py-2.5 rounded-full text-sm transition-colors cursor-pointer ${className}`}
    >
        {children}
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
    </Tag>
);
