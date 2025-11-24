import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Phone } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'Xe Bus Kim Long 29 Chỗ',
        category: 'Xe Bus',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop',
        description: 'Xe Bus Kim Long 29 chỗ được thiết kế hiện đại, sang trọng, phù hợp cho các tuyến vận tải hành khách đường ngắn và trung bình. Động cơ mạnh mẽ, tiết kiệm nhiên liệu và thân thiện với môi trường.',
        specs: [
            { label: 'Động cơ', value: 'Weichai WP4.1Q160E50' },
            { label: 'Công suất', value: '160 PS' },
            { label: 'Kích thước', value: '8.400 x 2.430 x 3.300 mm' },
            { label: 'Số chỗ ngồi', value: '29 + 1' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
        ]
    },
    {
        id: 2,
        name: 'Xe Tải Kim Long 9 Tấn',
        category: 'Xe Tải',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1586191582118-ed916f7e4e40?q=80&w=2070&auto=format&fit=crop',
        description: 'Xe tải Kim Long 9 tấn là giải pháp vận tải hàng hóa hiệu quả, với thùng hàng rộng rãi, khung gầm chắc chắn và khả năng chịu tải cao.',
        specs: [
            { label: 'Động cơ', value: 'Yuchai YC4E160-48' },
            { label: 'Tải trọng', value: '9.000 kg' },
            { label: 'Kích thước thùng', value: '7.400 x 2.350 x 2.150 mm' },
            { label: 'Lốp xe', value: '10.00R20' },
        ]
    },
    // Add more dummy products as needed to match ProductList
    {
        id: 3,
        name: 'Xe Mini Bus 16 Chỗ',
        category: 'Mini Bus',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop',
        description: 'Mini Bus 16 chỗ tiện nghi, linh hoạt trong đô thị.',
        specs: [
            { label: 'Động cơ', value: 'Diesel 2.8L' },
            { label: 'Công suất', value: '130 PS' },
            { label: 'Số chỗ', value: '16' }
        ]
    },
    {
        id: 4,
        name: 'Xe Tải Nặng Kim Long',
        category: 'Xe Tải',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1605218427360-36390f855a29?q=80&w=1974&auto=format&fit=crop',
        description: 'Xe tải nặng chuyên chở đường dài.',
        specs: [
            { label: 'Động cơ', value: 'Weichai 400HP' },
            { label: 'Tải trọng', value: '15 Tấn' },
        ]
    }
];

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id)) || products[0];

    return (
        <div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/" className="inline-flex items-center text-red-600 hover:text-red-800 mb-8 transition-colors">
                    <ArrowLeft className="mr-2" size={20} /> Quay lại trang chủ
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="h-96 md:h-auto relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-8 md:p-12">
                            <div className="uppercase tracking-wide text-sm text-red-600 font-semibold">{product.category}</div>
                            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                {product.name}
                            </h1>
                            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                                {product.description}
                            </p>

                            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Thông số kỹ thuật</h3>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                    {product.specs.map((spec, index) => (
                                        <div key={index} className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{spec.label}</dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-white font-semibold">{spec.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="mt-10">
                                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-800 md:py-4 md:text-lg md:px-10 transition-colors">
                                    <Phone className="mr-2" /> Liên hệ báo giá
                                </button>
                                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    <Check className="inline-block mr-1 text-green-500" size={16} /> Hỗ trợ vay vốn ngân hàng
                                    <span className="mx-2">|</span>
                                    <Check className="inline-block mr-1 text-green-500" size={16} /> Bảo hành chính hãng
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
