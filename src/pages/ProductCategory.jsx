import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, productCategories, getProductsByCategory, getCategoryBySlug } from '../data/products-updated';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductCategory = () => {
    const { slug } = useParams();
    const [sortBy, setSortBy] = useState('default');

    const category = slug === 'all' ? null : getCategoryBySlug(slug);
    const categoryProducts = slug === 'all' ? products : getProductsByCategory(category?.id);

    const sortedProducts = [...categoryProducts].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <div className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                                        {category ? category.name : 'Tất cả sản phẩm'}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {category ? category.name : 'Tất Cả Sản Phẩm'}
                        </h1>
                        {category && (
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Hiển thị {sortedProducts.length} sản phẩm
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm text-gray-700 dark:text-gray-300">Sắp xếp:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                            >
                                <option value="default">Mặc định</option>
                                <option value="name">Tên A-Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map((product) => (
                            <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="relative h-56 bg-gray-200 dark:bg-gray-700">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:opacity-90"
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
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
                                        <Link to={`/product/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                                            {product.price}
                                        </span>
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="bg-gray-900 dark:bg-red-700 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm"
                                        >
                                            Chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Không tìm thấy sản phẩm nào.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductCategory;
