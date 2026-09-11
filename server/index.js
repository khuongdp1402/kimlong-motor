import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenvLoad from './loadEnv.js';

dotenvLoad();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import articleRoutes from './routes/articles.js';
import contentRoutes from './routes/content.js';
import leadRoutes from './routes/leads.js';
import testimonialRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';
import { ensureSchema } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Idempotent — safe to run on every boot/cold-start (local dev and
// serverless alike).
let schemaReady = ensureSchema().catch((err) => {
    console.error('Failed to ensure Postgres schema:', err);
    throw err;
});
app.use(async (req, res, next) => {
    try {
        await schemaReady;
        next();
    } catch (err) {
        next(err);
    }
});

app.use(cors());
app.use(express.json({ limit: '5mb' }));
// Serve uploaded images directly from the API server too (Vite already serves
// public/ in dev, but this keeps /images/* reachable if the API is hit on its
// own port or in a prod deployment where Vite isn't in front of it).
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', contentRoutes); // /api/about, /api/contact, /api/heroSlides, etc.

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
});

// Only bind to a port when this file is run directly (`npm run server`,
// `npm run dev:all`) — i.e. local dev's long-lived Express process. When
// imported by the Vercel Function entry (api/index.js) for serverless, the
// app is exported instead and Vercel handles the request/response lifecycle
// itself, so listen() must not run there.
const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
    app.listen(PORT, () => {
        console.log(`Kim Long admin API listening on http://localhost:${PORT}`);
    });
}

export default app;
