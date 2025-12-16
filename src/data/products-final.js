// Final products data - merged from scraping and existing data
// Use this file to import products with local images

import { mergedProducts, mergedCategories } from './merged-data.js';

// Export with same structure as products.js
export const productCategories = mergedCategories.map(cat => ({
    ...cat,
    // Use existing category data if available
    description: cat.description || (cat.id === 'giuong-nam' ? 'Xe khách giường nằm cao cấp, phù hợp cho các tuyến đường dài' :
        cat.id === 'ghe-ngoi' ? 'Xe khách ghế ngồi tiện nghi, phù hợp cho các tuyến trung và ngắn' :
        cat.id === '16-cho' ? 'Xe khách 16 chỗ linh hoạt, phù hợp cho dịch vụ đưa đón' :
        'Xe khách limousine sang trọng, dịch vụ cao cấp'),
    image: cat.image || (cat.id === 'giuong-nam' ? 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg' :
        cat.id === 'ghe-ngoi' ? 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg' :
        cat.id === '16-cho' ? 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg' :
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg'),
    tags: cat.tags || []
}));

export const products = mergedProducts;

// Helper functions
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

