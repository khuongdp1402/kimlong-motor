// Minimal token auth for the single-admin tool. POST /api/auth/login checks the
// password against ADMIN_PASSWORD and issues a signed bearer token; this
// middleware requires that token on the Authorization header for any mutating
// request.
//
// Tokens are STATELESS on purpose. They used to live in an in-memory Set, which
// cannot work on serverless: each Vercel instance has its own memory, so a
// token minted by one instance was rejected by every other one — uploads and
// saves failed with a random "Unauthorized", and every cold start silently
// logged the admin out. A signed token carries its own proof, so any instance
// can verify it without shared storage.
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kimlong2026';

// A year. This is a personal site with one admin; the cost of re-entering the
// password is real and the benefit of expiring sooner is not.
const TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;

// Derived from the password, so changing ADMIN_PASSWORD invalidates every
// outstanding token for free — and no extra env var is needed on Vercel.
function signingKey() {
    return crypto.createHash('sha256').update(`kimlong-admin-session:${ADMIN_PASSWORD}`).digest();
}

function sign(body) {
    return crypto.createHmac('sha256', signingKey()).update(body).digest('base64url');
}

export function login(password) {
    // Constant-time compare so the password cannot be recovered by timing.
    const given = Buffer.from(String(password ?? ''), 'utf8');
    const expected = Buffer.from(ADMIN_PASSWORD, 'utf8');
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
        return null;
    }
    const body = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS }), 'utf8').toString('base64url');
    return `${body}.${sign(body)}`;
}

export function verifyToken(token) {
    if (typeof token !== 'string') return false;
    const dot = token.lastIndexOf('.');
    if (dot < 1) return false;

    const body = token.slice(0, dot);
    const given = Buffer.from(token.slice(dot + 1), 'utf8');
    const expected = Buffer.from(sign(body), 'utf8');
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;

    try {
        const { exp } = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        return typeof exp === 'number' && Date.now() < exp;
    } catch {
        return false;
    }
}

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!verifyToken(token)) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
}

export { ADMIN_PASSWORD };
