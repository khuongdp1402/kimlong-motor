// Sends an email notification for each contact-form lead, via SMTP creds
// supplied through env vars. Safe to run before those creds exist: it just
// logs a warning and no-ops instead of throwing.
import nodemailer from 'nodemailer';

let transporter = null;
let warned = false;

function getTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        if (!warned) {
            console.warn('[Mailer] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing) — contact emails will not be sent.');
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
        });
    }
    return transporter;
}

export async function sendContactNotification(lead) {
    const t = getTransporter();
    if (!t) return;

    const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    const lines = [
        `Họ tên: ${lead.name || '(không có)'}`,
        `Số điện thoại: ${lead.phone}`,
        lead.topic ? `Vấn đề: ${lead.topic}` : null,
        lead.productName ? `Sản phẩm quan tâm: ${lead.productName}` : null,
        lead.message ? `Nội dung: ${lead.message}` : null,
        `Nguồn: ${lead.source || 'website'}`,
    ].filter(Boolean);

    try {
        await t.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `[Kim Long Motor] Liên hệ mới từ ${lead.name || lead.phone}`,
            text: lines.join('\n'),
        });
    } catch (err) {
        console.error('[Mailer] Failed to send contact notification:', err.message);
    }
}
