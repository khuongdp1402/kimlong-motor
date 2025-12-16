import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../public/images/products');

// Mapping sản phẩm với URL ảnh chính xác từ website
const productImages = {
    'KIMLONG 99 24 PHÒNG': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-1.jpg',
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-2.jpg',
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-kim-long-99-24-phong-3.jpg',
    ],
    'KIMLONG 99 34 PHÒNG MÁY WEICHAI': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-weichai.jpg',
    ],
    'KIMLONG 99 34 PHÒNG MÁY YUCHAI': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-giuong-nam-34-phong-yuchai.jpg',
    ],
    'KIMLONG 47 Ghế': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-ghe-ngoi-kim-long-47.jpg',
    ],
    'KIMLONG 29 Ghế': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-ghe-kim-long.jpg',
    ],
    'KIMLONG X9 (16 chỗ)': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-16-cho-kim-long-x9.jpg',
    ],
    'KIMLONG X9 10 CHỖ LIMOUSIN': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-limousine-kim-long.jpg',
    ],
    'KIMLONG 29 Ghế LIMOUSIN': [
        'https://kimlongmiennam.com.vn/wp-content/uploads/2024/05/xe-khach-29-limousine.jpg',
    ],
};

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlink(filepath, () => {});
                return downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => {});
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✓ ${path.basename(filepath)}`);
                resolve();
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

async function downloadAllImages() {
    console.log('📥 Downloading product images...\n');
    
    const results = {};
    
    for (const [productName, urls] of Object.entries(productImages)) {
        const productSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const localImages = [];
        
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const filename = `${productSlug}-${i === 0 ? 'main' : i}.jpg`;
            const filepath = path.join(IMAGES_DIR, filename);
            
            try {
                await downloadImage(url, filepath);
                localImages.push(`/images/products/${filename}`);
                // Delay để tránh rate limit
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
                console.error(`✗ Failed ${productName} image ${i}: ${err.message}`);
            }
        }
        
        if (localImages.length > 0) {
            results[productName] = {
                image: localImages[0],
                gallery: localImages
            };
        }
    }
    
    // Lưu mapping
    fs.writeFileSync(
        path.join(__dirname, '../src/data/image-mapping.json'),
        JSON.stringify(results, null, 2)
    );
    
    console.log(`\n✅ Downloaded images for ${Object.keys(results).length} products`);
    return results;
}

downloadAllImages().catch(console.error);

