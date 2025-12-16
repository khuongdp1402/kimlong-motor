import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://kimlongmiennam.com.vn';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const PRODUCTS_IMAGES_DIR = path.join(IMAGES_DIR, 'products');
const CATEGORIES_IMAGES_DIR = path.join(IMAGES_DIR, 'categories');
const NEWS_IMAGES_DIR = path.join(IMAGES_DIR, 'news');
const BANNERS_IMAGES_DIR = path.join(IMAGES_DIR, 'banners');

// Tạo thư mục nếu chưa có
[IMAGES_DIR, PRODUCTS_IMAGES_DIR, CATEGORIES_IMAGES_DIR, NEWS_IMAGES_DIR, BANNERS_IMAGES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Tải ảnh về local
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if (!url || !url.startsWith('http')) {
            reject(new Error('Invalid URL'));
            return;
        }

        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);

        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return downloadImage(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            }
            if (response.statusCode !== 200) {
                fs.unlink(filepath, () => { });
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✓ Downloaded: ${path.basename(filepath)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Lấy tên file từ URL
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

async function scrapeWebsite() {
    console.log('🚀 Starting scraping...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    try {
        console.log('📄 Loading homepage...');
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);

        // Wait for content to load
        try {
            await page.waitForSelector('body', { timeout: 10000 });
        } catch (e) {
            console.log('⚠️ Body selector timeout, continuing...');
        }

        // Scrape categories
        console.log('📂 Scraping categories...');
        const categories = await page.evaluate(() => {
            const cats = [];
            const navLinks = document.querySelectorAll('nav a, header a, .menu a');

            const categoryMap = {
                'xe-khach-giuong-nam': { id: 'giuong-nam', name: 'Xe Khách Giường Nằm' },
                'xe-khach-ghe-ngoi': { id: 'ghe-ngoi', name: 'Xe Khách Ghế Ngồi' },
                'xe-khach-16-cho': { id: '16-cho', name: 'Xe Khách 16 Chỗ' },
                'xe-khach-limousine': { id: 'limousine', name: 'Xe Khách Limousine' },
            };

            navLinks.forEach(link => {
                const href = link.getAttribute('href') || '';
                const text = link.textContent.trim();

                Object.keys(categoryMap).forEach(slug => {
                    if (href.includes(slug) || text.toLowerCase().includes(slug.replace(/-/g, ' '))) {
                        const cat = categoryMap[slug];
                        if (!cats.find(c => c.id === cat.id)) {
                            cats.push({
                                ...cat,
                                slug: slug,
                                description: '',
                                image: ''
                            });
                        }
                    }
                });
            });

            return cats;
        });

        // Scrape products từ homepage - tìm tất cả text chứa tên sản phẩm
        console.log('🛍️ Scraping products from homepage...');
        const allProducts = await page.evaluate((cats) => {
            const products = [];
            const productNames = [
                'KIMLONG 99 24 PHÒNG',
                'KIMLONG 99 34 PHÒNG MÁY WEICHAI',
                'KIMLONG 99 34 PHÒNG MÁY YUCHAI',
                'KIMLONG 47 Ghế',
                'KIMLONG 29 Ghế',
                'KIMLONG X9 (16 chỗ)',
                'KIMLONG X9 10 CHỖ LIMOUSIN',
                'KIMLONG 29 Ghế LIMOUSIN'
            ];

            // Tìm tất cả elements chứa tên sản phẩm
            productNames.forEach((productName, idx) => {
                const nameLower = productName.toLowerCase();
                const allElements = document.querySelectorAll('*');

                allElements.forEach(el => {
                    const text = el.textContent || '';
                    if (text.includes(productName) || text.toLowerCase().includes(nameLower)) {
                        // Tìm parent container
                        let container = el;
                        for (let i = 0; i < 5; i++) {
                            container = container.parentElement;
                            if (!container) break;

                            const img = container.querySelector('img');
                            const priceText = container.textContent.match(/Giá bán[:\s]*([^\n]*)/i);

                            if (img || priceText) {
                                const image = img ? (img.src || img.getAttribute('data-src') || '') : '';
                                const price = priceText ? priceText[1].trim() : 'Liên hệ';

                                // Xác định category
                                let categoryId = 'giuong-nam';
                                if (productName.includes('Ghế') || productName.includes('ghe')) {
                                    categoryId = productName.includes('LIMOUSIN') ? 'limousine' : 'ghe-ngoi';
                                } else if (productName.includes('16') || productName.includes('X9')) {
                                    categoryId = productName.includes('LIMOUSIN') ? 'limousine' : '16-cho';
                                } else if (productName.includes('LIMOUSIN')) {
                                    categoryId = 'limousine';
                                }

                                // Kiểm tra xem đã có chưa
                                if (!products.find(p => p.name === productName)) {
                                    products.push({
                                        id: Date.now() + idx * 1000,
                                        name: productName,
                                        slug: productName.toLowerCase()
                                            .replace(/[^a-z0-9]+/g, '-')
                                            .replace(/^-+|-+$/g, ''),
                                        category: categoryId,
                                        price: price || 'Liên hệ',
                                        image: image,
                                        description: '',
                                        gallery: image ? [image] : [],
                                        specs: [],
                                        features: []
                                    });
                                }
                                break;
                            }
                        }
                    }
                });
            });

            return products;
        }, categories);

        // Loại bỏ duplicate products
        const uniqueProducts = [];
        const seenNames = new Set();
        allProducts.forEach(product => {
            if (!seenNames.has(product.name)) {
                seenNames.add(product.name);
                uniqueProducts.push(product);
            }
        });

        console.log(`📦 Found ${uniqueProducts.length} unique products`);

        // Tải ảnh sản phẩm
        console.log('📥 Downloading product images...');
        for (let i = 0; i < uniqueProducts.length; i++) {
            const product = uniqueProducts[i];
            if (product.image && product.image.startsWith('http')) {
                try {
                    const filename = getFilenameFromUrl(product.image, `product-${product.id}`);
                    const filepath = path.join(PRODUCTS_IMAGES_DIR, filename);
                    await downloadImage(product.image, filepath);
                    product.image = `/images/products/${filename}`;

                    // Tải gallery images
                    if (product.gallery && product.gallery.length > 0) {
                        const galleryPaths = [];
                        for (const galleryImg of product.gallery) {
                            if (galleryImg.startsWith('http')) {
                                try {
                                    const galleryFilename = getFilenameFromUrl(galleryImg, `gallery-${product.id}-${galleryPaths.length}`);
                                    const galleryFilepath = path.join(PRODUCTS_IMAGES_DIR, galleryFilename);
                                    await downloadImage(galleryImg, galleryFilepath);
                                    galleryPaths.push(`/images/products/${galleryFilename}`);
                                } catch (err) {
                                    console.error(`Failed to download gallery image: ${err.message}`);
                                }
                            }
                        }
                        product.gallery = galleryPaths;
                    }
                } catch (err) {
                    console.error(`Failed to download image for ${product.name}: ${err.message}`);
                    product.image = ''; // Fallback to empty if download fails
                }
            }
        }

        // Tải ảnh categories
        console.log('📥 Downloading category images...');
        for (const category of categories) {
            if (category.image && category.image.startsWith('http')) {
                try {
                    const filename = getFilenameFromUrl(category.image, `category-${category.id}`);
                    const filepath = path.join(CATEGORIES_IMAGES_DIR, filename);
                    await downloadImage(category.image, filepath);
                    category.image = `/images/categories/${filename}`;
                } catch (err) {
                    console.error(`Failed to download category image: ${err.message}`);
                }
            }
        }

        // Scrape news/articles
        console.log('📰 Scraping news articles...');
        const news = await page.evaluate(() => {
            const articles = [];
            const newsElements = document.querySelectorAll('article, .news-item, [class*="news"], [class*="post"]');

            newsElements.forEach((el, index) => {
                try {
                    const titleEl = el.querySelector('h2, h3, h4, .title, [class*="title"]');
                    const imgEl = el.querySelector('img');
                    const descEl = el.querySelector('p, .excerpt, [class*="excerpt"]');
                    const dateEl = el.querySelector('.date, [class*="date"], time');
                    const linkEl = el.querySelector('a');

                    if (titleEl) {
                        const title = titleEl.textContent.trim();
                        const image = imgEl ? imgEl.src || imgEl.getAttribute('data-src') || '' : '';
                        const excerpt = descEl ? descEl.textContent.trim().substring(0, 150) : '';
                        const date = dateEl ? dateEl.textContent.trim() : new Date().toISOString().split('T')[0];
                        const slug = title.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '');

                        articles.push({
                            id: Date.now() + index,
                            title: title,
                            slug: slug,
                            category: 'tin-tuc',
                            image: image,
                            excerpt: excerpt,
                            content: `<p>${excerpt}</p>`,
                            author: 'Kim Long Motor',
                            date: date,
                            featured: index < 3
                        });
                    }
                } catch (err) {
                    console.error('Error parsing news item:', err);
                }
            });

            return articles;
        });

        // Tải ảnh news
        console.log('📥 Downloading news images...');
        for (const article of news) {
            if (article.image && article.image.startsWith('http')) {
                try {
                    const filename = getFilenameFromUrl(article.image, `news-${article.id}`);
                    const filepath = path.join(NEWS_IMAGES_DIR, filename);
                    await downloadImage(article.image, filepath);
                    article.image = `/images/news/${filename}`;
                } catch (err) {
                    console.error(`Failed to download news image: ${err.message}`);
                }
            }
        }


        // Scrape banners
        console.log('🖼️ Scraping banners...');
        const banners = await page.evaluate(() => {
            const bannerImgs = [];
            // Try common slider selectors
            const sliderImages = document.querySelectorAll('.rev_slider img, .swiper-slide img, .slider-item img, [id*="slider"] img, .banner img');

            sliderImages.forEach((img, index) => {
                const src = img.src || img.getAttribute('data-src') || '';
                if (src && src.length > 0 && !src.includes('logo') && !src.includes('icon')) {
                    // Check natural width to ensure it's high quality/large enough for a banner
                    if (img.naturalWidth > 800 || (img.width > 800)) {
                        if (!bannerImgs.find(b => b.image === src)) {
                            bannerImgs.push({
                                id: Date.now() + index,
                                image: src,
                                title: img.alt || 'Banner',
                                subtitle: '',
                                link: '#'
                            });
                        }
                    }
                }
            });
            return bannerImgs.length > 0 ? bannerImgs.slice(0, 5) : []; // Take top 5
        });

        // Tải ảnh banners
        console.log('📥 Downloading banner images...');
        for (const banner of banners) {
            if (banner.image && banner.image.startsWith('http')) {
                try {
                    const filename = getFilenameFromUrl(banner.image, `banner-${banner.id}`);
                    const filepath = path.join(BANNERS_IMAGES_DIR, filename);
                    await downloadImage(banner.image, filepath);
                    banner.image = `/images/banners/${filename}`;
                } catch (err) {
                    console.error(`Failed to download banner image: ${err.message}`);
                }
            }
        }

        // Lưu dữ liệu
        const data = {
            categories: categories,
            products: uniqueProducts,
            news: news,
            banners: banners,
            scrapedAt: new Date().toISOString(),
            source: BASE_URL
        };

        // Lưu JSON
        fs.writeFileSync(
            path.join(__dirname, '../src/data/scraped-data.json'),
            JSON.stringify(data, null, 2),
            'utf8'
        );

        // Lưu JS module
        const jsContent = `// Auto-generated from scraping ${BASE_URL}
// Scraped at: ${new Date().toISOString()}

export const scrapedCategories = ${JSON.stringify(categories, null, 2)};

export const scrapedProducts = ${JSON.stringify(uniqueProducts, null, 2)};

export const scrapedNews = ${JSON.stringify(news, null, 2)};

export const scrapedBanners = ${JSON.stringify(banners, null, 2)};
`;

        fs.writeFileSync(
            path.join(__dirname, '../src/data/scraped-data.js'),
            jsContent,
            'utf8'
        );

        console.log('\n✅ Scraping completed!');
        console.log(`📊 Categories: ${categories.length}`);
        console.log(`📦 Products: ${uniqueProducts.length}`);
        console.log(`📰 News: ${news.length}`);
        console.log(`💾 Data saved to: src/data/scraped-data.json`);

    } catch (error) {
        console.error('❌ Scraping error:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run scraping
scrapeWebsite().catch(console.error);

