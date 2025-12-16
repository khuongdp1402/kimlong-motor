import React, { useState } from 'react';
import { X, User, Phone, Mail, MessageSquare } from 'lucide-react';

const ContactPopup = ({ isOpen, onClose, productName = '' }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        setFormData({ name: '', phone: '', email: '', message: '' });
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 z-40 transition-opacity bg-black/40"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="relative z-50 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                            LIÊN HỆ NGAY
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="bg-white px-6 py-6">
                        {productName && (
                            <p className="text-sm text-gray-700 mb-2">
                                Sản phẩm quan tâm:{' '}
                                <span className="font-semibold text-gray-900">{productName}</span>
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mb-6">
                            Vui lòng để lại thông tin, Kim Long sẽ liên hệ tư vấn và báo giá chi tiết trong thời gian sớm nhất.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="popup-name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên của bạn
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="popup-name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Tên của bạn.."
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="popup-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="popup-phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="popup-email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Địa chỉ email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="popup-message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đăng ký
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <MessageSquare className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="popup-message"
                                        name="message"
                                        rows="3"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Nội dung đăng ký..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-md text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-semibold"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPopup;

