import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getContent(key, defaultValue) {
    const { rows } = await query('SELECT value FROM site_content WHERE key = $1 LIMIT 1', [key]);
    if (!rows.length) return defaultValue;
    return rows[0].value ?? defaultValue;
}

async function putContent(key, value) {
    const { rows } = await query(
        `INSERT INTO site_content (key, value, updated_at) VALUES ($1, $2, now())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
         RETURNING value`,
        [key, JSON.stringify(value)]
    );
    return rows[0].value;
}

// Simple GET-by-key + PUT-replace helper for the homepage/site content blocks
// that are single objects or arrays rather than full CRUD collections (they
// mirror the products/articles pattern but keep it minimal since they're
// edited as a whole block, not as individual line items).
function block(key, defaultValue) {
    router.get(`/${key}`, async (req, res) => {
        res.json(await getContent(key, defaultValue));
    });

    router.put(`/${key}`, requireAuth, async (req, res) => {
        res.json(await putContent(key, req.body ?? defaultValue));
    });
}

router.get('/about', async (req, res) => {
    res.json(await getContent('about', { content: '', images: [] }));
});

router.put('/about', requireAuth, async (req, res) => {
    res.json(await putContent('about', req.body || {}));
});

router.get('/contact', async (req, res) => {
    res.json(await getContent('contact', { branches: [] }));
});

router.put('/contact', requireAuth, async (req, res) => {
    res.json(await putContent('contact', req.body || {}));
});

block('heroSlides', []);
block('categoryTiles', []);
block('whyChooseUs', { title: '', items: [] });
block('serviceSteps', { title: '', items: [] });
// testimonials now has full CRUD in routes/testimonials.js (mounted at /api/testimonials).
block('photoStrip', []);
block('showroom', []);
block('footer', { columns: [], socialLinks: [], hotline: '', copyright: '' });
block('homepageProductSections', []);
block('careers', { content: '', images: [] });
block('newsSectionTitle', '');

export default router;
