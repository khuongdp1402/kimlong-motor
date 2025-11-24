import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const ProductList = () => {
    // Show first 8 products
    const featuredProducts = products.slice(0, 8);

    return (
        <div id="products" className="bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl uppercase">
                        Sản phẩm nổi bật
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Các dòng xe chất lượng cao đáp ứng mọi nhu cầu vận tải.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 group-hover:opacity-90 sm:h-56">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=' + product.name;
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {product.category === 'giuong-nam' ? 'Giường nằm' :
                                        product.category === 'ghe-ngoi' ? 'Ghế ngồi' :
                                            product.category === '16-cho' ? '16 chỗ' : 'Limousine'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                    <Link to={`/product/${product.id}`}>
                                        <span className="absolute inset-0" />
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                                <p className="text-base font-semibold text-red-600 dark:text-red-400 mb-4">
                                    Giá: {product.price}
                                </p>
                                <Link
                                    to={`/product/${product.id}`}
                                    className="block w-full bg-gray-900 dark:bg-red-700 text-white text-center py-2 px-4 rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to="/category/all"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 transition-colors"
                    >
                        Xem tất cả sản phẩm
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
