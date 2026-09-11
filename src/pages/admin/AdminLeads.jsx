import React, { useEffect, useState } from 'react';
import { getLeads } from '../../api/client';
import { Phone, RefreshCw, User, MessageSquare, Package } from 'lucide-react';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getLeads();
            setLeads(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Khách hàng liên hệ</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Danh sách yêu cầu tư vấn/báo giá gửi từ website (form Liên hệ, popup báo giá sản phẩm...).
                    </p>
                </div>
                <button
                    onClick={load}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <RefreshCw size={16} /> Tải lại
                </button>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">Đang tải...</div>
            ) : leads.length === 0 ? (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    Chưa có khách hàng nào để lại thông tin liên hệ.
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Thời gian</th>
                                    <th className="px-4 py-3 font-semibold">Khách hàng</th>
                                    <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                                    <th className="px-4 py-3 font-semibold">Vấn đề / Sản phẩm</th>
                                    <th className="px-4 py-3 font-semibold">Nội dung</th>
                                    <th className="px-4 py-3 font-semibold">Nguồn</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="text-gray-800 dark:text-gray-200 align-top">
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {formatDate(lead.createdAt)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                                                <User size={14} className="text-gray-400 dark:text-gray-500" />
                                                {lead.name || <span className="text-gray-400 italic">(chưa để tên)</span>}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400 hover:underline"
                                            >
                                                <Phone size={14} />
                                                {lead.phone}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 max-w-[220px]">
                                            {lead.topic && (
                                                <div className="text-gray-700 dark:text-gray-300">{lead.topic}</div>
                                            )}
                                            {lead.productName && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    <Package size={12} /> {lead.productName}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 max-w-[280px] text-gray-600 dark:text-gray-300">
                                            {lead.message ? (
                                                <span className="flex items-start gap-1.5">
                                                    <MessageSquare size={14} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
                                                    <span className="line-clamp-3">{lead.message}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                {lead.source || 'contact_page'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLeads;
