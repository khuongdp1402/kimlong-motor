// One-time migration: server/data/content.json (JSON file) -> Postgres + Vercel Blob.
//
// Usage:
//   node --env-file=.env.local scripts/migrate-to-postgres.js [--force]
//
// What it does:
//   1. Reads server/data/content.json.
//   2. Recursively finds every string value that looks like a local
//      `/images/...` path, reads the matching file from public/images/...
//      on disk, and uploads it to Vercel Blob (put()), reusing a cache so a
//      path referenced many times (e.g. shared hero/category images) is only
//      uploaded once.
//   3. Rewrites every one of those references in-memory to the new Blob URL.
//   4. Inserts products/articles/testimonials as rows, and everything else
//      (heroSlides, categoryTiles, ... ) as site_content rows.
//   5. Is idempotent-safe: refuses to run against non-empty tables unless
//      --force is passed.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';
import { query, ensureSchema } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, '..');
const CONTENT_FILE = path.join(REPO_ROOT, 'server', 'data', 'content.json');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');

const FORCE = process.argv.includes('--force');

const IMAGE_PATH_RE = /^\/images\/[^\s"']+\.(?:webp|jpg|jpeg|png|gif|svg)$/i;

// key -> the top-level content.json fields that become full CRUD tables.
const COLLECTION_KEYS = new Set(['products', 'articles', 'testimonials']);
// Everything else at the top level (minus these bookkeeping-only fields) goes
// into site_content, one row per key.
const SKIP_KEYS = new Set(['products', 'articles', 'testimonials']);

function log(...args) {
    console.log(new Date().toISOString().slice(11, 19), ...args);
}

// --- Step 1: recursively collect + rewrite image paths -------------------

function collectImagePaths(node, out) {
    if (typeof node === 'string') {
        if (IMAGE_PATH_RE.test(node)) out.add(node);
        return;
    }
    if (Array.isArray(node)) {
        node.forEach((v) => collectImagePaths(v, out));
        return;
    }
    if (node && typeof node === 'object') {
        Object.values(node).forEach((v) => collectImagePaths(v, out));
    }
}

function rewriteImagePaths(node, map) {
    if (typeof node === 'string') {
        return Object.prototype.hasOwnProperty.call(map, node) ? map[node] : node;
    }
    if (Array.isArray(node)) {
        return node.map((v) => rewriteImagePaths(v, map));
    }
    if (node && typeof node === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(node)) {
            out[k] = rewriteImagePaths(v, map);
        }
        return out;
    }
    return node;
}

const MIME_BY_EXT = {
    '.webp': 'image/webp',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
};

