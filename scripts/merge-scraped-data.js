import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc dữ liệu đã scrape
const scrapedData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/scraped-data.json'), 'utf8')
);

// Đọc dữ liệu hiện có từ products.js
const productsFile = fs.readFileSync(path.join(__dirname, '../src/data/products.js'), 'utf8');

// Extract products và categories từ file JS
const extractProducts = (content) => {
    const productsMatch = content.match(/export const products = \[([\s\S]*?)\];/);
    if (!productsMatch) return [];
    
    // Parse products array manually
    const productsStr = productsMatch[1];
    const products = [];
    let currentProduct = null;
    let inObject = false;
    let braceCount = 0;
    let currentStr = '';
    
    // Simple parser - sẽ cần cải thiện
    const lines = productsStr.split('\n');
    let productId = 1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('id:') && line.match(/\d+/)) {
            productId = parseInt(line.match(/\d+/)[0]);
        }
    }
    
    // Sử dụng eval để parse (chỉ trong script, không dùng trong production)
    try {
        const productsArray = eval(`[${productsStr}]`);
        return productsArray;
    } catch (e) {
        console.error('Error parsing products:', e);
        return [];
    }
};

// Merge dữ liệu
function mergeData() {
    console.log('🔄 Merging scraped data with existing data...');
    
    // Import products từ file JS
    const existingProducts = [];
    try {
        // Đọc và parse products.js
        const productsContent = fs.readFileSync(
            path.join(__dirname, '../src/data/products.js'),
            'utf8'
        );
        
        // Extract products array bằng regex
        const productsMatch = productsContent.match(/export const products = (\[[\s\S]*?\]);/);
        if (productsMatch) {
            const productsArrayStr = productsMatch[1];
            // Sử dụng Function constructor để parse an toàn hơn
            const productsArray = new Function('return ' + productsArrayStr)();
            existingProducts.push(...productsArray);
        }
    } catch (error) {
        console.error('Error reading existing products:', error);
    }
    
    // Merge scraped products với existing products
    const mergedProducts = scrapedData.products.map(scrapedProduct => {
        // Tìm sản phẩm tương ứng trong dữ liệu hiện có
        const existing = existingProducts.find(p => 
            p.name.toLowerCase() === scrapedProduct.name.toLowerCase() ||
            p.name.replace(/\s+/g, ' ') === scrapedProduct.name.replace(/\s+/g, ' ')
        );
        
        if (existing) {
            // Merge: giữ ảnh đã tải về, lấy thông tin chi tiết từ existing
            return {
                ...existing,
                // Giữ ảnh đã tải về local nếu có
                image: scrapedProduct.image && scrapedProduct.image.startsWith('/images/') 
                    ? scrapedProduct.image 
                    : existing.image,
                gallery: scrapedProduct.gallery && scrapedProduct.gallery.length > 0
                    ? scrapedProduct.gallery
                    : existing.gallery,
                // Giữ ID từ existing để đảm bảo consistency
                id: existing.id,
            };
        }
        
        // Nếu không tìm thấy, dùng scraped data
        return {
            ...scrapedProduct,
            // Thêm thông tin mặc định nếu thiếu
            description: scrapedProduct.description || `Thông tin về ${scrapedProduct.name}`,
            specs: scrapedProduct.specs || [],
            features: scrapedProduct.features || [],
            tags: scrapedProduct.tags || [],
        };
    });
    
    // Merge categories
    const existingCategories = [];
    try {
        const productsContent = fs.readFileSync(
            path.join(__dirname, '../src/data/products.js'),
            'utf8'
        );
        const categoriesMatch = productsContent.match(/export const productCategories = (\[[\s\S]*?\]);/);
        if (categoriesMatch) {
            const categoriesArrayStr = categoriesMatch[1];
            const categoriesArray = new Function('return ' + categoriesArrayStr)();
            existingCategories.push(...categoriesArray);
        }
    } catch (error) {
        console.error('Error reading existing categories:', error);
    }
    
    const mergedCategories = scrapedData.categories.map(scrapedCat => {
        const existing = existingCategories.find(c => c.id === scrapedCat.id);
        return existing ? { ...existing, ...scrapedCat } : scrapedCat;
    });
    
    // Tạo file merged data
    const mergedData = {
        categories: mergedCategories,
        products: mergedProducts,
        news: scrapedData.news || [],
        scrapedAt: scrapedData.scrapedAt,
        source: scrapedData.source
    };
    
    // Lưu JSON
    fs.writeFileSync(
        path.join(__dirname, '../src/data/merged-data.json'),
        JSON.stringify(mergedData, null, 2),
        'utf8'
    );
    
    // Tạo JS module
    const jsContent = `// Auto-generated merged data from scraping
// Scraped at: ${mergedData.scrapedAt}
// Source: ${mergedData.source}

export const mergedCategories = ${JSON.stringify(mergedCategories, null, 2)};

export const mergedProducts = ${JSON.stringify(mergedProducts, null, 2)};

export const mergedNews = ${JSON.stringify(mergedData.news, null, 2)};
`;
    
    fs.writeFileSync(
        path.join(__dirname, '../src/data/merged-data.js'),
        jsContent,
        'utf8'
    );
    
    console.log('✅ Data merged successfully!');
    console.log(`📊 Categories: ${mergedCategories.length}`);
    console.log(`📦 Products: ${mergedProducts.length}`);
    console.log(`📰 News: ${mergedData.news.length}`);
}

mergeData();

