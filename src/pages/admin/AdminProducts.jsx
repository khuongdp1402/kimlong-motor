import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, setProductFeatured } from '../../api/client';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import ImageUpload from '../../components/admin/ImageUpload';
import GalleryUpload from '../../components/admin/GalleryUpload';
import { landingCategories, getLandingCategoryName, isLandingCategory } from '../../data/landingCategories';
import VisibilityToggle from '../../components/admin/VisibilityToggle';
import ListToolbar from '../../components/admin/ListToolbar';
import { filterItems } from '../../components/admin/listFilters';
import RichTextEditor from '../../components/admin/RichTextEditor';

const ROLLING_COST_TEMPLATE = `<table>
  <thead>
    <tr>
      <th>Khoản mục chi phí</th>
      <th>Mức phí tạm tính</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Giá niêm yết xe</td>
      <td>Theo giá niêm yết nhà máy</td>
    </tr>
    <tr>
      <td>Thuế trước bạ (2%)</td>
      <td>Tạm tính theo hóa đơn xe</td>
    </tr>
    <tr>
      <td>Bảo hiểm vật chất xe (1.5%)</td>
      <td>Tùy chọn gói bảo hiểm toàn diện</td>
    </tr>
    <tr>
      <td>Phí đăng ký biển số</td>
      <td>500.000 ₫</td>
    </tr>
    <tr>
      <td>Phí sử dụng đường bộ (1 năm)</td>
      <td>1.560.000 ₫</td>
    </tr>
    <tr>
      <td>Phí đăng kiểm</td>
      <td>340.000 ₫</td>
    </tr>
    <tr>
      <td>Bảo hiểm trách nhiệm dân sự</td>
      <td>480.000 ₫</td>
    </tr>
    <tr>
      <td>Chi phí dịch vụ đăng ký xe</td>
      <td>1.000.000 ₫</td>
    </tr>
  </tbody>
</table>
<p><em>* Lưu ý: Giá lăn bánh thực tế có thể thay đổi tùy thuộc vào địa phương đăng ký và chính sách ưu đãi tại từng thời điểm.</em></p>`;

// Accepts what an editor actually types — "2960000000", "2.960.000.000",
// "2,96 tỷ" — and only reformats when it is unambiguously a number. Anything
// else (notably "Liên hệ") is passed through untouched.
function formatPrice(raw) {
    const value = String(raw ?? '').trim();
    if (!value) return '';
    const digits = value.replace(/[.,\s]/g, '');
    if (!/^\d+$/.test(digits)) return value;
    return `${Number(digits).toLocaleString('vi-VN')} đ`;
}

const emptyProduct = {
    name: '',
    slug: '',
    category: '',
    price: 'Liên hệ',
    image: '',
    description: '',
    descriptionHtml: '',
    rollingCostHtml: '',
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
    const [search, setSearch] = useState('');
    const [visibility, setVisibility] = useState('all');

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

    const visibleCount = products.filter((p) => p.featured).length;
    const shown = filterItems(products, { search, visibility });

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản phẩm ({products.length})</h2>
                <button
                    onClick={() => setCreating(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Thêm sản phẩm
                </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <strong className="text-gray-700 dark:text-gray-200">{visibleCount}</strong> sản phẩm đang hiển thị trên trang chủ.
                Chỉ những sản phẩm bật &ldquo;Hiển thị&rdquo; mới xuất hiện ở mục Danh Mục Sản Phẩm.
            </p>

            <ListToolbar
                search={search}
                onSearch={setSearch}
                visibility={visibility}
                onVisibility={setVisibility}
                counts={{ visible: visibleCount, hidden: products.length - visibleCount }}
                searchPlaceholder="Tìm theo tên sản phẩm..."
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ảnh</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tên</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Danh mục</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Giá</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trang chủ</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {shown.map((p) => (
                            <tr key={p.id}>
                                <td className="px-4 py-3">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} className="h-12 w-16 object-cover rounded" />
                                    ) : (
                                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{p.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{getLandingCategoryName(p.category)}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.priceDisplay || "Liên hệ"}</td>
                                <td className="px-4 py-3 text-center">
                                    <VisibilityToggle visible={!!p.featured} onToggle={() => handleToggleFeatured(p)} />
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
                        {shown.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {products.length === 0 ? 'Chưa có sản phẩm nào.' : 'Không có sản phẩm nào khớp bộ lọc.'}
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
        description: initial.descriptionHtml || initial.description || '',
        descriptionHtml: initial.descriptionHtml || initial.description || '',
        rollingCostHtml: initial.rollingCostHtml || initial.rollingCost || '',
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
            // The catalogue carries both a raw price and a formatted one, and
            // the list and detail pages read the formatted field. Deriving it
            // here is what stops an edited price from displaying as the old
            // one everywhere outside this form.
            priceDisplay: formatPrice(form.price),
            image: form.image || gallery[0] || '',
            description: form.description,
            descriptionHtml: form.descriptionHtml || form.description,
            rollingCostHtml: form.rollingCostHtml || '',
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                        <Field label="Danh mục *">
                            <select name="category" required value={form.category} onChange={handleChange} className={inputClass}>
                                <option value="">-- Chọn danh mục --</option>
                                {landingCategories.map((c) => (
                                    <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                                {/* A product still on an old slug would otherwise show a blank
                                    select, and saving would silently re-tag it to whatever the
                                    editor happened to pick. Surfacing the real value makes the
                                    change deliberate. */}
                                {form.category && !isLandingCategory(form.category) && (
                                    <option value={form.category}>
                                        {`⚠ Chưa phân loại (${form.category})`}
                                    </option>
                                )}
                            </select>
                        </Field>
                        <Field label="Giá (chỉ nhập số)">
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
                        Hiển thị sản phẩm này trên trang chủ
                    </label>

                    <ImageUpload
                        label="Ảnh đại diện"
                        value={form.image}
                        onChange={(path) => setForm({ ...form, image: path })}
                        category="products"
                        inputClassName={inputClass}
                    />

                    <Field label="Mô tả & Thông tin chi tiết (Soạn thảo định dạng)">
                        <RichTextEditor
                            value={form.descriptionHtml || form.description}
                            onChange={(html) => setForm((prev) => ({ ...prev, description: html, descriptionHtml: html }))}
                            placeholder="Nhập bài viết mô tả chi tiết, trang bị, động cơ, đánh giá xe..."
                            minHeight="220px"
                        />
                    </Field>

                    <Field label="Chi phí lăn bánh (Mục riêng hiển thị dưới Mô Tả & TTCT)">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 flex flex-wrap items-center justify-between gap-1">
                            <span>Tách riêng 1 ô soạn thảo định dạng bảng tính / chi phí lăn bánh cho xe.</span>
                            <span className="text-red-600 dark:text-red-400 font-medium">Bấm &quot;Chèn mẫu bảng dự toán&quot; để tạo nhanh</span>
                        </div>
                        <RichTextEditor
                            value={form.rollingCostHtml}
                            onChange={(html) => setForm((prev) => ({ ...prev, rollingCostHtml: html }))}
                            placeholder="Nhập bảng chi phí lăn bánh, mức thuế trước bạ, phí biển số, bảo hiểm..."
                            minHeight="180px"
                            templateButtonLabel="Chèn mẫu bảng dự toán"
                            templateHtml={ROLLING_COST_TEMPLATE}
                        />
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
