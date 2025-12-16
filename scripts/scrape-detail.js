import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://kimlongmiennam.com.vn';
const IMAGES_DIR = path.join(__dirname, '../public/images/products');

// Đọc dữ liệu đã scrape
const scrapedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/scraped-data.json'), 'utf8')
);

// Mapping sản phẩm với URL từ website gốc
const productUrlMap = {
    'KIMLONG 99 24 PHÒNG': '/xe-khach-giuong-nam/kimlong-99-24-phong/',
    'KIMLONG 99 34 PHÒNG MÁY WEICHAI': '/xe-khach-giuong-nam/kimlong-99-34-phong-may-weichai/',
    'KIMLONG 99 34 PHÒNG MÁY YUCHAI': '/xe-khach-giuong-nam/kimlong-99-34-phong-may-yuchai/',
    'KIMLONG 47 Ghế': '/xe-khach-ghe-ngoi/kimlong-47-ghe/',
    'KIMLONG 29 Ghế': '/xe-khach-ghe-ngoi/kimlong-29-ghe/',
    'KIMLONG X9 (16 chỗ)': '/xe-khach-16-cho/kimlong-x9-16-cho/',
    'KIMLONG X9 10 CHỖ LIMOUSIN': '/xe-khach-limousine/kimlong-x9-10-cho-limousin/',
    'KIMLONG 29 Ghế LIMOUSIN': '/xe-khach-limousine/kimlong-29-ghe-limousin/',
};

// Sử dụng dữ liệu từ products.js hiện có để merge
const existingProducts = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/products.js'), 'utf8')
        .replace(/export const products = /, '')
        .replace(/export const productCategories = /, '')
        .replace(/;/g, '')
);

async function enhanceScrapedData() {
    console.log('🔄 Enhancing scraped data with existing product details...');
    
    // Merge dữ liệu đã scrape với dữ liệu hiện có
    const enhancedProducts = scrapedData.products.map(scrapedProduct => {
        // Tìm sản phẩm tương ứng trong dữ liệu hiện có
        const existing = scrapedData.products.find(p => 
            p.name.toLowerCase() === scrapedProduct.name.toLowerCase()
        );
        
        // Nếu có dữ liệu từ file products.js, merge vào
        const existingProductData = {
            description: scrapedProduct.description || '',
            specs: scrapedProduct.specs || [],
            features: scrapedProduct.features || [],
            tags: scrapedProduct.tags || [],
        };
        
        return {
            ...scrapedProduct,
            ...existingProductData,
            // Giữ ảnh đã tải về local
            image: scrapedProduct.image || '',
            gallery: scrapedProduct.gallery || [],
        };
    });
    
    // Merge với dữ liệu từ products.js nếu có
    const finalProducts = enhancedProducts.map(product => {
        // Tìm trong products.js hiện có
        const match = require('../src/data/products.js');
        // Sẽ merge sau
        return product;
    });
    
    return {
        ...scrapedData,
        products: enhancedProducts
    };
}

// Chạy enhance
const enhanced = await enhanceScrapedData();
fs.writeFileSync(
    path.join(__dirname, '../src/data/scraped-data.json'),
    JSON.stringify(enhanced, null, 2)
);

console.log('✅ Data enhanced!');

