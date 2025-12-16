import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://kimlongmiennam.com.vn';
const IMAGES_DIR = path.join(__dirname, '../public/images/products');

// Mapping sản phẩm với URL ảnh từ website gốc
const productImageMap = {
    'KIMLONG 99 24 PHÒNG': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
    'KIMLONG 99 34 PHÒNG MÁY WEICHAI': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-weichai.jpg',
    'KIMLONG 99 34 PHÒNG MÁY YUCHAI': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-yuchai.jpg',
    'KIMLONG 47 Ghế': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
    'KIMLONG 29 Ghế': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-ghe-kim-long.jpg',
    'KIMLONG X9 (16 chỗ)': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg',
    'KIMLONG X9 10 CHỖ LIMOUSIN': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
    'KIMLONG 29 Ghế LIMOUSIN': 'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-limousine.jpg',
};

// Gallery images
const productGalleryMap = {
    'KIMLONG 99 24 PHÒNG': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-2.jpg',
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-3.jpg',
    ],
};

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if (!url || !url.startsWith('http')) {
            reject(new Error('Invalid URL'));
            return;
        }

        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            }
            if (response.statusCode !== 200) {
                fs.unlink(filepath, () => {});
                reject(new Error(`Failed: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✓ Downloaded: ${path.basename(filepath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

function getFilenameFromUrl(url, prefix = '') {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = path.basename(pathname) || `image-${Date.now()}.jpg`;
        return prefix ? `${prefix}-${filename}` : filename;
    } catch {
        return `image-${Date.now()}.jpg`;
    }
}

async function enhanceProductsWithImages() {
    console.log('🖼️ Downloading correct product images...');
    
    // Đọc merged data
    const mergedData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../src/data/merged-data.json'), 'utf8')
    );
    
    // Đọc products.js hiện có
    const productsContent = fs.readFileSync(
        path.join(__dirname, '../src/data/products.js'),
        'utf8'
    );
    
    // Extract products
    const productsMatch = productsContent.match(/export const products = (\[[\s\S]*?\]);/);
    if (!productsMatch) {
        console.error('Could not extract products from products.js');
        return;
    }
    
    const productsArray = new Function('return ' + productsMatch[1])();
    
    // Cập nhật ảnh cho từng sản phẩm
    const updatedProducts = await Promise.all(
        productsArray.map(async (product) => {
            const imageUrl = productImageMap[product.name] || product.image;
            const galleryUrls = productGalleryMap[product.name] || product.gallery || [];
            
            let localImage = product.image;
            const localGallery = [];
            
            // Tải ảnh chính
            if (imageUrl && imageUrl.startsWith('http')) {
                try {
                    const filename = getFilenameFromUrl(imageUrl, `product-${product.id}`);
                    const filepath = path.join(IMAGES_DIR, filename);
                    await downloadImage(imageUrl, filepath);
                    localImage = `/images/products/${filename}`;
                } catch (err) {
                    console.error(`Failed to download image for ${product.name}:`, err.message);
                }
            }
            
            // Tải gallery images
            for (let i = 0; i < galleryUrls.length; i++) {
                const galleryUrl = galleryUrls[i];
                if (galleryUrl && galleryUrl.startsWith('http')) {
                    try {
                        const filename = getFilenameFromUrl(galleryUrl, `gallery-${product.id}-${i}`);
                        const filepath = path.join(IMAGES_DIR, filename);
                        await downloadImage(galleryUrl, filepath);
                        localGallery.push(`/images/products/${filename}`);
                    } catch (err) {
                        console.error(`Failed to download gallery image ${i} for ${product.name}:`, err.message);
                    }
                }
            }
            
            return {
                ...product,
                image: localImage,
                gallery: localGallery.length > 0 ? localGallery : product.gallery,
            };
        })
    );
    
    // Cập nhật file products.js
    const updatedProductsStr = JSON.stringify(updatedProducts, null, 4)
        .replace(/"/g, "'")
        .replace(/'/g, "'");
    
    const newProductsContent = productsContent.replace(
        /export const products = \[[\s\S]*?\];/,
        `export const products = ${updatedProductsStr};`
    );
    
    fs.writeFileSync(
        path.join(__dirname, '../src/data/products.js'),
        newProductsContent,
        'utf8'
    );
    
    console.log('✅ Products updated with local images!');
}

enhanceProductsWithImages().catch(console.error);

