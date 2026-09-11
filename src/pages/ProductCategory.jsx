import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCategoryBySlug, productCategories } from '../data/categories';
import { useApiData } from '../hooks/useApiData';
import { getProducts } from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';

const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

// Real showroom building photo reused as the category hero background —
// same image already used elsewhere in the scraped site content (about page).
const HERO_IMAGE = '/images/about/about-1-page_1784600468_998950b3_medium.webp';

const ProductCategory = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: products, loading } = useApiData(getProducts, []);

    const category = slug === 'all' ? null : getCategoryBySlug(slug);
    const allProducts = products || [];
    const categoryProducts = slug === 'all' ? allProducts : allProducts.filter((p) => p.category === category?.id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            {/* Hero */}
            <section className="relative h-72 md:h-96 overflow-hidden">
                <img src={HERO_IMAGE} alt={category ? category.name : 'Sản phẩm'} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
                    <p className="text-sm uppercase tracking-widest text-gray-200 mb-2">Miền Nam Auto</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-3">
                        {category ? category.name : 'Tất Cả Sản Phẩm'}
                    </h1>
                    <p className="text-gray-200 max-w-2xl">
                        {category ? category.description : 'Toàn bộ dòng xe thương mại Kim Long do Kim Long Miền Nam phân phối chính hãng.'}
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-red-600 dark:hover:text-red-400">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span>Sản phẩm</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{category ? category.name : 'Tất cả'}</span>
                </nav>

                {/* Category quick-switch pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {productCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${slug === cat.slug ? 'bg-red-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hiển thị {categoryProducts.length} sản phẩm</p>
                </div>

                {loading && <div className="text-center py-16 text-gray-500 dark:text-gray-400">Đang tải sản phẩm...</div>}

                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-100 dark:border-gray-700"
                                onClick={() => navigate(`/product/${product.slug || product.id}`)}
                            >
                                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Chưa có ảnh</div>
                                    )}
                                    {product.badges?.[0] && (
                                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
                                            {product.badges[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
                                    {(product.highlights || []).slice(0, 3).length > 0 && (
                                        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                                            {(product.highlights || []).slice(0, 3).map((s, i) => (
                                                <li key={i} className="flex justify-between gap-2">
                                                    <span>{s.label}:</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-right">{s.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                        <span className="text-red-600 dark:text-red-400 font-bold text-sm">{product.priceDisplay || 'Liên hệ'}</span>
                                        <span className="text-red-600 dark:text-red-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">Xem chi tiết →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && categoryProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy sản phẩm nào trong danh mục này.</p>
                    </div>
                )}

                {/* CTA banner */}
                <div className="mt-14 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl p-8 text-center bg-white dark:bg-gray-800 transition-colors duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bạn muốn nhận giá tốt hơn?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-5">
                        Để lại thông tin, đội ngũ tư vấn Kim Long Miền Nam sẽ liên hệ gửi báo giá ưu đãi nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/lien-he"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                        >
                            Nhận báo giá ngay
                        </Link>
                        <a
                            href={`tel:${HOTLINE}`}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 font-semibold hover:bg-red-600 hover:text-white transition-colors"
                        >
                            Hotline: {HOTLINE_DISPLAY}
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
            <FloatingButtons />
        </div>
    );
};

export default ProductCategory;
