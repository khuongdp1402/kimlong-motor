// Fetches each real product's live detail page (server-rendered HTML, no JS
// execution needed — confirmed via plain curl) and extracts two real fields
// missing from the initial 57-product scrape: "Mã dòng xe" (product code)
// and the review count next to the star rating. Writes them into
// server/data/content.json in place. Does not touch any other field.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'server', 'data', 'content.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
}

function extractMeta(html) {
    const $ = cheerio.load(html);
    let code = null;
    const metaLabel = $('.nb-meta-label').filter((_, el) => $(el).text().includes('Mã dòng xe')).first();
    if (metaLabel.length) {
        const code_ = metaLabel.parent().find('strong').first().text().trim();
        if (code_) code = code_;
    }
    const ratingWrap = $('.nb-product-rating-wrap').first();
    let reviewCount = null;
    if (ratingWrap.length) {
        const m = ratingWrap.text().match(/\((\d+)\s*đánh giá\)/);
        if (m) reviewCount = Number(m[1]);
    }
    // Promo countdown target timestamp, if present (ms epoch inside inline script).
    let promoEndsAt = null;
    const scriptMatch = html.match(/targetTime\s*=\s*(\d{10,13});/);
    if (scriptMatch) {
        promoEndsAt = new Date(Number(scriptMatch[1])).toISOString();
    }
    return { code, reviewCount, promoEndsAt };
}

async function main() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const products = data.products || [];

    let updated = 0;
    let failed = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        if (!p.sourceUrl) continue;
        if (p.code && p.reviewCount) continue; // already enriched

        try {
            const html = await fetchHtml(p.sourceUrl);
            const meta = extractMeta(html);
            if (meta.code) p.code = meta.code;
            if (meta.reviewCount) p.reviewCount = meta.reviewCount;
            if (meta.promoEndsAt) p.promoEndsAt = meta.promoEndsAt;
            updated++;
            console.log(`[${i + 1}/${products.length}] OK  ${p.slug}  code=${meta.code}  reviews=${meta.reviewCount}`);
        } catch (err) {
            failed++;
            console.log(`[${i + 1}/${products.length}] FAIL ${p.slug}  ${err.message}`);
        }
        await sleep(300);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\nDone. Updated ${updated}, failed ${failed}, total ${products.length}.`);
}

main();
