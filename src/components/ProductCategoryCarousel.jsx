import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Phone } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { productCategories, getProductsByCategory } from '../data/products-updated';
import ContactPopup from './ContactPopup';

const ProductCategoryCarousel = ({ categoryId, category }) => {
    const products = getProductsByCategory(categoryId);
    const categoryInfo = category || productCategories.find(c => c.id === categoryId);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (!products.length || !categoryInfo) return null;

    const handleOpenPopup = (product) => {
        setSelectedProduct(product);
        setPopupOpen(true);
    };

    return (
        <>
            <section id={categoryId} className="py-12 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                            {categoryInfo.name}
                        </h2>
                    </div>

                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={2}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        navigation={true}
                        className="product-carousel"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} onContactClick={() => handleOpenPopup(product)} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <style jsx>{`
                    .product-carousel :global(.swiper-button-next),
                    .product-carousel :global(.swiper-button-prev) {
                        color: #dc2626;
                        background: rgba(255, 255, 255, 0.9);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    }
                    
                    .product-carousel :global(.swiper-button-next):after,
                    .product-carousel :global(.swiper-button-prev):after {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    
                    .dark .product-carousel :global(.swiper-button-next),
                    .dark .product-carousel :global(.swiper-button-prev) {
                        background: rgba(31, 41, 55, 0.9);
                        color: #f87171;
                    }
                    
                    .product-carousel :global(.swiper-button-next:hover),
                    .product-carousel :global(.swiper-button-prev:hover) {
                        background: #dc2626;
                        color: white;
                    }
                    
                    .dark .product-carousel :global(.swiper-button-next:hover),
                    .dark .product-carousel :global(.swiper-button-prev:hover) {
                        background: #f87171;
                        color: white;
                    }
                `}</style>
            </section>
            <ContactPopup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                productName={selectedProduct?.name}
            />
        </>
    );
};

const ProductCard = ({ product, onContactClick }) => {
    const navigate = useNavigate();
    const HOTLINE = '0372803085';

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleContactClick = (e) => {
        e.stopPropagation();
        onContactClick();
    };

    return (
        <div
            className="group relative bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col border border-gray-200 dark:border-gray-600 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-600 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=' + product.name;
                    }}
                />
                {product.tags && product.tags.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {product.tags.map((tag, index) => (
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
                    {product.name}
                </h3>
                <div className="mb-3 h-[3.5rem]">
                    {product.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Giá bán: <span className="text-red-600 dark:text-red-400">{product.price}</span>
                </p>
                <div className="mt-auto">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleContactClick}
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
        </div>
    );
};

export default ProductCategoryCarousel;

