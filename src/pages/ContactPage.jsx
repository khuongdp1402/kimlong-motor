import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageCircle, User, ClipboardList } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { useApiData } from '../hooks/useApiData';
import { getContact, getProducts, createLead } from '../api/client';
import { productCategories } from '../data/categories';

const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

// Real stats from the live /lien-he hero, as captured in the screenshot —
// not present as structured data in content.json, so kept verbatim here
// rather than re-derived.
const STATS = [
    { value: '15+', label: 'năm kinh nghiệm' },
    { value: '1.200+', label: 'bàn giao trong tháng' },
    { value: "5'", label: 'phản hồi tư vấn' },
    { value: '24/7', label: 'Nhanh bảo hành' },
];

const STEPS = [
    { title: 'Tiếp Nhận', desc: 'Ghi nhận nhu cầu và thông tin liên hệ của khách hàng.' },
    { title: 'Tư Vấn', desc: 'Chuyên viên tư vấn dòng xe, giá bán và phương án trả góp phù hợp.' },
    { title: 'Trải Nghiệm', desc: 'Khách hàng lái thử, trải nghiệm thực tế xe tại showroom.' },
    { title: 'Bàn Giao', desc: 'Hoàn tất thủ tục, bàn giao xe và hỗ trợ hậu mãi.' },
];

const TOPICS = [
    'Tư vấn báo giá xe',
    'Hỗ trợ trả góp ngân hàng',
    'Bảo hành - bảo dưỡng',
    'Phụ tùng & phụ kiện',
    'Hợp tác đại lý',
    'Khác',
];

