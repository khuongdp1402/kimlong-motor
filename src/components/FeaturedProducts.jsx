import React from 'react';
import { useNavigate } from 'react-router-dom';

// Homepage product-grid section: "Dòng Xe Nổi Bật Tháng 8", "Thương Hiệu Kim Long
// Motor", "Kim Long Xe Khách", "Kim Long Xe Tải", "Kim Long Xe Điện" all reuse
// this same card layout (image, name, spec bullets, price, "Xem chi tiết" link) —
// matching the real site's nb-item-card component reused across every section.
const HOTLINE = '0379398798';
const HOTLINE_DISPLAY = '0379.398.798';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const specBullets = (product.highlights || []).slice(0, 4);

    return (
        <div
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col border border-gray-100 dark:border-gray-700"
            onClick={() => navigate(`/product/${product.slug || product.id}`)}
        >
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Chưa có ảnh</div>
                )}
                {product.badges && product.badges[0] && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow">
                        {product.badges[0]}
                    </span>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[2.75rem]">
                    {product.name}
                </h3>
                {specBullets.length > 0 && (
                    <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                        {specBullets.map((s, i) => (
                            <li key={i} className="flex justify-between gap-2">
                                <span>{s.label}:</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium text-right">{s.value}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                        {product.priceDisplay || 'Liên hệ'}
                    </span>
                    <span className="text-red-600 dark:text-red-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        Xem chi tiết →
                    </span>
                </div>
            </div>
        </div>
    );
};

const FeaturedProducts = ({ id, title, subtitle, products, ctaBanner }) => {
    if (!products || products.length === 0) return null;

    return (
        <section id={id} className="py-14 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-3 text-gray-500 dark:text-gray-400">{subtitle}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {ctaBanner && (
                    <div className="mt-10 border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl p-8 text-center bg-white dark:bg-gray-800">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Bạn muốn nhận giá tốt hơn?
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-5">
                            Để lại thông tin, đội ngũ tư vấn Kim Long Miền Nam sẽ liên hệ gửi báo giá ưu đãi nhất.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                            >
                                Nhận báo giá ngay
                            </a>
                            <a
                                href={`tel:${HOTLINE}`}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 font-semibold hover:bg-red-600 hover:text-white transition-colors"
                            >
                                Hotline: {HOTLINE_DISPLAY}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedProducts;
