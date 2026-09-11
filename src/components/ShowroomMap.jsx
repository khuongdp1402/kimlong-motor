import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { getShowroom } from '../api/client';
import { MapPin, Phone } from 'lucide-react';

// "Showroom Kim Long" section — left: showroom info card (name/address/hotline
// + "Xem bản đồ Google Map" button), right: embedded map (real Google Maps
// embed URLs scraped from the live contact page).
const ShowroomMap = () => {
    const { data: showrooms } = useApiData(getShowroom, []);
    const [activeIdx, setActiveIdx] = useState(0);

    const list = showrooms || [];
    if (list.length === 0) return null;
    const active = list[activeIdx] || list[0];

    return (
        <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Showroom Kim Long
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-5">
                            {list.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIdx(idx)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                        idx === activeIdx
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                                    }`}
                                >
                                    {s.name}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{active.name}</h3>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                                    <Phone className="text-red-600 dark:text-red-400" size={18} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Hotline liên hệ</div>
                                    <a href={`tel:${(active.phone || '').replace(/\./g, '')}`} className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400">
                                        {active.phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                                    <MapPin className="text-red-600 dark:text-red-400" size={18} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Địa chỉ showroom</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{active.address}</div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={active.mapEmbed ? active.mapEmbed.replace('/embed?', '/embed?').replace('output=embed', '') : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                        >
                            Xem bản đồ Google Map
                        </a>
                    </div>

                    <div className="lg:col-span-3 rounded-xl overflow-hidden shadow-lg min-h-[320px] bg-gray-200 dark:bg-gray-800">
                        {active.mapEmbed ? (
                            <iframe
                                key={activeIdx}
                                src={active.mapEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: 320 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                title={active.name}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">Bản đồ không khả dụng</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowroomMap;
