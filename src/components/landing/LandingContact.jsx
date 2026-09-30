import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Mail, User } from 'lucide-react';
import { createLead, getContact } from '../../api/client';
import { businessInfo } from '../../data/hongthuong-data';
import Reveal from '../motion/Reveal';
import ZaloIcon from './ZaloIcon';

const DEFAULT_EMAIL = 'thuong.kimlongmotor@gmail.com';

const LandingContact = () => {
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [email, setEmail] = useState(DEFAULT_EMAIL);

    useEffect(() => {
        getContact()
            .then((data) => { if (data?.email) setEmail(data.email); })
            .catch(() => { /* keep default */ });
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await createLead({ ...form, source: 'landing_simple' });
            setStatus('sent');
            setForm({ name: '', phone: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="lien-he" className="py-16 sm:py-20 bg-slate-50">
            <div className="max-w-5xl mx-auto px-5 sm:px-6">
                <Reveal>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">Liên Hệ Với Chúng Tôi</h2>
                    <p className="mt-2 text-slate-500 text-center">Để lại số điện thoại, chúng tôi sẽ gọi tư vấn trong thời gian sớm nhất</p>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Reveal as="form" onSubmit={handleSubmit} y={20} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text" name="name" value={form.name} onChange={handleChange}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại *</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel" name="phone" required value={form.phone} onChange={handleChange}
                                    placeholder="09xx xxx xxx"
                                    className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nội dung</label>
                            <textarea
                                name="message" rows="3" value={form.message} onChange={handleChange}
                                placeholder="Nội dung cần tư vấn..."
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                            <p className="text-sm text-green-600 font-medium">Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.</p>
                        )}
                        {status === 'error' && (
                            <p className="text-sm text-red-600 font-medium">Có lỗi xảy ra, vui lòng gọi hotline {businessInfo.hotlineSales}.</p>
                        )}
                    </Reveal>

                    <Reveal y={20} delay={0.1} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-center gap-6">
                        <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="flex items-center gap-4 hover:text-red-600 transition-colors">
                            <span className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <Phone size={20} />
                            </span>
                            <span>
                                <span className="block text-xs text-slate-500">Hotline bán hàng</span>
                                <span className="block text-lg font-bold text-slate-900">{businessInfo.hotlineSales}</span>
                            </span>
                        </a>
                        <a href={businessInfo.zaloUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-red-600 transition-colors">
                            <span className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <ZaloIcon size={22} />
                            </span>
                            <span>
                                <span className="block text-xs text-slate-500">Zalo</span>
                                <span className="block text-lg font-bold text-slate-900">Nhắn tin qua Zalo</span>
                            </span>
                        </a>
                        <a href={`mailto:${email}`} className="flex items-center gap-4 hover:text-red-600 transition-colors">
                            <span className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <Mail size={20} />
                            </span>
                            <span>
                                <span className="block text-xs text-slate-500">Email</span>
                                <span className="block text-lg font-bold text-slate-900">{email}</span>
                            </span>
                        </a>
                        <div className="flex items-start gap-4">
                            <span className="h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </span>
                            <span>
                                <span className="block text-xs text-slate-500">Địa chỉ</span>
                                <span className="block text-sm font-medium text-slate-900">{businessInfo.address}</span>
                            </span>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default LandingContact;
