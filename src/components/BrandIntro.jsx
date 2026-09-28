import React from 'react';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';
import Counter from './motion/Counter';

const metrics = [
    { to: 600, suffix: '+', label: 'Hecta tổ hợp nhà máy hiện đại' },
    { to: 50000, suffix: '+', label: 'Xe/năm công suất thiết kế' },
    { text: 'Euro 5 – 6', label: 'Tiêu chuẩn khí thải công nghệ cao' },
    { text: 'Toàn quốc', label: 'Hệ thống bảo hành & trạm dịch vụ' },
];

// Section 01 — large brand statement + four metrics on hairline dividers.
const BrandIntro = () => (
    <section id="gioi-thieu-thuong-hieu" className="bg-noir-950 py-24 sm:py-36">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal className="flex items-center gap-3 mb-8">
                <span className="text-accent font-bold text-sm tabular-nums">01</span>
                <span className="w-10 h-px bg-line" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">Kim Long Motor</span>
            </Reveal>

            <SplitHeading className="max-w-5xl text-3xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.1] text-ink">
                Tổ hợp sản xuất ô tô hiện đại bậc nhất Việt Nam — tạo nên những chiếc xe khách, xe tải và xe chuyên dùng đạt chuẩn quốc tế.
            </SplitHeading>

            <Reveal delay={0.1}>
                <p className="mt-8 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">
                    Nhà máy tại Khu kinh tế Chân Mây – Lăng Cô (Huế) ứng dụng dây chuyền công nghệ tiên tiến, đồng hành cùng hàng chục nghìn khách hàng doanh nghiệp trên khắp cả nước.
                </p>
            </Reveal>

            <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 border-t border-line">
                {metrics.map((m, idx) => (
                    <Reveal
                        key={m.label}
                        delay={idx * 0.08}
                        className={`py-8 sm:py-10 pr-4 ${idx % 2 === 1 ? 'pl-4 sm:pl-8 border-l border-line' : ''} ${idx >= 2 ? 'border-t lg:border-t-0 border-line' : ''} ${idx === 2 ? 'lg:pl-8 lg:border-l' : ''}`}
                    >
                        <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
                            {m.to !== undefined ? <Counter to={m.to} suffix={m.suffix} /> : m.text}
                        </div>
                        <div className="mt-3 text-xs sm:text-sm text-ink-muted max-w-[180px] leading-snug">{m.label}</div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default BrandIntro;
