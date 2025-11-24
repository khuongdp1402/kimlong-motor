import React from 'react';

const products = [
    {
        id: 1,
        name: 'Xe Bus Kim Long 29 Chỗ',
        category: 'Xe Bus',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
    },
    {
        id: 2,
        name: 'Xe Tải Kim Long 9 Tấn',
        category: 'Xe Tải',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1586191582118-ed916f7e4e40?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 3,
        name: 'Xe Mini Bus 16 Chỗ',
        category: 'Mini Bus',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop',
    },
    {
        id: 4,
        name: 'Xe Tải Nặng Kim Long',
        category: 'Xe Tải',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1605218427360-36390f855a29?q=80&w=1974&auto=format&fit=crop',
    },
];

const ProductList = () => {
    return (
        <div id="products" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl uppercase">
                        Sản phẩm nổi bật
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Các dòng xe chất lượng cao đáp ứng mọi nhu cầu vận tải.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <div key={product.id} className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="relative w-full h-64 bg-gray-200 group-hover:opacity-75 sm:h-56">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover center"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-red-600 font-medium mb-1">
                                    {product.category}
                                </p>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    <a href="#">
                                        <span className="absolute inset-0" />
                                        {product.name}
                                    </a>
                                </h3>
                                <p className="text-base font-semibold text-gray-900">
                                    Giá: {product.price}
                                </p>
                                <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
