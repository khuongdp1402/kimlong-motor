/**
 * Full scraper for the REAL live Kim Long Miền Nam site.
 *
 * BASE_URL = https://kimlongmiennam.com ("Kim Long Miền Nam / Miền Nam Auto")
 *
 * The site is a server-rendered "nb-" widget CMS (not a heavy SPA) with very
 * consistent markup and clean sitemap files, so Puppeteer is used mainly for
 * convenience/consistency with the previous scraper shape - most pages could
 * be fetched with plain HTTP.
 *
 * Crawls:
 *  - Homepage: hero slider, category tiles (brand accordion), "Vì sao chọn"
 *    cards, "Xưởng dịch vụ" steps, testimonials (Đánh giá khách hàng),
 *    photo/media gallery strip, contact map / showroom list.
 *  - All products (sitemap-products.xml -> /san-pham/:slug) - name, image,
 *    gallery, price, spec highlight bullets, full spec table, description.
 *  - All articles (sitemap-posts.xml -> /bai-viet/:slug) - full body html,
 *    date, category, cover image, gallery.
 *  - Giới thiệu (About) page full text + images.
 *  - Liên hệ (Contact) page: showroom list (name/address/hotline/map embed).
 *  - Footer: company info + policy/product links + hotline + socials (from
 *    the AutoDealer JSON-LD + rendered footer markup).
 *
 * Downloads every real image referenced by the above into
 * public/images/{hero,categories,products,news,testimonials,about,showroom}/
 *
 * Output: server/data/content.json
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://kimlongmiennam.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const DELAY_MS = 800; // pacing between page visits (500-1500ms range)

const IMAGES_DIR = path.join(__dirname, '../public/images');
const DIRS = {
    hero: path.join(IMAGES_DIR, 'hero'),
    categories: path.join(IMAGES_DIR, 'categories'),
    products: path.join(IMAGES_DIR, 'products'),
    news: path.join(IMAGES_DIR, 'news'),
    testimonials: path.join(IMAGES_DIR, 'testimonials'),
    about: path.join(IMAGES_DIR, 'about'),
    showroom: path.join(IMAGES_DIR, 'showroom'),
    gallery: path.join(IMAGES_DIR, 'gallery'),
    service: path.join(IMAGES_DIR, 'service'),
    whyus: path.join(IMAGES_DIR, 'whyus'),
    brand: path.join(IMAGES_DIR, 'brand'),
};

const SERVER_DATA_DIR = path.join(__dirname, '../server/data');

[IMAGES_DIR, SERVER_DATA_DIR, ...Object.values(DIRS)].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        if (!url || !url.startsWith('http')) return reject(new Error('Invalid URL'));
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);
        protocol.get(url, { headers: { 'User-Agent': UA } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlink(filepath, () => { });
                return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => { });
                return reject(new Error(`HTTP ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', (err) => { fs.unlink(filepath, () => { }); reject(err); });
    });
}

function slugify(str) {
    return (str || '')
        .toString()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function filenameFromUrl(url, prefix) {
    try {
        const u = new URL(url);
        const base = path.basename(u.pathname).split('?')[0] || `img-${Date.now()}.jpg`;
        return prefix ? `${prefix}-${base}` : base;
    } catch {
        return `${prefix || 'img'}-${Date.now()}.jpg`;
    }
}

const downloadedCache = new Map();
async function downloadOnce(url, dirKey, namePrefix) {
    if (!url || !url.startsWith('http')) return '';
    const dir = DIRS[dirKey];
    const publicPrefix = `/images/${dirKey}`;
    const cacheKey = `${dirKey}::${url}`;
    if (downloadedCache.has(cacheKey)) return downloadedCache.get(cacheKey);
    const filename = filenameFromUrl(url, namePrefix);
    const filepath = path.join(dir, filename);
    try {
        if (!fs.existsSync(filepath)) {
            await downloadImage(url, filepath);
        }
        const publicPath = `${publicPrefix}/${filename}`;
        downloadedCache.set(cacheKey, publicPath);
        console.log(`  ✓ image: ${dirKey}/${filename}`);
        return publicPath;
    } catch (err) {
        console.warn(`  ✗ image failed (${url}): ${err.message}`);
        return '';
    }
}

async function newPage(browser) {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport({ width: 1920, height: 1080 });
    return page;
}

async function gotoSafe(page, url, opts = {}) {
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000, ...opts });
            await sleep(500 + Math.floor(Math.random() * 1000)); // polite 500-1500ms pacing
            return resp;
        } catch (e) {
            console.warn(`  navigation issue for ${url} (attempt ${attempt}): ${e.message}`);
            if (attempt === 2) return null;
            await sleep(1500);
        }
    }
}

async function fetchXml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractLocs(xml) {
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
}

// -------------------- HOMEPAGE --------------------

async function processHomepage(browser) {
    console.log('\n=== HOMEPAGE ===');
    const page = await newPage(browser);
    await gotoSafe(page, BASE_URL + '/');

    const data = await page.evaluate(() => {
        const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

        // Hero slider slides
        const heroSlides = Array.from(document.querySelectorAll('.nb-carousel-slide')).map((slide) => {
            const img = slide.querySelector('picture img');
            const link = slide.querySelector('.nb-slide__link-overlay');
            if (!img) return null;
            return {
                image: img.getAttribute('src') || '',
                alt: img.getAttribute('alt') || '',
                link: link ? link.getAttribute('href') || '' : '',
            };
        }).filter(Boolean);

        // Category quick-nav tiles (brand accordion)
        const seenTiles = new Set();
        const categoryTiles = [];
        document.querySelectorAll('.nb-brand-grid__item').forEach((item) => {
            const title = clean(item.querySelector('.nb-brand-grid__title'));
            if (!title || seenTiles.has(title)) return;
            seenTiles.add(title);
            const bg = item.querySelector('.nb-brand-grid__bg');
            const logo = item.querySelector('.nb-brand-grid__logo');
            categoryTiles.push({
                title,
                image: bg ? bg.getAttribute('src') || '' : '',
                logo: logo ? logo.getAttribute('src') || '' : '',
                link: item.tagName === 'A' ? item.getAttribute('href') || '' : '',
            });
        });

        // "Vì sao chọn" and "Xưởng dịch vụ" - both use .nb-card-image__grid, keyed by widget title
        const iconSections = Array.from(document.querySelectorAll('.nb-grid-layout-dynamic.nb-card-image__grid')).map((grid) => {
            const widget = grid.closest('[id^="nb-widget-"]');
            const titleEl = widget ? widget.querySelector('.nb-widget-title') : null;
            const title = clean(titleEl);
            const items = Array.from(grid.querySelectorAll('.nb-card-image__item')).map((it) => ({
                badge: clean(it.querySelector('.nb-card-image__badge')),
                image: (it.querySelector('.nb-card-image__img') || {}).getAttribute
                    ? it.querySelector('.nb-card-image__img').getAttribute('src') || ''
                    : '',
                title: clean(it.querySelector('.nb-card-image__title')),
                description: clean(it.querySelector('.nb-card-image__desc')),
            }));
            return { title, items };
        });

        // Testimonials
        const testimonials = Array.from(document.querySelectorAll('.nb-reviews-slide')).map((slide) => {
            const scoreEl = slide.querySelector('.nb-stars-score');
            return {
                name: clean(slide.querySelector('.nb-reviews-client-badge')),
                score: scoreEl ? scoreEl.textContent.trim() : '',
                avatar: (slide.querySelector('.nb-reviews-avatar-wrapper img') || {}).getAttribute
                    ? slide.querySelector('.nb-reviews-avatar-wrapper img').getAttribute('src') || ''
                    : '',
                subtitle: clean(slide.querySelector('.nb-reviews-client-subtitle')),
                quote: clean(slide.querySelector('.nb-reviews-desc')),
            };
        });

        // Photo/media gallery strip
        const photoStrip = Array.from(document.querySelectorAll('.nb-gallery-slide')).map((slide) => ({
            type: slide.getAttribute('data-type') || 'image',
            fullImage: slide.getAttribute('data-full-src') || '',
            youtubeId: slide.getAttribute('data-youtube-id') || '',
            thumb: (slide.querySelector('.nb-gallery-image') || {}).getAttribute
                ? slide.querySelector('.nb-gallery-image').getAttribute('src') || ''
                : '',
            alt: (slide.querySelector('.nb-gallery-image') || {}).getAttribute
                ? slide.querySelector('.nb-gallery-image').getAttribute('alt') || ''
                : '',
        }));

        // Product grid/carousel sections (title + product cards with category context)
        const productSections = [];
        document.querySelectorAll('[data-widget-type="item_grid"], [data-widget-type="item_carousel"]').forEach((widget) => {
            if (widget.getAttribute('data-item-type') !== 'product') return;
            const titleEl = widget.querySelector('.nb-widget-title');
            const title = clean(titleEl);
            const cards = Array.from(widget.querySelectorAll('.nb-item-card')).map((card) => card.getAttribute('href') || '');
            productSections.push({ title, sortBy: widget.getAttribute('data-sort-by') || '', productUrls: cards });
        });

        // News section
        const newsSection = [];
        document.querySelectorAll('[data-widget-type="item_carousel"]').forEach((widget) => {
            if (widget.getAttribute('data-item-type') !== 'post') return;
            const titleEl = widget.querySelector('.nb-widget-title');
            newsSection.push({ title: clean(titleEl) });
        });

        return { heroSlides, categoryTiles, iconSections, testimonials, photoStrip, productSections, newsSection };
    });

    await page.close();

    // Download hero images
    const heroSlides = [];
    for (let i = 0; i < data.heroSlides.length; i++) {
        const s = data.heroSlides[i];
        const img = await downloadOnce(s.image, 'hero', `hero-${i + 1}`);
        heroSlides.push({ image: img, alt: s.alt, link: s.link });
        await sleep(200);
    }

    // Download category tiles
    const categoryTiles = [];
    for (let i = 0; i < data.categoryTiles.length; i++) {
        const t = data.categoryTiles[i];
        const img = await downloadOnce(t.image, 'categories', `category-${i + 1}`);
        const logo = await downloadOnce(t.logo, 'categories', `category-logo-${i + 1}`);
        categoryTiles.push({ title: t.title, image: img, logo, link: t.link });
        await sleep(200);
    }

    // Why-choose-us / Service-steps
    let whyChooseUs = { title: '', items: [] };
    let serviceSteps = { title: '', items: [] };
    for (const section of data.iconSections) {
        const isWhy = /VÌ SAO/i.test(section.title);
        const isService = /XƯỞNG DỊCH VỤ/i.test(section.title);
        if (!isWhy && !isService) continue;
        const dirKey = isWhy ? 'whyus' : 'service';
        const items = [];
        for (let i = 0; i < section.items.length; i++) {
            const it = section.items[i];
            const img = await downloadOnce(it.image, dirKey, `${dirKey}-${i + 1}`);
            items.push({ badge: it.badge, image: img, title: it.title, description: it.description });
            await sleep(150);
        }
        if (isWhy) whyChooseUs = { title: section.title, items };
        if (isService) serviceSteps = { title: section.title, items };
    }

    // Testimonials
    const testimonials = [];
    for (let i = 0; i < data.testimonials.length; i++) {
        const t = data.testimonials[i];
        const avatar = await downloadOnce(t.avatar, 'testimonials', `testimonial-${i + 1}`);
        testimonials.push({ name: t.name, score: t.score, avatar, subtitle: t.subtitle, quote: t.quote });
        await sleep(150);
    }

    // Photo strip
    const photoStrip = [];
    for (let i = 0; i < data.photoStrip.length; i++) {
        const p = data.photoStrip[i];
        if (p.type === 'youtube') {
            photoStrip.push({ type: 'youtube', youtubeId: p.youtubeId, alt: p.alt, thumb: p.thumb });
        } else {
            const img = await downloadOnce(p.fullImage || p.thumb, 'gallery', `gallery-${i + 1}`);
            photoStrip.push({ type: 'image', image: img, alt: p.alt });
        }
        await sleep(150);
    }

    // The site's carousels render a duplicated clone of their slides for
    // seamless infinite-loop scrolling, so the raw DOM query above picks up
    // each real slide twice — dedupe before returning.
    const dedupeBy = (arr, keyFn) => {
        const seen = new Set();
        return arr.filter((item) => {
            const key = keyFn(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };
    const dedupedHeroSlides = dedupeBy(heroSlides, (h) => h.image);
    const dedupedTestimonials = dedupeBy(testimonials, (t) => `${t.name}|${t.quote}`);
    const dedupedPhotoStrip = dedupeBy(photoStrip, (p) => `${p.image || ''}|${p.youtubeId || ''}`);

    console.log(`Hero slides: ${dedupedHeroSlides.length}, category tiles: ${categoryTiles.length}, why-us items: ${whyChooseUs.items.length}, service steps: ${serviceSteps.items.length}, testimonials: ${dedupedTestimonials.length}, photo strip: ${dedupedPhotoStrip.length}`);

    return {
        heroSlides: dedupedHeroSlides,
        categoryTiles,
        whyChooseUs,
        serviceSteps,
        testimonials: dedupedTestimonials,
        photoStrip: dedupedPhotoStrip,
        productSections: data.productSections,
        newsSectionTitle: (data.newsSection[0] || {}).title || 'Tin Tức Nổi Bật',
    };
}

// -------------------- PRODUCTS --------------------

function categoryFromUrl(url, name) {
    const n = (name || '').toLowerCase();
    const u = (url || '').toLowerCase();
    if (/xe điện|ev\b|-ev\b| ev /.test(n) || /-ev(-|$)/.test(u) || /ev-van-dien|bus-dien|van-dien/.test(u)) return 'xe-dien';
    if (/xe tải|kim an|thùng|chassis/.test(n) || /kim-an/.test(u)) return 'xe-tai';
    if (/van\b|-van-/.test(n) || /-van-/.test(u)) return 'xe-van';
    if (/bus/.test(n) || /-bus-/.test(u)) return 'xe-bus';
    return 'xe-khach';
}

async function processProducts(browser, onCheckpoint) {
    console.log('\n=== PRODUCTS ===');
    const xml = await fetchXml(`${BASE_URL}/sitemap-products.xml`);
    let urls = extractLocs(xml).filter((u) => /\/san-pham\/[^/]+$/.test(u) && !u.endsWith('/san-pham'));
    // Exclude non-product editorial pages that share the /san-pham/ path but are really articles
    urls = urls.filter((u) => !/danh-gia-chi-tiet/.test(u));
    console.log(`Discovered ${urls.length} product URLs from sitemap`);

    const products = [];
    let id = 1;
    const page = await newPage(browser);
    for (const url of urls) {
        console.log(`🚌 Product [${id}/${urls.length}]: ${url}`);
        let ok = false;
        for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
            const resp = await gotoSafe(page, url);
            if (resp) ok = true;
        }
        if (!ok) {
            console.warn(`  ✗ failed to load ${url}, skipping`);
            continue;
        }

        const raw = await page.evaluate(() => {
            const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
            const title = clean(document.querySelector('.nb-detail-title-card__heading'));
            const priceEl = document.querySelector('[data-car-price]');
            const price = priceEl ? priceEl.getAttribute('data-car-price') : '';

            // Gallery images
            const gallery = Array.from(document.querySelectorAll('.nb-album-wrapper img, .nb-gallery-carousel-wrapper img'))
                .map((img) => img.getAttribute('src') || img.getAttribute('data-src') || '')
                .filter((s) => s && s.startsWith('http'));

            // Spec highlight bullets
            const highlights = Array.from(document.querySelectorAll('.nb-spec-highlight-box')).map((box) => ({
                label: clean(box.querySelector('.nb-spec-highlight-label')),
                value: clean(box.querySelector('.nb-spec-highlight-value')),
            }));

            // Full spec table
            const specs = Array.from(document.querySelectorAll('.nb-specs-table tr')).map((tr) => {
                const label = clean(tr.querySelector('.nb-specs-table-label'));
                const value = clean(tr.querySelector('.nb-specs-table-val'));
                return { label, value };
            }).filter((s) => s.label && s.value);

            // Description / feature rich text
            const descEl = document.querySelector('.nb-product-desc-content .nb-rich-text');
            const descriptionHtml = descEl ? descEl.innerHTML.trim() : '';
            const descriptionText = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';

            // Feature bullet list if present (li items inside desc)
            const features = descEl
                ? Array.from(descEl.querySelectorAll('li')).map((li) => clean(li)).filter(Boolean)
                : [];

            // Badges (e.g. "ƯU ĐÃI THÁNG 08", "Trả góp 80%", "Bảo hành 3 năm")
            const badges = Array.from(document.querySelectorAll('.nb-header-badge')).map((b) => clean(b));

            const ratingEl = document.querySelector('.nb-product-rating-wrap strong');
            const rating = ratingEl ? ratingEl.textContent.trim() : '';

            return { title, price, gallery, highlights, specs, descriptionHtml, descriptionText, features, badges, rating };
        });

        if (!raw.title) {
            console.warn(`  ✗ no title found, skipping ${url}`);
            continue;
        }

        const category = categoryFromUrl(url, raw.title);

        // Download gallery images
        const galleryUrls = Array.from(new Set(raw.gallery)).slice(0, 15);
        const galleryPaths = [];
        for (let i = 0; i < galleryUrls.length; i++) {
            const p = await downloadOnce(galleryUrls[i], 'products', `product-${id}-${i}`);
            if (p) galleryPaths.push(p);
            await sleep(150);
        }

        const slug = url.replace(/\/$/, '').split('/').pop();

        products.push({
            id: id++,
            name: raw.title,
            slug,
            category,
            price: raw.price ? Number(raw.price) : null,
            priceDisplay: raw.price ? `${Number(raw.price).toLocaleString('vi-VN')} đ` : '',
            image: galleryPaths[0] || '',
            gallery: galleryPaths,
            description: raw.descriptionText,
            descriptionHtml: raw.descriptionHtml,
            specs: raw.specs,
            highlights: raw.highlights,
            features: raw.features,
            badges: raw.badges,
            rating: raw.rating,
            sourceUrl: url,
        });

        if (onCheckpoint) onCheckpoint(products);
        await sleep(DELAY_MS);
    }
    await page.close();
    return products;
}

// -------------------- ARTICLES --------------------

async function processArticles(browser, onCheckpoint) {
    console.log('\n=== ARTICLES ===');
    const xml = await fetchXml(`${BASE_URL}/sitemap-posts.xml`);
    let urls = extractLocs(xml).filter((u) => /\/bai-viet\/[^/]+$/.test(u) && !u.endsWith('/bai-viet'));
    console.log(`Discovered ${urls.length} article URLs from sitemap`);

    const articles = [];
    let id = 1;
    const page = await newPage(browser);
    for (const url of urls) {
        console.log(`📰 Article [${id}/${urls.length}]: ${url}`);
        let ok = false;
        for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
            const resp = await gotoSafe(page, url);
            if (resp) ok = true;
        }
        if (!ok) {
            console.warn(`  ✗ failed to load ${url}, skipping`);
            continue;
        }

        const raw = await page.evaluate(() => {
            const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
            const title = clean(document.querySelector('.nb-detail-title-card__heading'));

            const metaItems = Array.from(document.querySelectorAll('.nb-post-meta-item')).map((m) => clean(m));
            const category = metaItems.find((m) => m && !/^\d+$/.test(m) && !/\d\.\d\/5/.test(m) && !/^\d{2}\/\d{2}\/\d{4}$/.test(m)) || '';

            const timeEl = document.querySelector('.nb-post-meta-item time');
            const date = timeEl ? timeEl.getAttribute('datetime') || timeEl.textContent.trim() : '';

            const coverEl = document.querySelector('.nb-detail-title-card--glassmorphism');
            let coverImage = '';
            if (coverEl) {
                const style = coverEl.getAttribute('style') || '';
                const m = style.match(/url\(['"]?([^'")]+)['"]?\)/);
                if (m) coverImage = m[1];
            }

            const contentEl = document.querySelector('.nb-detail-article-card .nb-rich-text');
            const contentHtml = contentEl ? contentEl.innerHTML.trim() : '';
            const contentText = contentEl ? contentEl.textContent.replace(/\s+/g, ' ').trim() : '';

            const images = contentEl
                ? Array.from(contentEl.querySelectorAll('img')).map((img) => img.getAttribute('src') || '').filter((s) => s && s.startsWith('http'))
                : [];

            const author = (metaItems.find((m) => /Miền Nam|Kim Long/i.test(m)) || 'Kim Long Miền Nam');

            return { title, category, date, coverImage, contentHtml, contentText, images, author };
        });

        if (!raw.title) {
            console.warn(`  ✗ no title found, skipping ${url}`);
            continue;
        }

        const slug = url.replace(/\/$/, '').split('/').pop();

        const imgUrls = Array.from(new Set([raw.coverImage, ...raw.images].filter(Boolean)));
        const imgPaths = [];
        for (let i = 0; i < imgUrls.length; i++) {
            const p = await downloadOnce(imgUrls[i], 'news', `news-${id}-${i}`);
            if (p) imgPaths.push(p);
            await sleep(150);
        }

        const excerpt = raw.contentText.slice(0, 220);

        articles.push({
            id: id++,
            title: raw.title,
            slug,
            category: raw.category || 'Tin Tức',
            categories: raw.category ? [raw.category] : [],
            image: imgPaths[0] || '',
            gallery: imgPaths,
            excerpt,
            content: raw.contentHtml,
            author: raw.author,
            date: raw.date,
            featured: false,
            sourceUrl: url,
        });

        if (onCheckpoint) onCheckpoint(articles);
        await sleep(DELAY_MS);
    }
    await page.close();

    // Mark most recent 4 as featured (homepage "Tin Tức Nổi Bật" shows 4 cards)
    articles
        .slice()
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
        .slice(0, 4)
        .forEach((a) => { a.featured = true; });

    return articles;
}

// -------------------- ABOUT --------------------

async function processAbout(browser) {
    console.log('\n=== ABOUT (gioi-thieu-ve-doanh-nghiep) ===');
    const url = `${BASE_URL}/gioi-thieu-ve-doanh-nghiep`;
    const page = await newPage(browser);
    await gotoSafe(page, url);

    const data = await page.evaluate(() => {
        const main = document.querySelector('main') || document.querySelector('article') || document.body;
        const excludeSelectors = 'nav, footer, header, script, style';
        const clean = (el) => {
            const clone = el.cloneNode(true);
            clone.querySelectorAll('style, script').forEach((n) => n.remove());
            return clone.textContent.replace(/\s+/g, ' ').trim();
        };
        const title = clean(document.querySelector('.nb-detail-title-card__heading, h1'));
        const paragraphs = [];
        main.querySelectorAll('h2,h3,h4,p,li,td').forEach((el) => {
            if (el.closest(excludeSelectors)) return;
            const t = clean(el);
            if (t) paragraphs.push(t);
        });
        const images = [];
        main.querySelectorAll('img').forEach((img) => {
            if (img.closest(excludeSelectors)) return;
            const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
            if (src && src.startsWith('http') && !/logo|icon/i.test(src)) images.push(src);
        });
        return { title, paragraphs, images };
    });
    await page.close();

    const imgUrls = Array.from(new Set(data.images)).slice(0, 20);
    const imgPaths = [];
    for (let i = 0; i < imgUrls.length; i++) {
        const p = await downloadOnce(imgUrls[i], 'about', `about-${i + 1}`);
        if (p) imgPaths.push(p);
        await sleep(150);
    }

    return {
        title: data.title,
        content: data.paragraphs.join('\n'),
        images: imgPaths,
        sourceUrl: url,
    };
}

// -------------------- CONTACT / SHOWROOMS --------------------

async function processContact(browser) {
    console.log('\n=== CONTACT (lien-he) + Showrooms ===');
    const url = `${BASE_URL}/lien-he`;
    const page = await newPage(browser);
    await gotoSafe(page, url);

    const data = await page.evaluate(() => {
        const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

        // JSON-LD organization data
        let org = null;
        document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
            try {
                const json = JSON.parse(s.textContent);
                if (json['@type'] === 'AutoDealer') org = json;
            } catch (e) { /* ignore */ }
        });

        // Showroom tabs
        const showrooms = Array.from(document.querySelectorAll('.nb-contact-map__tab-item')).map((tab) => ({
            name: clean(tab),
            phone: tab.getAttribute('data-phone') || '',
            address: tab.getAttribute('data-address') || '',
            image: tab.getAttribute('data-image') || '',
            mapSrc: tab.getAttribute('data-map-src') || '',
        }));

        return { org, showrooms };
    });
    await page.close();

    const showrooms = [];
    for (let i = 0; i < data.showrooms.length; i++) {
        const s = data.showrooms[i];
        const imgUrl = s.image && s.image.startsWith('http') ? s.image : (s.image ? BASE_URL + s.image : '');
        const img = await downloadOnce(imgUrl, 'showroom', `showroom-${i + 1}`);
        showrooms.push({ name: s.name, phone: s.phone, address: s.address, image: img, mapEmbed: s.mapSrc });
        await sleep(150);
    }

    const org = data.org || {};
    return {
        companyName: org.name || 'Kim Long Miền Nam',
        description: org.description || '',
        hotline: org.telephone || '',
        address: org.address ? org.address.streetAddress : '',
        geo: org.geo || null,
        openingHours: org.openingHoursSpecification || null,
        socials: org.sameAs || [],
        showrooms,
        sourceUrl: url,
    };
}

