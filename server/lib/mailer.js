// Sends an email notification for each contact-form lead, via SMTP creds
// supplied through env vars. Safe to run before those creds exist: it reports
// a `skipped` result instead of throwing, so a lead is never lost to a
// misconfigured mailbox.
import nodemailer from 'nodemailer';

let transporter = null;
let warned = false;

function getTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        if (!warned) {
            const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter((k) => !process.env[k]);
            console.warn(`[Mailer] SMTP not configured (missing: ${missing.join(', ')}) — contact emails will NOT be sent.`);
            warned = true;
        }
        return null;
    }
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: SMTP_USER, pass: SMTP_PASS },
            // Bound every stage of the handshake: the caller awaits this before
            // answering the form, so a hanging SMTP server must not hang the POST.
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 10_000,
        });
    }
    return transporter;
}

// Resolves to { sent } — `{ sent: false, skipped: true }` when SMTP is
// unconfigured, `{ sent: false, error }` when the send itself failed. Never
// throws, so callers can treat the lead as saved regardless.
export async function sendContactNotification(lead) {
    const t = getTransporter();
    if (!t) return { sent: false, skipped: true, reason: 'smtp_not_configured' };

    const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    const lines = [
        `Họ tên: ${lead.name || '(không có)'}`,
        `Số điện thoại: ${lead.phone}`,
        lead.topic ? `Vấn đề: ${lead.topic}` : null,
        lead.productName ? `Sản phẩm quan tâm: ${lead.productName}` : null,
        lead.note ? `Ghi chú: ${lead.note}` : null,
        lead.message ? `Nội dung: ${lead.message}` : null,
        `Nguồn: ${lead.source || 'website'}`,
    ].filter(Boolean);

    try {
        const info = await t.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `[Kim Long Motor] Liên hệ mới từ ${lead.name || lead.phone}`,
            text: lines.join('\n'),
        });
        console.log(`[Mailer] Contact notification sent to ${to} (${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error(`[Mailer] Failed to send contact notification to ${to}:`, err.code || '', err.message);
        return { sent: false, error: err.message };
    }
}
