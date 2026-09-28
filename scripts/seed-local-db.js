import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenvLoad from '../server/loadEnv.js';

dotenvLoad();

import { query, ensureSchema, pool } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE = path.join(__dirname, '..', 'server', 'data', 'content.json');

async function seed() {
    console.log('Ensuring schema...');
    await ensureSchema();

    const { rows } = await query('SELECT count(*)::int as c FROM products');
    if (rows[0].c > 0) {
        console.log(`Database already has ${rows[0].c} products. Skipping initial seed.`);
        await pool.end();
        return;
    }

    console.log('Loading content.json...');
    const raw = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));

    console.log(`Seeding ${(raw.products || []).length} products...`);
    for (const p of raw.products || []) {
        const { id, featured, slug, ...rest } = p;
        await query(
            'INSERT INTO products (data, featured, slug) VALUES ($1, $2, $3)',
            [JSON.stringify({ ...rest, slug }), Boolean(featured), slug || null]
        );
    }

    console.log(`Seeding ${(raw.articles || []).length} articles...`);
    for (const a of raw.articles || []) {
        const { id, featured, slug, ...rest } = a;
        await query(
            'INSERT INTO articles (data, featured, slug) VALUES ($1, $2, $3)',
            [JSON.stringify({ ...rest, slug }), Boolean(featured), slug || null]
        );
    }

    console.log(`Seeding ${(raw.testimonials || []).length} testimonials...`);
    for (const t of raw.testimonials || []) {
        const { id, ...rest } = t;
        await query('INSERT INTO testimonials (data) VALUES ($1)', [JSON.stringify(rest)]);
    }

    const SKIP_KEYS = new Set(['products', 'articles', 'testimonials']);
    console.log('Seeding site_content...');
    for (const [key, value] of Object.entries(raw)) {
        if (SKIP_KEYS.has(key)) continue;
        await query(
            `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, now())
             ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
            [key, JSON.stringify(value)]
        );
    }

    console.log('Local database seeded successfully!');
    await pool.end();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