async function uploadOne(localPath, index, total, failures) {
    // localPath looks like /images/products/xyz.webp
    const diskPath = path.join(PUBLIC_DIR, localPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
        failures.push({ path: localPath, reason: 'File not found on disk: ' + diskPath });
        return null;
    }
    const ext = path.extname(diskPath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';
    // Preserve folder structure, e.g. products/<filename>, hero/<filename>.
    const blobPathname = localPath.replace(/^\/images\//, '');

    try {
        const buffer = fs.readFileSync(diskPath);
        const blob = await put(blobPathname, buffer, {
            access: 'public',
            contentType,
            addRandomSuffix: false,
            allowOverwrite: true,
        });
        log(`Uploaded ${index}/${total}: ${localPath} -> ${blob.url}`);
        return blob.url;
    } catch (err) {
        failures.push({ path: localPath, reason: err.message || String(err) });
        log(`FAILED ${index}/${total}: ${localPath} — ${err.message || err}`);
        return null;
    }
}

async function uploadAllImages(imagePaths) {
    const list = [...imagePaths];
    const map = {};
    const failures = [];
    let done = 0;
    for (const localPath of list) {
        done += 1;
        const url = await uploadOne(localPath, done, list.length, failures);
        if (url) map[localPath] = url;
    }
    return { map, failures };
}

// --- Step 2: DB inserts ----------------------------------------------------

async function checkNonEmpty() {
    const tables = ['products', 'articles', 'testimonials'];
    const nonEmpty = [];
    for (const t of tables) {
        const { rows } = await query(`SELECT count(*)::int AS c FROM ${t}`);
        if (rows[0].c > 0) nonEmpty.push({ table: t, count: rows[0].c });
    }
    return nonEmpty;
}

async function insertProducts(products) {
    let n = 0;
    for (const p of products) {
        const { id, featured, slug, ...rest } = p;
        await query(
            'INSERT INTO products (data, featured, slug) VALUES ($1, $2, $3)',
            [JSON.stringify({ ...rest, slug }), Boolean(featured), slug || null]
        );
        n += 1;
    }
    return n;
}

async function insertArticles(articles) {
    let n = 0;
    for (const a of articles) {
        const { id, featured, slug, ...rest } = a;
        await query(
            'INSERT INTO articles (data, featured, slug) VALUES ($1, $2, $3)',
            [JSON.stringify({ ...rest, slug }), Boolean(featured), slug || null]
        );
        n += 1;
    }
    return n;
}

async function insertTestimonials(testimonials) {
    let n = 0;
    for (const t of testimonials) {
        const { id, ...rest } = t;
        await query('INSERT INTO testimonials (data) VALUES ($1)', [JSON.stringify(rest)]);
        n += 1;
    }
    return n;
}

async function upsertSiteContent(key, value) {
    await query(
        `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, JSON.stringify(value)]
    );
}

// --- main -------------------------------------------------------------

async function main() {
    log('Starting migration: content.json -> Postgres + Vercel Blob');

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        log('WARNING: BLOB_READ_WRITE_TOKEN is not set in the environment. ' +
            '`put()` calls from @vercel/blob will fail without it.');
    }

    await ensureSchema();

    const nonEmpty = await checkNonEmpty();
    if (nonEmpty.length && !FORCE) {
        console.error('Refusing to run: the following tables already have data:');
        nonEmpty.forEach((t) => console.error(`  - ${t.table}: ${t.count} rows`));
        console.error('Re-run with --force to insert anyway (this WILL duplicate data).');
        process.exit(1);
    }
    if (nonEmpty.length && FORCE) {
        log('--force passed; proceeding despite non-empty tables:', nonEmpty);
    }

    if (!fs.existsSync(CONTENT_FILE)) {
        console.error('content.json not found at', CONTENT_FILE);
        process.exit(1);
    }
    const raw = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));

    log(`Loaded content.json: ${(raw.products || []).length} products, ` +
        `${(raw.articles || []).length} articles, ${(raw.testimonials || []).length} testimonials.`);

    // 1. Collect every unique local image path referenced anywhere in the tree.
    const imagePaths = new Set();
    collectImagePaths(raw, imagePaths);
    log(`Found ${imagePaths.size} unique local image references to migrate.`);

    // 2. Upload each once, build a path -> blob URL map.
    const { map, failures } = await uploadAllImages(imagePaths);
    log(`Image upload complete: ${Object.keys(map).length} succeeded, ${failures.length} failed.`);

    // 3. Rewrite all references in the in-memory data.
    const transformed = rewriteImagePaths(raw, map);

    // 4. Insert into Postgres.
    const productCount = await insertProducts(transformed.products || []);
    log(`Inserted ${productCount} products.`);
    const articleCount = await insertArticles(transformed.articles || []);
    log(`Inserted ${articleCount} articles.`);
    const testimonialCount = await insertTestimonials(transformed.testimonials || []);
    log(`Inserted ${testimonialCount} testimonials.`);

    let siteContentCount = 0;
    for (const [key, value] of Object.entries(transformed)) {
        if (SKIP_KEYS.has(key)) continue;
        await upsertSiteContent(key, value);
        siteContentCount += 1;
        log(`Upserted site_content key: ${key}`);
    }

    console.log('\n=== Migration summary ===');
    console.log(`Products migrated:     ${productCount}`);
    console.log(`Articles migrated:     ${articleCount}`);
    console.log(`Testimonials migrated: ${testimonialCount}`);
    console.log(`site_content keys:     ${siteContentCount}`);
    console.log(`Images uploaded:       ${Object.keys(map).length} / ${imagePaths.size}`);
    if (failures.length) {
        console.log(`Images FAILED:         ${failures.length}`);
        failures.forEach((f) => console.log(`  - ${f.path}: ${f.reason}`));
    } else {
        console.log('Images FAILED:         0');
    }
    console.log('==========================\n');

    if (failures.length) {
        process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error('Migration failed with an unexpected error:', err);
    process.exit(1);
});
