// Sends an email notification for each contact-form lead, via SMTP creds
// supplied through env vars. Safe to run before those creds exist: it reports
// a `skipped` result instead of throwing, so a lead is never lost to a
// misconfigured mailbox.
import nodemailer from 'nodemailer';

let transporter = null;
let warned = false;

// The `source` field is an internal slug; sales staff read these emails, so
// translate it. Unknown slugs fall through to the raw value rather than being
// hidden — better an ugly label than a lead with no provenance.
const SOURCE_LABELS = {
    landing_simple: 'Form liên hệ trang chủ',
    landing_auto_popup: 'Popup tự động trang chủ',
    landing_product_popup: 'Popup báo giá sản phẩm',
    contact_page: 'Trang Liên hệ',
    news_list_page: 'Trang Tin tức',
    'home-1click-quote': 'Báo giá nhanh trang chủ',
    // Legacy slugs still present in older rows.
    'auto-popup': 'Popup tự động trang chủ',
    'hero-1click-quote': 'Báo giá nhanh banner đầu trang',
};

function sourceLabel(source) {
    if (!source) return 'Website';
    return SOURCE_LABELS[source] || source;
}

function formatTimestamp(date = new Date()) {
    return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

// Digits only — what `tel:` needs, and what staff paste into Zalo.
function dialable(phone) {
    return String(phone || '').replace(/[^\d+]/g, '');
}

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

function buildBody(lead) {
    const when = formatTimestamp();
    const phone = dialable(lead.phone);
    const name = (lead.name || '').trim();

    // Only the fields the customer actually filled in — an email of empty
    // labels is harder to scan than a short one.
    const details = [
        name && ['Họ tên', name],
        ['Số điện thoại', lead.phone],
        lead.topic && ['Nhu cầu', lead.topic],
        lead.productName && ['Xe quan tâm', lead.productName],
        lead.message && ['Nội dung', lead.message],
        lead.note && ['Ghi chú', lead.note],
        ['Gửi từ', sourceLabel(lead.source)],
        ['Thời gian', when],
    ].filter(Boolean);

    const text = [
        'YÊU CẦU LIÊN HỆ MỚI',
        '',
        ...details.map(([k, v]) => `${k}: ${v}`),
        '',
        '— Website Kim Long Motor tự động gửi thông báo này.',
    ].join('\n');

    const rows = details.map(([k, v]) => `
        <tr>
          <td style="padding:7px 14px 7px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td>
          <td style="padding:7px 0;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">${escapeHtml(v)}</td>
        </tr>`).join('');

    const html = `<!doctype html>
<html lang="vi"><body style="margin:0;padding:24px 12px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.12);">
    <tr>
      <td style="background:#dc2626;padding:18px 22px;">
        <div style="color:#ffffff;font-size:17px;font-weight:700;">Yêu cầu liên hệ mới</div>
        <div style="color:rgba(255,255,255,0.82);font-size:13px;margin-top:2px;">${escapeHtml(sourceLabel(lead.source))}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:22px;">
        <a href="tel:${escapeHtml(phone)}" style="display:block;text-align:center;background:#0f172a;color:#ffffff;text-decoration:none;font-size:22px;font-weight:700;letter-spacing:0.5px;padding:14px;border-radius:9px;">
          ${escapeHtml(lead.phone)}
        </a>
        <div style="text-align:center;color:#94a3b8;font-size:12px;margin-top:7px;">Bấm vào số để gọi trực tiếp</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:4px;">
          ${rows}
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:13px 22px;color:#94a3b8;font-size:12px;text-align:center;border-top:1px solid #e2e8f0;">
        Thông báo tự động từ website Kim Long Motor
      </td>
    </tr>
  </table>
</body></html>`;

    const who = name || lead.phone;
    const subject = `[Kim Long] Khách mới: ${who} · ${sourceLabel(lead.source)}`;

    return { text, html, subject };
}

// Resolves to { sent } — `{ sent: false, skipped: true }` when SMTP is
// unconfigured, `{ sent: false, error }` when the send itself failed. Never
// throws, so callers can treat the lead as saved regardless.
export async function sendContactNotification(lead) {
    const t = getTransporter();
    if (!t) return { sent: false, skipped: true, reason: 'smtp_not_configured' };

    const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
    const { text, html, subject } = buildBody(lead);

    try {
        const info = await t.sendMail({
            from: `"Website Kim Long Motor" <${process.env.SMTP_USER}>`,
            to,
            replyTo: process.env.SMTP_USER,
            subject,
            text,
            html,
        });
        console.log(`[Mailer] Contact notification sent to ${to} (${info.messageId})`);
        return { sent: true, messageId: info.messageId };
    } catch (err) {
        console.error(`[Mailer] Failed to send contact notification to ${to}:`, err.code || '', err.message);
        return { sent: false, error: err.message };
    }
}
