import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_FILE = path.join(__dirname, 'data', 'content.json');
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');

let contentData = null;
let leadsData = null;

function loadData() {
    if (!contentData) {
        try {
            contentData = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
        } catch {
            contentData = {};
        }
    }
    if (!leadsData) {
        try {
            leadsData = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
        } catch {
            leadsData = [];
        }
    }
}

function saveContent() {
    try {
        const tmp = `${CONTENT_FILE}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(contentData, null, 2), 'utf-8');
        fs.renameSync(tmp, CONTENT_FILE);
    } catch (err) {
        console.error('[LocalStore] Failed to save content.json:', err.message);
    }
}

function saveLeads() {
    try {
        const tmp = `${LEADS_FILE}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(leadsData, null, 2), 'utf-8');
        fs.renameSync(tmp, LEADS_FILE);
    } catch (err) {
        console.error('[LocalStore] Failed to save leads.json:', err.message);
    }
}

export function localQuery(text, params = []) {
    loadData();
    const sql = text.trim();

    // 1. SELECT count(*)::int as c FROM products
    if (/SELECT count\(\*\)::int as c FROM products/i.test(sql)) {
        return { rows: [{ c: (contentData.products || []).length }] };
    }

    // 2. Products table
    if (/(FROM|INTO) products/i.test(sql)) {
        contentData.products = contentData.products || [];
        if (/^SELECT/i.test(sql)) {
            if (/WHERE id::text = \$1 OR slug = \$1/i.test(sql) || /WHERE id::text = \$1 LIMIT 1/i.test(sql)) {
                const target = String(params[0]);
                const p = contentData.products.find(
                    (item) => String(item.id) === target || item.slug === target
                );
                return {
                    rows: p ? [{ id: p.id, data: p, featured: Boolean(p.featured), slug: p.slug }] : [],
                };
            }
            // SELECT * FROM products ORDER BY id ASC
            return {
                rows: contentData.products.map((p) => ({
                    id: p.id,
                    data: p,
                    featured: Boolean(p.featured),
                    slug: p.slug,
                })),
            };
        }
        if (/^INSERT INTO products/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const featured = Boolean(params[1]);
            const slug = params[2];
            const newId = Math.max(0, ...contentData.products.map((p) => Number(p.id) || 0)) + 1;
            const newItem = { ...data, id: newId, featured, slug };
            contentData.products.push(newItem);
            saveContent();
            return { rows: [{ id: newItem.id, data: newItem, featured: newItem.featured, slug: newItem.slug }] };
        }
        if (/^UPDATE products SET data/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const featured = Boolean(params[1]);
            const slug = params[2];
            const id = Number(params[3]);
            const idx = contentData.products.findIndex((p) => Number(p.id) === id);
            if (idx !== -1) {
                contentData.products[idx] = { ...data, id, featured, slug };
                saveContent();
                const updated = contentData.products[idx];
                return { rows: [{ id: updated.id, data: updated, featured: updated.featured, slug: updated.slug }] };
            }
            return { rows: [] };
        }
        if (/^UPDATE products SET featured/i.test(sql)) {
            const featured = Boolean(params[0]);
            const id = Number(params[1]);
            const idx = contentData.products.findIndex((p) => Number(p.id) === id);
            if (idx !== -1) {
                contentData.products[idx].featured = featured;
                saveContent();
                const updated = contentData.products[idx];
                return { rows: [{ id: updated.id, data: updated, featured: updated.featured, slug: updated.slug }] };
            }
            return { rows: [] };
        }
        if (/^DELETE FROM products/i.test(sql)) {
            const id = String(params[0]);
            const idx = contentData.products.findIndex((p) => String(p.id) === id);
            if (idx !== -1) {
                const [deleted] = contentData.products.splice(idx, 1);
                saveContent();
                return { rows: [{ id: deleted.id, data: deleted }] };
            }
            return { rows: [] };
        }
    }

    // 3. Articles table
    if (/(FROM|INTO) articles/i.test(sql)) {
        contentData.articles = contentData.articles || [];
        if (/^SELECT/i.test(sql)) {
            if (/WHERE id::text = \$1 OR slug = \$1/i.test(sql) || /WHERE id::text = \$1 LIMIT 1/i.test(sql)) {
                const target = String(params[0]);
                const a = contentData.articles.find(
                    (item) => String(item.id) === target || item.slug === target
                );
                return {
                    rows: a ? [{ id: a.id, data: a, featured: Boolean(a.featured), slug: a.slug }] : [],
                };
            }
            // List articles
            return {
                rows: contentData.articles.map((a) => ({
                    id: a.id,
                    data: a,
                    featured: Boolean(a.featured),
                    slug: a.slug,
                })),
            };
        }
        if (/^INSERT INTO articles/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const featured = Boolean(params[1]);
            const slug = params[2];
            const newId = Math.max(0, ...contentData.articles.map((a) => Number(a.id) || 0)) + 1;
            const newItem = { ...data, id: newId, featured, slug };
            contentData.articles.unshift(newItem);
            saveContent();
            return { rows: [{ id: newItem.id, data: newItem, featured: newItem.featured, slug: newItem.slug }] };
        }
        if (/^UPDATE articles SET data/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const featured = Boolean(params[1]);
            const slug = params[2];
            const id = Number(params[3]);
            const idx = contentData.articles.findIndex((a) => Number(a.id) === id);
            if (idx !== -1) {
                contentData.articles[idx] = { ...data, id, featured, slug };
                saveContent();
                const updated = contentData.articles[idx];
                return { rows: [{ id: updated.id, data: updated, featured: updated.featured, slug: updated.slug }] };
            }
            return { rows: [] };
        }
        if (/^UPDATE articles SET featured/i.test(sql)) {
            const featured = Boolean(params[0]);
            const id = Number(params[1]);
            const idx = contentData.articles.findIndex((a) => Number(a.id) === id);
            if (idx !== -1) {
                contentData.articles[idx].featured = featured;
                saveContent();
                const updated = contentData.articles[idx];
                return { rows: [{ id: updated.id, data: updated, featured: updated.featured, slug: updated.slug }] };
            }
            return { rows: [] };
        }
        if (/^DELETE FROM articles/i.test(sql)) {
            const id = String(params[0]);
            const idx = contentData.articles.findIndex((a) => String(a.id) === id);
            if (idx !== -1) {
                const [deleted] = contentData.articles.splice(idx, 1);
                saveContent();
                return { rows: [{ id: deleted.id, data: deleted }] };
            }
            return { rows: [] };
        }
    }

    // 4. Testimonials table
    if (/(FROM|INTO) testimonials/i.test(sql)) {
        contentData.testimonials = contentData.testimonials || [];
        if (/^SELECT/i.test(sql)) {
            if (/WHERE id::text = \$1 LIMIT 1/i.test(sql)) {
                const target = String(params[0]);
                const t = contentData.testimonials.find((item) => String(item.id) === target);
                return { rows: t ? [{ id: t.id, data: t }] : [] };
            }
            return {
                rows: contentData.testimonials.map((t) => ({ id: t.id, data: t })),
            };
        }
        if (/^INSERT INTO testimonials/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const newId = Math.max(0, ...contentData.testimonials.map((t) => Number(t.id) || 0)) + 1;
            const newItem = { ...data, id: newId };
            contentData.testimonials.push(newItem);
            saveContent();
            return { rows: [{ id: newItem.id, data: newItem }] };
        }
        if (/^UPDATE testimonials SET data/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const id = Number(params[1]);
            const idx = contentData.testimonials.findIndex((t) => Number(t.id) === id);
            if (idx !== -1) {
                contentData.testimonials[idx] = { ...data, id };
                saveContent();
                const updated = contentData.testimonials[idx];
                return { rows: [{ id: updated.id, data: updated }] };
            }
            return { rows: [] };
        }
        if (/^DELETE FROM testimonials/i.test(sql)) {
            const id = String(params[0]);
            const idx = contentData.testimonials.findIndex((t) => String(t.id) === id);
            if (idx !== -1) {
                const [deleted] = contentData.testimonials.splice(idx, 1);
                saveContent();
                return { rows: [{ id: deleted.id, data: deleted }] };
            }
            return { rows: [] };
        }
    }

    // 5. Leads table
    if (/FROM leads/i.test(sql) || /^INSERT INTO leads/i.test(sql)) {
        if (/^SELECT/i.test(sql)) {
            return {
                rows: leadsData.map((l) => ({
                    id: l.id,
                    data: l.data || l,
                    created_at: l.created_at || new Date().toISOString(),
                })),
            };
        }
        if (/^INSERT INTO leads/i.test(sql)) {
            const data = typeof params[0] === 'string' ? JSON.parse(params[0]) : params[0];
            const newId = Math.max(0, ...leadsData.map((l) => Number(l.id) || 0)) + 1;
            const lead = { id: newId, data, created_at: new Date().toISOString() };
            leadsData.unshift(lead);
            saveLeads();
            return { rows: [lead] };
        }
    }

    // 6. Site Content table
    if (/site_content/i.test(sql)) {
        if (/^SELECT value FROM site_content/i.test(sql)) {
            const key = params[0];
            const val = contentData[key];
            return { rows: val !== undefined ? [{ value: val }] : [] };
        }
        if (/^INSERT INTO site_content/i.test(sql)) {
            const key = params[0];
            const val = typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1];
            contentData[key] = val;
            saveContent();
            return { rows: [{ value: val }] };
        }
    }

    console.warn('[LocalStore] Unhandled SQL query, returning empty rows:', sql);
    return { rows: [] };
}
