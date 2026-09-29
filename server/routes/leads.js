import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { sendContactNotification } from '../lib/mailer.js';

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
        note: body.note || '',
        productName: body.productName || '',
        source: body.source || 'contact_page',
    };

    let rows;
    try {
        ({ rows } = await query('INSERT INTO leads (data) VALUES ($1) RETURNING *', [JSON.stringify(data)]));
    } catch (err) {
        // The lead could not be stored. Still try to email it — an inbox is a
        // perfectly good record — but tell the visitor plainly, because a
        // cheerful "đã gửi" over a dropped enquiry is the worst outcome here.
        console.error('[Leads] Failed to store lead:', err.message, JSON.stringify(data));
        const mail = await sendContactNotification(data);
        if (mail.sent) {
            console.warn('[Leads] Lead was not stored but the notification email went out.');
            return res.status(201).json({ ...data, id: null, emailSent: true, stored: false });
        }
        return res.status(503).json({
            error: 'Hệ thống đang tạm thời quá tải, chưa ghi nhận được yêu cầu của bạn. Vui lòng gọi hotline để được hỗ trợ ngay.',
        });
    }

    // Awaited BEFORE responding on purpose. On serverless (Vercel) the function
    // can be frozen the moment a response is flushed, which silently kills an
    // in-flight SMTP handshake — so the send has to finish inside the request.
    // sendContactNotification never throws and caps itself at ~10s.
    const mail = await sendContactNotification(data);
    if (!mail.sent) {
        console.error(`[Leads] Lead #${rows[0].id} saved but no email sent (${mail.reason || mail.error}).`);
    }

    res.status(201).json({ ...toApi(rows[0]), emailSent: mail.sent, stored: true });
});

// Admin: list submitted leads.
router.get('/', requireAuth, async (req, res) => {
    const { rows } = await query('SELECT * FROM leads ORDER BY id DESC');
    res.json(rows.map(toApi));
});

export default router;
