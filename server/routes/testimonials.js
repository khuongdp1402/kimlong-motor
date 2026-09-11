import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function toApi(row) {
    return { ...row.data, id: row.id };
}

router.get('/', async (req, res) => {
    const { rows } = await query('SELECT * FROM testimonials ORDER BY id ASC');
    res.json(rows.map(toApi));
});

router.get('/:id', async (req, res) => {
    const { rows } = await query('SELECT * FROM testimonials WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json(toApi(rows[0]));
});

router.post('/', requireAuth, async (req, res) => {
    const body = req.body || {};
    if (!body.name) return res.status(400).json({ error: 'name is required.' });

    const data = {
        name: body.name,
        subtitle: body.subtitle || '',
        quote: body.quote || '',
        score: body.score || '5/5',
        avatar: body.avatar || '',
    };

    const { rows } = await query(
        'INSERT INTO testimonials (data) VALUES ($1) RETURNING *',
        [JSON.stringify(data)]
    );
    res.status(201).json(toApi(rows[0]));
});

router.put('/:id', requireAuth, async (req, res) => {
    const existingRes = await query('SELECT * FROM testimonials WHERE id::text = $1 LIMIT 1', [req.params.id]);
    if (!existingRes.rows.length) return res.status(404).json({ error: 'Testimonial not found.' });
    const existing = existingRes.rows[0];

    const body = req.body || {};
    const { id: _ignoreId, ...rest } = body;
    const mergedData = { ...existing.data, ...rest };

    const { rows } = await query(
        'UPDATE testimonials SET data = $1, updated_at = now() WHERE id = $2 RETURNING *',
        [JSON.stringify(mergedData), existing.id]
    );
    res.json(toApi(rows[0]));
});

router.delete('/:id', requireAuth, async (req, res) => {
    const { rows } = await query('DELETE FROM testimonials WHERE id::text = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Testimonial not found.' });
    res.json(toApi(rows[0]));
});

export default router;