// -------------------- FOOTER --------------------

async function processFooter(browser) {
    console.log('\n=== FOOTER ===');
    const page = await newPage(browser);
    await gotoSafe(page, BASE_URL + '/');

    const data = await page.evaluate(() => {
        const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
        const footer = document.querySelector('footer');
        if (!footer) return null;

        const columns = Array.from(footer.querySelectorAll('.nb-footer-col, .nb-footer-column, [class*="footer"] ul')).map((col) => ({
            heading: clean(col.querySelector('h3,h4,.nb-footer-title')),
            links: Array.from(col.querySelectorAll('a')).map((a) => ({ text: clean(a), href: a.getAttribute('href') || '' })),
        })).filter((c) => c.links.length > 0);

        const socialLinks = Array.from(footer.querySelectorAll('a[href*="facebook"], a[href*="youtube"], a[href*="tiktok"], a[href*="zalo"]'))
            .map((a) => ({ href: a.getAttribute('href') || '', label: a.getAttribute('aria-label') || clean(a) }));

        const hotlineEl = footer.querySelector('a[href^="tel:"]');
        const hotline = hotlineEl ? hotlineEl.textContent.trim() : '';

        const copyrightEl = footer.querySelector('.nb-copyright, .copyright');
        const copyright = clean(copyrightEl);

        return { columns, socialLinks, hotline, copyright, rawText: clean(footer) };
    });

    await page.close();
    return data || { columns: [], socialLinks: [], hotline: '', copyright: '', rawText: '' };
}

