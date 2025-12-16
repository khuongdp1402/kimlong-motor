import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ContactPopup from '../components/ContactPopup';
import { getProductById, getCategoryBySlug, getProductsByCategory } from '../data/products-updated';

const ProductDetail = () => {
    const { id } = useParams();
    const product = getProductById(id);
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const HOTLINE = '0372803085';

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Không tìm thấy sản phẩm
                        </h1>
                        <Link
                            to="/"
                            className="inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                            <ArrowLeft className="mr-2" size={20} />
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const category = getCategoryBySlug(product.category);
    const categoryName = category ? category.name : product.category;
    const relatedProducts = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);

    const serviceFeatures = [
        'Tư vấn hồ sơ, thủ tục mua xe, đăng ký trả góp hoàn toàn miễn phí',
        'Tư vấn vận hành, sử dụng xe và cách thức bảo hành, bảo hiểm',
        'Đặt mua trực tiếp: 0911 545 499',
        'Bảo hành - Bảo dưỡng chính hãng',
        'Giao xe tận nhà (Nếu khách có yêu cầu)'
    ];

    const handleOpenPopup = (p) => {
        setSelectedProduct(p);
        setPopupOpen(true);
    };

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                {/* Hero Section */}
                <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/1920x1080?text=' + product.name;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                    </div>
                    
                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
                        <div className="w-full text-white">
                            <div className="text-lg md:text-xl font-medium mb-2 opacity-90">
                                {categoryName}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 uppercase">
                                {product.name}
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 font-semibold">
                                Giá bán: <span className="text-red-500">{product.price}</span>
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a
                                    href="tel:0911545499"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold rounded-lg text-lg transition-colors"
                                >
                                    <Phone className="mr-2" size={24} />
                                    HOTLINE: 0911 545 499
                                </a>
                                <button
                                    onClick={() => {
                                        const contactSection = document.getElementById('contact');
                                        if (contactSection) {
                                            contactSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="inline-flex flex-col items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-bold rounded-lg text-lg transition-colors"
                                >
                                    <span>ĐẶT MUA XE NGAY</span>
                                    <span className="text-sm font-normal mt-1">(Để có giá tốt nhất)</span>
                                </button>
                            </div>

                            {/* Service Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                                {serviceFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <Check className="mr-3 text-green-500 flex-shrink-0 mt-1" size={20} />
                                        <span className="text-white text-sm md:text-base">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Social Media Icons */}
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <Facebook size={24} />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <Twitter size={24} />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                    <Youtube size={24} />
                                </a>
                                <a href="mailto:info@kimlongmotor.com" className="text-gray-300 hover:text-white transition-colors">
                                    <Mail size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Product Gallery */}
                {product.gallery && product.gallery.length > 1 && (
                    <section className="py-10 bg-white dark:bg-gray-900">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hình ảnh sản phẩm</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.gallery.map((image, index) => (
                                    <div key={index} className="relative w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800 aspect-video">
                                        <img
                                            src={image}
                                            alt={`${product.name} - hình ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=' + product.name;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Product Details Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mô tả sản phẩm</h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {product.specs && product.specs.length > 0 && (
                                    <div className="mt-12">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông số kỹ thuật</h2>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {product.specs.map((spec, index) => (
                                                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{spec.label}</dt>
                                                        <dd className="text-base font-semibold text-gray-900 dark:text-white">{spec.value}</dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                    </div>
                                )}

                                {product.features && product.features.length > 0 && (
                                    <div className="mt-12">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tính năng nổi bật</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {product.features.map((feature, index) => (
                                                <div key={index} className="flex items-start bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                    <Check className="mr-3 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-24">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin liên hệ</h3>
                                    <div className="space-y-4">
                                        <a
                                            href="tel:0911545499"
                                            className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            <Phone className="mr-2" size={20} />
                                            HOTLINE: 0911 545 499
                                        </a>
                                        <a
                                            href="mailto:info@kimlongmotor.com"
                                            className="flex items-center justify-center w-full px-6 py-3 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            <Mail className="mr-2" size={20} />
                                            Email liên hệ
                                        </a>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <Check className="inline-block mr-2 text-green-500 dark:text-green-400" size={16} />
                                            Hỗ trợ vay vốn ngân hàng
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <Check className="inline-block mr-2 text-green-500 dark:text-green-400" size={16} />
                                            Bảo hành chính hãng
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="py-16 bg-gray-50 dark:bg-gray-800">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 uppercase">Sản phẩm tương tự</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <div
                                        key={relatedProduct.id}
                                        className="group relative bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col border border-gray-200 dark:border-gray-600 cursor-pointer"
                                        onClick={() => navigate(`/product/${relatedProduct.id}`)}
                                    >
                                        <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=' + relatedProduct.name;
                                                }}
                                            />
                                            {relatedProduct.tags && relatedProduct.tags.length > 0 && (
                                                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                                    {relatedProduct.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-600 text-white shadow-md uppercase tracking-wide"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 h-[3.5rem]">
                                                {relatedProduct.name}
                                            </h3>
                                            <div className="mb-3 h-[3.5rem]">
                                                {relatedProduct.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                        {relatedProduct.description}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                                Giá bán: <span className="text-red-600 dark:text-red-400">{relatedProduct.price}</span>
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenPopup(relatedProduct);
                                                    }}
                                                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-center py-2 px-4 rounded transition-colors text-sm font-medium"
                                                >
                                                    Báo giá ngay
                                                </button>
                                                <a
                                                    href={`tel:${HOTLINE}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-center py-2 px-4 rounded transition-colors text-sm font-medium"
                                                >
                                                    Gọi ngay
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
            <Footer />
            <FloatingButtons />
            <ContactPopup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                productName={selectedProduct?.name}
            />
        </>
    );
};

export default ProductDetail;
