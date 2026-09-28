import React, { useState, useEffect, useRef } from 'react';
import { Factory, Truck, ShieldCheck, MapPinned } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const metrics = [
    { icon: Factory, value: '600+', numeric: 600, suffix: '+', label: 'Hecta tổ hợp nhà máy hiện đại' },
    { icon: Truck, value: '50.000+', numeric: 50000, suffix: '+', label: 'Xe/năm công suất thiết kế' },
    { icon: ShieldCheck, value: 'Euro 5 - Euro 6', numeric: null, suffix: '', label: 'Tiêu chuẩn khí thải công nghệ cao' },
    { icon: MapPinned, value: 'Toàn Quốc', numeric: null, suffix: '', label: 'Hệ thống bảo hành & trạm dịch vụ' },
];

// Rolling number counter for metrics that are actually numeric; metrics
// without a `numeric` value (e.g. "Euro 5 - Euro 6") just render their text.
const AnimatedMetric = ({ metric }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (metric.numeric === null) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1600;
                    const start = performance.now();
                    const animate = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.round(eased * metric.numeric));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [metric.numeric]);

    if (metric.numeric === null) {
        return <span ref={ref}>{metric.value}</span>;
    }
    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString('vi-VN')}{metric.suffix}
        </span>
    );
};

const BrandIntro = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section className="py-14 sm:py-20 bg-brand-bg">
            <div ref={sectionRef} className="scroll-fade-up max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed max-w-3xl mx-auto">
                    <strong className="text-brand-text">Kim Long Motor</strong> vận hành tổ hợp nhà máy sản xuất và lắp ráp ô tô hiện đại bậc nhất Việt Nam tại Khu kinh tế Chân Mây – Lăng Cô (Huế), ứng dụng dây chuyền công nghệ tiên tiến để tạo ra các dòng xe khách, xe tải và xe chuyên dùng đạt tiêu chuẩn quốc tế, đồng hành cùng hàng chục nghìn khách hàng trên khắp cả nước.
                </p>

                <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {metrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="scroll-child bg-white rounded-brand-lg border border-brand-border shadow-brand-soft p-5 sm:p-6 flex flex-col items-center gap-2"
                            style={{ '--child-i': idx }}
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-brand-primary flex items-center justify-center">
                                <metric.icon size={22} />
                            </div>
                            <div className="text-xl sm:text-3xl font-black text-brand-text tracking-tight">
                                <AnimatedMetric metric={metric} />
                            </div>
                            <div className="text-[11px] sm:text-xs font-semibold text-brand-muted leading-snug">
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandIntro;
