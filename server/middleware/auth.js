// Minimal token-based auth. POST /api/auth/login checks the password against
// ADMIN_PASSWORD and issues an opaque bearer token; this middleware requires
// that token on the Authorization header for any mutating request.
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kimlong2026';

// Tokens are kept in-memory only (no DB) — they reset when the server
// restarts, which is fine for this small single-admin tool.
const activeTokens = new Set();

export function login(password) {
    if (password !== ADMIN_PASSWORD) {
        return null;
    }
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.add(token);
    return token;
}

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token || !activeTokens.has(token)) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    next();
}

export { ADMIN_PASSWORD };
