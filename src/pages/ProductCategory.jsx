import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCategoryBySlug, productCategories } from '../data/categories';
import { useApiData } from '../hooks/useApiData';
import { getProducts } from '../api/client';
import Navbar from '../components/Navbar';
import PageHero from '../components/PageHero';
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
        <div className="min-h-screen bg-noir-950">
            <Navbar />

            <PageHero
                eyebrow="Sản phẩm"
                title={category ? category.name : 'Tất cả dòng xe'}
                description={category ? category.description : 'Toàn bộ dòng xe thương mại Kim Long Motor phân phối chính hãng.'}
                image={HERO_IMAGE}
                crumbs={[{ label: 'Sản phẩm', to: '/category/all' }, { label: category ? category.name : 'Tất cả' }]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Category quick-switch pills */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {productCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${slug === cat.slug ? 'bg-accent text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'}`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categoryProducts.map((product) => (
                            <article
                                key={product.id}
                                onClick={() => navigate(`/product/${product.slug || product.id}`)}
                                className="group cursor-pointer rounded-[22px] bg-graphite-800 border border-line overflow-hidden flex flex-col transition-colors hover:border-ink/20"
                            >
                                <div className="relative p-3 bg-[radial-gradient(ellipse_at_50%_70%,var(--color-graphite-700)_0%,var(--color-graphite-800)_70%)]">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-graphite-700">
                                        {product.image && (
                                            <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        )}
                                    </div>
                                    {product.badges?.[0] && (
                                        <span className="absolute top-6 left-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            {product.badges[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="px-5 pb-5 pt-3 flex-1 flex flex-col">
                                    <h3 className="text-base font-bold text-ink leading-snug line-clamp-2">{product.name}</h3>
                                    <dl className="mt-3 text-xs sm:text-[13px]">
                                        {(product.highlights || []).slice(0, 3).map((s) => (
                                            <div key={s.label} className="flex justify-between gap-3 py-2 border-t border-line">
                                                <dt className="text-ink-muted shrink-0">{s.label}</dt>
                                                <dd className="text-ink text-right truncate">{s.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                                        <span className="text-sm text-ink-muted truncate">{product.priceDisplay || 'Liên hệ'}</span>
                                        <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">Chi tiết →</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {!loading && categoryProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy sản phẩm nào trong danh mục này.</p>
                    </div>
                )}

                {/* CTA banner */}
                <div className="mt-14 rounded-[24px] p-10 text-center border border-line bg-graphite-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bạn muốn nhận giá tốt hơn?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-5">
                        Để lại thông tin, đội ngũ tư vấn Kim Long Motor sẽ liên hệ gửi báo giá ưu đãi nhất.
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
