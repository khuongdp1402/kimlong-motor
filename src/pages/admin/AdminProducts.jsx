import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, setProductFeatured } from '../../api/client';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import GalleryUpload from '../../components/admin/GalleryUpload';

const emptyProduct = {
    name: '',
    slug: '',
    category: '',
    price: 'Liên hệ',
    image: '',
    description: '',
    gallery: [],
    specs: [],
    features: [],
    featured: false,
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null); // product being edited, or null
    const [creating, setCreating] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (product) => {
        if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
        try {
            await deleteProduct(product.id);
            await load();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleFeatured = async (product) => {
        // optimistic update so the toggle feels instant
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p)));
        try {
            await setProductFeatured(product.id, !product.featured);
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
                await createProduct(formData);
            } else {
                await updateProduct(editing.id, formData);
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản phẩm ({products.length})</h2>
                <button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Thêm sản phẩm
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ảnh</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Giá</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nổi bật</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td className="px-4 py-3">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} className="h-12 w-16 object-cover rounded" />
                                    ) : (
                                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{p.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.category}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.priceDisplay || "Liên hệ"}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleToggleFeatured(p)}
                                        title={p.featured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                                        className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-colors ${p.featured
                                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400'
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                        }`}
                                    >
                                        <Star size={14} className={p.featured ? 'fill-yellow-500' : ''} />
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => setEditing(p)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800 dark:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Chưa có sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {(editing || creating) && (
                <ProductForm
                    initial={editing || emptyProduct}
                    onCancel={closeForm}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

const ProductForm = ({ initial, onCancel, onSave }) => {
    const [form, setForm] = useState({
        ...emptyProduct,
        ...initial,
        specsText: (initial.specs || []).map((s) => `${s.label}: ${s.value}`).join('\n'),
        featuresText: (initial.features || []).join('\n'),
        galleryText: (initial.gallery || []).join('\n'),
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const specs = form.specsText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const idx = line.indexOf(':');
                return idx === -1 ? { label: line, value: '' } : { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
            });
        const features = form.featuresText.split('\n').map((l) => l.trim()).filter(Boolean);
        const gallery = form.galleryText.split('\n').map((l) => l.trim()).filter(Boolean);

        await onSave({
            name: form.name,
            slug: form.slug,
            category: form.category,
            price: form.price,
            image: form.image || gallery[0] || '',
            description: form.description,
            gallery,
            specs,
            features,
            featured: !!form.featured,
            sourceUrl: form.sourceUrl || '',
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {initial.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Field label="Tên sản phẩm *">
                        <input name="name" required value={form.name} onChange={handleChange} className={inputClass} />
                    </Field>
                    <Field label="Slug (để trống để tự sinh)">
                        <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Danh mục">
                            <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="xe-khach, xe-van, xe-bus, xe-tai, xe-dien" />
                        </Field>
                        <Field label="Giá">
                            <input name="price" value={form.price} onChange={handleChange} className={inputClass} />
                        </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            checked={!!form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        Nổi bật (hiển thị ở mục "Dòng Xe Nổi Bật" trên trang chủ)
                    </label>

                    <ImageUpload
                        label="Ảnh đại diện"
                        value={form.image}
                        onChange={(path) => setForm({ ...form, image: path })}
                        category="products"
                        inputClassName={inputClass}
                    />
                    <Field label="Mô tả">
                        <textarea name="description" rows={3} value={form.description} onChange={handleChange} className={inputClass} />
                    </Field>
                    <GalleryUpload
                        label="Thư viện ảnh"
                        value={form.galleryText}
                        onChange={(text) => setForm({ ...form, galleryText: text })}
                        category="products"
                        textAreaClassName={inputClass}
                    />
                    <Field label="Thông số kỹ thuật (mỗi dòng: Nhãn: Giá trị)">
                        <textarea name="specsText" rows={5} value={form.specsText} onChange={handleChange} className={`${inputClass} font-mono text-xs`} />
                    </Field>
                    <Field label="Tính năng nổi bật (mỗi dòng 1 tính năng)">
                        <textarea name="featuresText" rows={4} value={form.featuresText} onChange={handleChange} className={inputClass} />
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

export default AdminProducts;