// -------------------- MAIN --------------------

const CONTENT_FILE = path.join(SERVER_DATA_DIR, 'content.json');

function loadCheckpoint() {
    try {
        return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

function saveCheckpoint(content) {
    const tmp = `${CONTENT_FILE}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(content, null, 2), 'utf-8');
    fs.renameSync(tmp, CONTENT_FILE);
}

async function main() {
    console.log('🚀 Starting full scrape of', BASE_URL);

    // Resume support: if content.json already has real (kimlongmiennam.com)
    // data from a prior run of THIS script, skip phases that already
    // completed instead of restarting from zero.
    const existing = loadCheckpoint();
    const isRealCheckpoint = existing.source === BASE_URL;

    const content = isRealCheckpoint ? existing : {
        scrapedAt: new Date().toISOString(),
        source: BASE_URL,
        heroSlides: [], categoryTiles: [], whyChooseUs: { title: '', items: [] },
        serviceSteps: { title: '', items: [] }, testimonials: [], photoStrip: [],
        homepageProductSections: [], newsSectionTitle: '',
        products: [], articles: [], about: {}, careers: [], contact: {}, showroom: [], footer: {},
    };

    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
            '--disable-gpu', '--single-process', '--no-zygote',
            '--js-flags=--max-old-space-size=512',
        ],
    });

    try {
        if (!isRealCheckpoint || !content.heroSlides?.length) {
            const homepage = await processHomepage(browser);
            Object.assign(content, {
                heroSlides: homepage.heroSlides,
                categoryTiles: homepage.categoryTiles,
                whyChooseUs: homepage.whyChooseUs,
                serviceSteps: homepage.serviceSteps,
                testimonials: homepage.testimonials,
                photoStrip: homepage.photoStrip,
                homepageProductSections: homepage.productSections,
                newsSectionTitle: homepage.newsSectionTitle,
            });
            saveCheckpoint(content);
            console.log('✅ Checkpoint saved after homepage');
        } else {
            console.log('⏭️  Skipping homepage (already checkpointed)');
        }

        if (!content.products || content.products.length < 55) {
            content.products = await processProducts(browser, (partial) => {
                content.products = partial;
                saveCheckpoint(content);
            });
            saveCheckpoint(content);
            console.log(`✅ Checkpoint saved after products (${content.products.length})`);
        } else {
            console.log(`⏭️  Skipping products (already have ${content.products.length})`);
        }

        if (!content.articles || content.articles.length < 38) {
            content.articles = await processArticles(browser, (partial) => {
                content.articles = partial;
                saveCheckpoint(content);
            });
            saveCheckpoint(content);
            console.log(`✅ Checkpoint saved after articles (${content.articles.length})`);
        } else {
            console.log(`⏭️  Skipping articles (already have ${content.articles.length})`);
        }

        if (!content.about || !content.about.content) {
            content.about = await processAbout(browser);
            saveCheckpoint(content);
            console.log('✅ Checkpoint saved after about');
        }

        if (!content.contact || !content.contact.showrooms?.length) {
            content.contact = await processContact(browser);
            content.showroom = content.contact.showrooms;
            saveCheckpoint(content);
            console.log('✅ Checkpoint saved after contact/showrooms');
        }

        if (!content.footer || !content.footer.hotline) {
            content.footer = await processFooter(browser);
            saveCheckpoint(content);
            console.log('✅ Checkpoint saved after footer');
        }

        content.scrapedAt = new Date().toISOString();
        saveCheckpoint(content);
        console.log(`\n✅ Wrote server/data/content.json`);

        console.log('\n=== SUMMARY ===');
        console.log(`Hero slides: ${content.heroSlides.length}`);
        console.log(`Category tiles: ${content.categoryTiles.length}`);
        console.log(`Why-choose-us items: ${content.whyChooseUs.items.length}`);
        console.log(`Service steps: ${content.serviceSteps.items.length}`);
        console.log(`Testimonials: ${content.testimonials.length}`);
        console.log(`Photo strip items: ${content.photoStrip.length}`);
        console.log(`Products: ${content.products.length}`);
        console.log(`Articles: ${content.articles.length}`);
        console.log(`About images: ${(content.about.images || []).length}`);
        console.log(`Showrooms: ${(content.contact.showrooms || []).length}`);
    } finally {
        await browser.close();
    }
}

main().catch(err => {
    console.error('Fatal scrape error:', err);
    process.exit(1);
});
