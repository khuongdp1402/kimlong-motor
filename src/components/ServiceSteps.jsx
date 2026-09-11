import React from 'react';
import { useApiData } from '../hooks/useApiData';
import { getServiceSteps } from '../api/client';

// Red band "XƯỞNG DỊCH VỤ CHUYÊN NGHIỆP" — 4 steps: Tiếp Nhận, Bảo Dưỡng,
// Kiểm Tra, Hậu Mãi.
const ServiceSteps = () => {
    const { data } = useApiData(getServiceSteps, []);
    const items = data?.items || [];

    if (items.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-r from-red-700 to-red-600 dark:from-red-800 dark:to-red-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl uppercase">
                        {data?.title || 'Xưởng Dịch Vụ Chuyên Nghiệp'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, index) => (
                        <div key={index} className="text-center relative">
                            <div className="mx-auto mb-5 w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg relative">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
                                ) : null}
                                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                                    {item.badge}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-red-50 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceSteps;
