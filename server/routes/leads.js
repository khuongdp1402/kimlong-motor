import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function toApi(row) {
    return { ...row.data, id: row.id, createdAt: row.created_at };
}

// Public: submit a contact/lead form (contact page, product popup, etc).
router.post('/', async (req, res) => {
    const body = req.body || {};
    if (!body.phone) return res.status(400).json({ error: 'phone is required.' });

    const data = {
        name: body.name || '',
        phone: body.phone,
        topic: body.topic || '',
        message: body.message || '',
        productName: body.productName || '',
        source: body.source || 'contact_page',
    };

    const { rows } = await query('INSERT INTO leads (data) VALUES ($1) RETURNING *', [JSON.stringify(data)]);
    res.status(201).json(toApi(rows[0]));
});

// Admin: list submitted leads.
router.get('/', requireAuth, async (req, res) => {
    const { rows } = await query('SELECT * FROM leads ORDER BY id DESC');
    res.json(rows.map(toApi));
});

export default router;
