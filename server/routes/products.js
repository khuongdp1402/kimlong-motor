import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// A products row is { id, data (jsonb), featured, slug, created_at, updated_at }.
// The API shape stays identical to the old JSON-file shape: the full `data`
// object merged with the top-level `id` and `featured` columns, so the
// frontend needs zero changes.
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
    const { rows } = await query('SELECT * FROM products ORDER BY id ASC');
    res.json(rows.map(toApi));
});

router.get('/:id', async (req, res) => {
    const { rows } = await query(
        "SELECT * FROM products WHERE id::text = $1 OR slug = $1 LIMIT 1",
        [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found.' });
    res.json(toApi(rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
    const body = req.body || {};
    if (!body.name) return res.status(400).json({ error: 'name is required.' });

    const slug = body.slug || slugify(body.name);
    const data = {
        name: body.name,
        slug,
        category: body.category || '',
        price: body.price || 'Liên hệ',
        image: body.image || '',
        description: body.description || '',
        gallery: Array.isArray(body.gallery) ? body.gallery : [],
        specs: Array.isArray(body.specs) ? body.specs : [],
        features: Array.isArray(body.features) ? body.features : [],
        sourceUrl: body.sourceUrl || '',
    };

    const { rows } = await query(
        'INSERT INTO products (data, featured, slug) VALUES ($1, $2, $3) RETURNING *',
        [JSON.stringify(data), Boolean(body.featured), slug]
    );
    res.status(201).json(toApi(rows[0]));
});

router.put('/:id', requireAuth, async (req, res) => {
    const existingRes = await query('SELECT * FROM products WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!existingRes.rows.length) return res.status(404).json({ error: 'Product not found.' });
    const existing = existingRes.rows[0];

    const body = req.body || {};
    const { id: _ignoreId, featured: bodyFeatured, ...rest } = body;
    const mergedData = { ...existing.data, ...rest };
    const featured = typeof bodyFeatured === 'boolean' ? bodyFeatured : existing.featured;
    const slug = mergedData.slug || existing.slug;

    const { rows } = await query(
        'UPDATE products SET data = $1, featured = $2, slug = $3, updated_at = now() WHERE id = $4 RETURNING *',
        [JSON.stringify(mergedData), featured, slug, existing.id]
    );
    res.json(toApi(rows[0]));
});

router.delete('/:id', requireAuth, async (req, res) => {
    const { rows } = await query('DELETE FROM products WHERE id::text = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found.' });
    res.json(toApi(rows[0]));
});

// Lightweight quick-toggle used by the admin list view's "Nổi bật" switch, so
// it doesn't need to open the full edit form just to flip one boolean.
router.patch('/:id/featured', requireAuth, async (req, res) => {
    const existingRes = await query('SELECT * FROM products WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!existingRes.rows.length) return res.status(404).json({ error: 'Product not found.' });
    const existing = existingRes.rows[0];

    const featured = typeof req.body?.featured === 'boolean' ? req.body.featured : !existing.featured;
    const { rows } = await query(
        'UPDATE products SET featured = $1, updated_at = now() WHERE id = $2 RETURNING *',
        [featured, existing.id]
    );
    res.json(toApi(rows[0]));
});

export default router;
