import React, { useEffect, useState } from 'react';
import { getArticles, createArticle, updateArticle, deleteArticle, setArticleFeatured } from '../../api/client';
import { Plus, Pencil, Trash2, X, Lock } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import VisibilityToggle from '../../components/admin/VisibilityToggle';
import ListToolbar from '../../components/admin/ListToolbar';
import { filterItems } from '../../components/admin/listFilters';
import RichTextEditor from '../../components/admin/RichTextEditor';

function slugify(name) {
    return (name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Stored dates are full ISO timestamps from the original scrape; the column
// only ever needed the day.
function formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('vi-VN');
}

const emptyArticle = {
    title: '',
    slug: '',
    category: 'tin-tuc',
    image: '',
    excerpt: '',
    content: '',
    author: 'Kim Long Motor',
    date: '',
    featured: false,
};

const CATEGORY_OPTIONS = [
    { value: 'tin-tuc', label: 'Tin tức' },
    { value: 'thong-cao-bao-chi', label: 'Thông cáo báo chí' },
    { value: 'hoat-dong-noi-bo', label: 'Hoạt động nội bộ' },
];

const AdminArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [creating, setCreating] = useState(false);
    const [search, setSearch] = useState('');
    const [visibility, setVisibility] = useState('all');

    const load = async () => {
        setLoading(true);
        try {
            const data = await getArticles();
            setArticles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (article) => {
        if (!window.confirm(`Xóa bài viết "${article.title}"?`)) return;
        try {
            await deleteArticle(article.id);
            await load();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleFeatured = async (article) => {
        setArticles((prev) => prev.map((a) => (a.id === article.id ? { ...a, featured: !a.featured } : a)));
        try {
            await setArticleFeatured(article.id, !article.featured);
        } catch (err) {
            alert(err.message);
            await load();
        }
    };

    const closeForm = () => {
        setEditing(null);
        setCreating(false);
    };

    const handleSave = async (formData) => {
        try {
            if (creating) {
                await createArticle(formData);
            } else {
                await updateArticle(editing.id, formData);
            }
            closeForm();
            await load();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>;
    if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

    const visibleCount = articles.filter((a) => a.featured).length;
    const shown = filterItems(articles, { search, visibility })
        .slice()
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tin tức ({articles.length})</h2>
                <button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Thêm bài viết
                </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong className="text-gray-700 dark:text-gray-200">{visibleCount}</strong> bài đang hiển thị trên trang chủ
                (trang chủ lấy 3 bài mới nhất trong số đó). Các bài còn lại vẫn xem được ở trang Tin tức.
            </p>

            <ListToolbar
                search={search}
                onSearch={setSearch}
                visibility={visibility}
                onVisibility={setVisibility}
                counts={{ visible: visibleCount, hidden: articles.length - visibleCount }}
                searchPlaceholder="Tìm theo tiêu đề bài viết..."
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ảnh</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tiêu đề</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Chuyên mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ngày</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trang chủ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {shown.map((a) => (
                            <tr key={a.id}>
                                <td className="px-4 py-3">
                                    {a.image ? (
                                        <img src={a.image} alt={a.title} className="h-12 w-16 object-cover rounded" />
                                    ) : (
                                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium max-w-md truncate">{a.title}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{a.category}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(a.date)}</td>
                                <td className="px-4 py-3 text-center">
                                    <VisibilityToggle visible={!!a.featured} onToggle={() => handleToggleFeatured(a)} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setEditing(a)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(a)} className="text-red-600 hover:text-red-800 dark:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {shown.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {articles.length === 0 ? 'Chưa có bài viết nào.' : 'Không có bài viết nào khớp bộ lọc.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {(editing || creating) && (
                <ArticleForm
                    initial={editing || emptyArticle}
                    onCancel={closeForm}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

const ArticleForm = ({ initial, onCancel, onSave }) => {
    const [form, setForm] = useState({
        ...emptyArticle,
        ...initial,
        slug: initial.slug || (initial.title ? slugify(initial.title) : ''),
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setForm((prev) => ({
            ...prev,
            title: val,
            slug: !initial.id ? slugify(val) : prev.slug,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave({
            title: form.title,
            slug: form.slug || slugify(form.title),
            category: form.category,
            categories: [form.category],
            image: form.image,
            excerpt: form.excerpt,
            content: form.content,
            author: form.author,
            date: form.date,
            featured: !!form.featured,
            sourceUrl: form.sourceUrl || '',
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {initial.id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Field label="Tiêu đề *">
                        <input name="title" required value={form.title} onChange={handleTitleChange} className={inputClass} />
                    </Field>

                    <Field label="Slug (Đường dẫn cố định - Không cho sửa để tránh lỗi)">
                        <div className="relative">
                            <input
                                name="slug"
                                readOnly
                                value={form.slug}
                                className={`${inputClass} bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 cursor-not-allowed pl-8 font-mono text-xs`}
                                placeholder="Tự động sinh theo tiêu đề bài viết"
                            />
                            <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                            * Đường dẫn cố định, không cho sửa thủ công để bảo vệ liên kết bài viết và SEO.
                        </p>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Chuyên mục">
                            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Ngày đăng (YYYY-MM-DD)">
                            <input name="date" value={form.date} onChange={handleChange} className={inputClass} placeholder="2026-05-20" />
                        </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={!!form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        Hiển thị bài này trên trang chủ (trang chủ lấy 3 bài mới nhất trong số các bài được bật)
                    </label>

                    <ImageUpload
                        label="Ảnh đại diện"
                        value={form.image}
                        onChange={(path) => setForm({ ...form, image: path })}
                        category="news"
                        inputClassName={inputClass}
                    />
                    <Field label="Tóm tắt">
                        <textarea name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field label="Nội dung bài viết (Soạn thảo trực quan)">
                        <RichTextEditor
                            value={form.content}
                            onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                            placeholder="Nhập nội dung bài viết..."
                            minHeight="260px"
                        />
                    </Field>
                    <Field label="Tác giả">
                        <input name="author" value={form.author} onChange={handleChange} className={inputClass} />
                    </Field>

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

export default AdminArticles;
