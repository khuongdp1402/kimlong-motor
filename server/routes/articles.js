import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function toApi(row) {
    return { ...row.data, id: row.id, featured: row.featured };
}

function slugify(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

router.get('/', async (req, res) => {
    const { rows } = await query('SELECT * FROM articles ORDER BY id ASC');
    res.json(rows.map(toApi));
});

router.get('/:id', async (req, res) => {
    const { rows } = await query(
        "SELECT * FROM articles WHERE id::text = $1 OR slug = $1 LIMIT 1",
        [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Article not found.' });
    res.json(toApi(rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
    const body = req.body || {};
    if (!body.title) return res.status(400).json({ error: 'title is required.' });

    const slug = body.slug || slugify(body.title);
    const data = {
        title: body.title,
        slug,
        category: body.category || 'tin-tuc',
        categories: Array.isArray(body.categories) ? body.categories : [body.category || 'tin-tuc'],
        image: body.image || '',
        gallery: Array.isArray(body.gallery) ? body.gallery : [],
        excerpt: body.excerpt || '',
        content: body.content || '',
        author: body.author || 'Kim Long Motor',
        date: body.date || new Date().toISOString().split('T')[0],
        sourceUrl: body.sourceUrl || '',
    };

    const { rows } = await query(
        'INSERT INTO articles (data, featured, slug) VALUES ($1, $2, $3) RETURNING *',
        [JSON.stringify(data), Boolean(body.featured), slug]
    );
    res.status(201).json(toApi(rows[0]));
});

router.put('/:id', requireAuth, async (req, res) => {
    const existingRes = await query('SELECT * FROM articles WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!existingRes.rows.length) return res.status(404).json({ error: 'Article not found.' });
    const existing = existingRes.rows[0];

    const body = req.body || {};
    const { id: _ignoreId, featured: bodyFeatured, ...rest } = body;
    const mergedData = { ...existing.data, ...rest };
    const featured = typeof bodyFeatured === 'boolean' ? bodyFeatured : existing.featured;
    const slug = mergedData.slug || existing.slug;

    const { rows } = await query(
        'UPDATE articles SET data = $1, featured = $2, slug = $3, updated_at = now() WHERE id = $4 RETURNING *',
        [JSON.stringify(mergedData), featured, slug, existing.id]
    );
    res.json(toApi(rows[0]));
});

router.delete('/:id', requireAuth, async (req, res) => {
    const { rows } = await query('DELETE FROM articles WHERE id::text = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Article not found.' });
    res.json(toApi(rows[0]));
});

// Lightweight quick-toggle used by the admin list view's "Nổi bật" switch, so
// it doesn't need to open the full edit form just to flip one boolean.
router.patch('/:id/featured', requireAuth, async (req, res) => {
    const existingRes = await query('SELECT * FROM articles WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!existingRes.rows.length) return res.status(404).json({ error: 'Article not found.' });
    const existing = existingRes.rows[0];

    const featured = typeof req.body?.featured === 'boolean' ? req.body.featured : !existing.featured;
    const { rows } = await query(
        'UPDATE articles SET featured = $1, updated_at = now() WHERE id = $2 RETURNING *',
        [featured, existing.id]
    );
    res.json(toApi(rows[0]));
});

export default router;
