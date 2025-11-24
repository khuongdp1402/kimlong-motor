export const productCategories = [
    {
        id: 'giuong-nam',
        name: 'Xe Khách Giường Nằm',
        slug: 'xe-khach-giuong-nam',
        description: 'Xe khách giường nằm cao cấp, phù hợp cho các tuyến đường dài',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
    },
    {
        id: 'ghe-ngoi',
        name: 'Xe Khách Ghế Ngồi',
        slug: 'xe-khach-ghe-ngoi',
        description: 'Xe khách ghế ngồi tiện nghi, phù hợp cho các tuyến trung và ngắn',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
    },
    {
        id: '16-cho',
        name: 'Xe Khách 16 Chỗ',
        slug: 'xe-khach-16-cho',
        description: 'Xe khách 16 chỗ linh hoạt, phù hợp cho dịch vụ đưa đón',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg',
    },
    {
        id: 'limousine',
        name: 'Xe Khách Limousine',
        slug: 'xe-khach-limousine',
        description: 'Xe khách limousine sang trọng, dịch vụ cao cấp',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
    },
];

export const products = [
    {
        id: 1,
        name: 'KIMLONG 99 24 PHÒNG',
        slug: 'kimlong-99-24-phong',
        category: 'giuong-nam',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-2.jpg',
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-3.jpg',
        ],
        description: 'Xe khách giường nằm Kim Long 99 24 phòng là dòng xe cao cấp với thiết kế hiện đại, tiện nghi sang trọng. Phù hợp cho các tuyến đường dài với sức chứa 24 giường nằm.',
        specs: [
            { label: 'Số giường', value: '24 giường' },
            { label: 'Động cơ', value: 'Weichai WP4.1Q160E50' },
            { label: 'Công suất', value: '160 PS' },
            { label: 'Kích thước', value: '12.000 x 2.500 x 3.400 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
            { label: 'Hộp số', value: 'Số tự động' },
        ],
        features: [
            'Ghế giường nằm cao cấp',
            'Hệ thống điều hòa 2 chiều',
            'Màn hình giải trí cá nhân',
            'Wifi miễn phí',
            'Hệ thống âm thanh cao cấp',
            'Camera 360 độ',
        ],
    },
    {
        id: 2,
        name: 'KIMLONG 99 34 PHÒNG MÁY WEICHAI',
        slug: 'kimlong-99-34-phong-may-weichai',
        category: 'giuong-nam',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-weichai.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-weichai.jpg',
        ],
        description: 'Xe khách giường nằm Kim Long 99 34 phòng trang bị động cơ Weichai mạnh mẽ, tiết kiệm nhiên liệu.',
        specs: [
            { label: 'Số giường', value: '34 giường' },
            { label: 'Động cơ', value: 'Weichai WP7.270E50' },
            { label: 'Công suất', value: '270 PS' },
            { label: 'Kích thước', value: '13.700 x 2.500 x 3.500 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
        ],
        features: [
            'Giường nằm cao cấp',
            'Điều hòa trung tâm',
            'Hệ thống giải trí',
            'Cửa sổ kính cường lực',
        ],
    },
    {
        id: 3,
        name: 'KIMLONG 47 Ghế',
        slug: 'kimlong-47-ghe',
        category: 'ghe-ngoi',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
        ],
        description: 'Xe khách ghế ngồi Kim Long 47 chỗ, thiết kế rộng rãi, thoải mái cho hành khách.',
        specs: [
            { label: 'Số ghế', value: '47 + 1' },
            { label: 'Động cơ', value: 'Yuchai YC6L280-50' },
            { label: 'Công suất', value: '280 PS' },
            { label: 'Kích thước', value: '12.000 x 2.500 x 3.300 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
        ],
        features: [
            'Ghế ngồi êm ái',
            'Điều hòa mát lạnh',
            'Hệ thống âm thanh',
            'Cửa sổ lớn thoáng mát',
        ],
    },
    {
        id: 4,
        name: 'KIMLONG 29 Ghế',
        slug: 'kimlong-29-ghe',
        category: 'ghe-ngoi',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-ghe-kim-long.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-ghe-kim-long.jpg',
        ],
        description: 'Xe khách ghế ngồi Kim Long 29 chỗ, phù hợp cho các tuyến đường trung bình.',
        specs: [
            { label: 'Số ghế', value: '29 + 1' },
            { label: 'Động cơ', value: 'Weichai WP4.1Q160E50' },
            { label: 'Công suất', value: '160 PS' },
            { label: 'Kích thước', value: '8.400 x 2.430 x 3.300 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
        ],
        features: [
            'Ghế ngồi cao cấp',
            'Điều hòa 2 chiều',
            'Cửa sổ kính cường lực',
            'Hệ thống âm thanh',
        ],
    },
    {
        id: 5,
        name: 'KIMLONG X9 (16 chỗ)',
        slug: 'kimlong-x9-16-cho',
        category: '16-cho',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg',
        ],
        description: 'Xe khách Kim Long X9 16 chỗ, linh hoạt và tiện lợi cho dịch vụ đưa đón.',
        specs: [
            { label: 'Số ghế', value: '16 + 1' },
            { label: 'Động cơ', value: 'Diesel 2.8L' },
            { label: 'Công suất', value: '130 PS' },
            { label: 'Kích thước', value: '5.995 x 2.100 x 2.750 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 4' },
        ],
        features: [
            'Ghế da cao cấp',
            'Điều hòa mát lạnh',
            'Cửa trượt điện',
            'Camera lùi',
        ],
    },
    {
        id: 6,
        name: 'KIMLONG X9 10 CHỖ LIMOUSIN',
        slug: 'kimlong-x9-10-cho-limousin',
        category: 'limousine',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
        ],
        description: 'Xe khách limousine Kim Long X9 10 chỗ, sang trọng và đẳng cấp.',
        specs: [
            { label: 'Số ghế', value: '10 + 1' },
            { label: 'Động cơ', value: 'Diesel 2.8L' },
            { label: 'Công suất', value: '130 PS' },
            { label: 'Kích thước', value: '5.995 x 2.100 x 2.750 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 4' },
        ],
        features: [
            'Ghế massage cao cấp',
            'Màn hình giải trí cá nhân',
            'Tủ lạnh mini',
            'Đèn LED RGB',
            'Wifi miễn phí',
            'Hệ thống âm thanh Bose',
        ],
    },
    {
        id: 7,
        name: 'KIMLONG 29 Ghế LIMOUSIN',
        slug: 'kimlong-29-ghe-limousin',
        category: 'limousine',
        price: 'Liên hệ',
        image: 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-limousine.jpg',
        gallery: [
            'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-limousine.jpg',
        ],
        description: 'Xe khách limousine Kim Long 29 chỗ, kết hợp giữa sức chứa và đẳng cấp.',
        specs: [
            { label: 'Số ghế', value: '29 + 1' },
            { label: 'Động cơ', value: 'Weichai WP4.1Q160E50' },
            { label: 'Công suất', value: '160 PS' },
            { label: 'Kích thước', value: '8.400 x 2.430 x 3.300 mm' },
            { label: 'Tiêu chuẩn khí thải', value: 'Euro 5' },
        ],
        features: [
            'Ghế da cao cấp',
            'Màn hình giải trí',
            'Điều hòa 2 chiều',
            'Đèn LED',
            'Hệ thống âm thanh cao cấp',
        ],
    },
];

export const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
};

export const getProductBySlug = (slug) => {
    return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category === categoryId);
};

export const getCategoryBySlug = (slug) => {
    return productCategories.find(c => c.slug === slug);
};
