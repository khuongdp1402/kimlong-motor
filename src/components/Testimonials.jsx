import React from 'react';
import { useApiData } from '../hooks/useApiData';
import { getTestimonials, getPhotoStrip } from '../api/client';
import { Star, Quote } from 'lucide-react';

// "Đánh Giá Khách Hàng" — real customer quotes/names/star ratings, plus the
// real event/customer photo strip beneath it.
const Testimonials = () => {
    const { data: testimonials } = useApiData(getTestimonials, []);
    const { data: photos } = useApiData(getPhotoStrip, []);

    const list = testimonials || [];
    const photoList = (photos || []).filter((p) => p.type === 'image').slice(0, 4);

    if (list.length === 0) return null;

    return (
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Đánh Giá Khách Hàng
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {list.slice(0, 3).map((t, idx) => {
                        const scoreNum = parseFloat((t.score || '').split('/')[0]) || 5;
                        return (
                            <div key={idx} className="relative bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 pt-10">
                                <Quote className="absolute top-4 left-4 text-red-100 dark:text-red-900/40" size={40} />
                                <div className="relative flex items-center gap-3 mb-3">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-100" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30" />
                                    )}
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.subtitle}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.round(scoreNum) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                                    ))}
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{t.score}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                    {t.quote}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {photoList.length > 0 && (
                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photoList.map((p, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
                                <img src={p.image} alt={p.alt || 'Kim Long Miền Nam'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;