const ContactPage = () => {
    const { data: contact, loading } = useApiData(getContact, []);
    const { data: products } = useApiData(getProducts, []);
    const showrooms = contact?.showrooms || [];

    const [showroomIdx, setShowroomIdx] = useState(0);
    const activeShowroom = showrooms[showroomIdx];

    const [form, setForm] = useState({ name: '', phone: '', topic: TOPICS[0], message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await createLead({ ...form, source: 'contact_page' });
            setStatus('sent');
            setForm({ name: '', phone: '', topic: TOPICS[0], message: '' });
        } catch {
            setStatus('error');
        }
    };

    const featuredProducts = (products || []).slice(0, 4);

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Split hero */}
                <section className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="bg-white dark:bg-gray-800 px-6 sm:px-10 lg:px-16 py-16 flex flex-col justify-center transition-colors duration-300">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white uppercase leading-tight mb-4">
                            Liên Hệ Ngay<br />Với Chúng Tôi
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                            Đội ngũ tư vấn Kim Long Miền Nam sẵn sàng hỗ trợ bạn lựa chọn dòng xe phù hợp và mức giá tốt nhất.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm tracking-wide transition-colors"
                            >
                                Gửi Yêu Cầu
                            </button>
                            <a
                                href={`tel:${HOTLINE}`}
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold uppercase text-sm tracking-wide hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
                            >
                                <Phone size={16} /> Hotline: {HOTLINE_DISPLAY}
                            </a>
                        </div>
                    </div>
                    <div
                        className="bg-red-600 px-6 sm:px-10 lg:px-16 py-16 flex flex-col justify-center text-white"
                        style={{ clipPath: 'polygon(6% 0, 100% 0, 100% 100%, 0% 100%)' }}
                    >
                        <div className="space-y-6 max-w-sm ml-auto">
                            {STATS.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 border-b border-white/20 pb-4 last:border-b-0">
                                    <span className="text-3xl font-extrabold w-24 flex-shrink-0">{s.value}</span>
                                    <span className="text-red-50 text-sm">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4 info cards */}
                {!loading && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-colors duration-300">
                                <MapPin className="text-red-600 dark:text-red-500 mb-3" size={24} />
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{showrooms[0]?.name || 'Showroom'}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{showrooms[0]?.address}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-colors duration-300">
                                <Phone className="text-red-600 dark:text-red-500 mb-3" size={24} />
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Hotline & Giờ Làm Việc</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{contact?.hotline || HOTLINE_DISPLAY} · 08:00 - 17:30</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-colors duration-300">
                                <MessageCircle className="text-red-600 dark:text-red-500 mb-3" size={24} />
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Zalo / Messenger</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Nhắn tin trực tuyến để được hỗ trợ nhanh nhất.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-colors duration-300">
                                <Clock className="text-red-600 dark:text-red-500 mb-3" size={24} />
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Thời Gian Phản Hồi</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Trung bình 5 phút trong giờ làm việc.</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Form + map */}
                <section id="contact-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Để lại số điện thoại...</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Chúng tôi sẽ liên hệ tư vấn trong thời gian sớm nhất.</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Họ và tên</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="text" name="name" value={form.name} onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Số điện thoại *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <input
                                            type="tel" name="phone" required value={form.phone} onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="09xx xxx xxx"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vấn đề cần tư vấn</label>
                                    <div className="relative">
                                        <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                        <select
                                            name="topic" value={form.topic} onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nội dung</label>
                                    <textarea
                                        name="message" rows="4" value={form.message} onChange={handleChange}
                                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Nội dung cần tư vấn..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wide"
                                >
                                    {status === 'sending' ? 'Đang gửi...' : 'Gửi Yêu Cầu Tư Vấn'}
                                </button>
                                {status === 'sent' && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Cảm ơn bạn! Yêu cầu đã được ghi nhận, chúng tôi sẽ liên hệ sớm nhất.</p>
                                )}
                                {status === 'error' && (
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Có lỗi xảy ra, vui lòng gọi hotline {HOTLINE_DISPLAY}.</p>
                                )}
                            </form>
                        </div>

                        {/* Showroom selector + map */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Bạn cần tìm chi nhánh?</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Chọn showroom gần bạn nhất để xem địa chỉ và hotline.</p>
                            <select
                                value={showroomIdx}
                                onChange={(e) => setShowroomIdx(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {showrooms.map((s, i) => (
                                    <option key={i} value={i}>{s.name}</option>
                                ))}
                            </select>

                            {activeShowroom && (
                                <div className="flex flex-col sm:flex-row gap-4 mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2 mb-2">
                                            <MapPin size={16} className="flex-shrink-0 mt-0.5 text-red-600 dark:text-red-500" />
                                            {activeShowroom.address}
                                        </p>
                                        <a href={`tel:${(activeShowroom.phone || '').replace(/\./g, '')}`} className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Phone size={16} className="text-red-600 dark:text-red-500" />
                                            {activeShowroom.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 min-h-[280px] bg-gray-100 dark:bg-gray-900">
                                {activeShowroom?.mapEmbed ? (
                                    <iframe
                                        key={showroomIdx}
                                        src={activeShowroom.mapEmbed}
                                        width="100%" height="280"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        title={activeShowroom.name}
                                    />
                                ) : (
                                    <div className="w-full h-[280px] flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Bản đồ không khả dụng</div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dark red process band */}
                <section className="bg-red-800 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase text-center mb-10">
                            Mua Xe Thật Đơn Giản
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {STEPS.map((step, i) => (
                                <div key={i} className="bg-white/10 rounded-xl p-6 text-center text-white">
                                    <div className="w-10 h-10 mx-auto rounded-full bg-white text-red-700 font-extrabold flex items-center justify-center mb-4">
                                        {i + 1}
                                    </div>
                                    <h4 className="font-bold mb-2">{step.title}</h4>
                                    <p className="text-sm text-red-100">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {productCategories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    to={`/category/${cat.slug}`}
                                    className="px-4 py-2 rounded-full bg-white/15 hover:bg-white text-white hover:text-red-700 text-sm font-semibold transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured products */}
                {featuredProducts.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase text-center mb-10">Sản Phẩm Nổi Bật</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/product/${p.slug || p.id}`}
                                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.75rem]">{p.name}</h3>
                                        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                            <span className="text-red-600 dark:text-red-400 font-bold text-sm">{p.priceDisplay || 'Liên hệ'}</span>
                                            <span className="text-red-600 dark:text-red-400 text-sm font-semibold">Xem chi tiết →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <Footer />
            <FloatingButtons />
        </>
    );
};

export default ContactPage;
