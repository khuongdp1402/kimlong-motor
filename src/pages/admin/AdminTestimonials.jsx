import React, { useEffect, useState } from 'react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../api/client';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';

const emptyTestimonial = {
    name: '',
    subtitle: '',
    quote: '',
    score: '5/5',
    avatar: '',
};

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [creating, setCreating] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (t) => {
        if (!window.confirm(`Xóa đánh giá của "${t.name}"?`)) return;
        try {
            await deleteTestimonial(t.id);
            await load();
        } catch (err) {
            alert(err.message);
        }
    };

    const closeForm = () => {
        setEditing(null);
        setCreating(false);
    };

    const handleSave = async (formData) => {
        try {
            if (creating) {
                await createTestimonial(formData);
            } else {
                await updateTestimonial(editing.id, formData);
            }
            closeForm();
            await load();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>;
    if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đánh giá khách hàng ({testimonials.length})</h2>
                <button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Thêm đánh giá
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ảnh</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Khách hàng</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Đánh giá</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sao</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {testimonials.map((t) => (
                            <tr key={t.id}>
                                <td className="px-4 py-3">
                                    {t.avatar ? (
                                        <img src={t.avatar} alt={t.name} className="h-12 w-12 object-cover rounded-full" />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                    {t.name}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">{t.subtitle}</div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-md truncate">{t.quote}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="inline-flex items-center gap-1">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" /> {t.score}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setEditing(t)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(t)} className="text-red-600 hover:text-red-800 dark:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {testimonials.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Chưa có đánh giá nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {(editing || creating) && (
                <TestimonialForm
                    initial={editing || emptyTestimonial}
                    onCancel={closeForm}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

const TestimonialForm = ({ initial, onCancel, onSave }) => {
    const [form, setForm] = useState({ ...emptyTestimonial, ...initial });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave({
            name: form.name,
            subtitle: form.subtitle,
            quote: form.quote,
            score: form.score,
            avatar: form.avatar,
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {initial.id ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Field label="Tên khách hàng *">
                        <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field label="Địa điểm / phụ đề">
                        <input name="subtitle" value={form.subtitle} onChange={handleChange} className={inputClass} placeholder="Thuận An, Bình Dương..." />
                    </Field>
                    <Field label="Số sao (vd: 5/5)">
                        <select name="score" value={form.score} onChange={handleChange} className={inputClass}>
                            {['5/5', '4/5', '3/5', '2/5', '1/5'].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Nội dung đánh giá">
                        <textarea name="quote" rows={4} value={form.quote} onChange={handleChange} className={inputClass} />
                    </Field>
                    <ImageUpload
                        label="Ảnh đại diện khách hàng"
                        value={form.avatar}
                        onChange={(path) => setForm({ ...form, avatar: path })}
                        category="testimonials"
                        inputClassName={inputClass}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            Hủy
                        </button>
                        <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 transition-colors">
                            {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputClass = 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

export default AdminTestimonials;
