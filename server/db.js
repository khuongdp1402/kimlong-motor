// Postgres connection + schema bootstrap with local JSON fallback.
import './loadEnv.js';
import pg from 'pg';
import { localQuery } from './localStore.js';

const { Pool } = pg;

const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

let usePostgres = false;
export let pool = null;

if (connectionString) {
    try {
        pool = new Pool({
            connectionString,
            ssl: connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : undefined,
            connectionTimeoutMillis: 3000,
        });

        // Prevent unhandled 'error' event from crashing the Node.js process when an idle client is disconnected
        pool.on('error', (err) => {
            console.error('[DB] Postgres pool error on idle client:', err.message);
        });
    } catch (err) {
        console.warn('[DB] Failed to initialize Postgres pool:', err.message);
    }
}

export async function query(text, params = []) {
    if (usePostgres && pool) {
        try {
            return await pool.query(text, params);
        } catch (err) {
            console.warn('[DB] Postgres query failed, falling back to local store:', err.message);
            return localQuery(text, params);
        }
    }
    return localQuery(text, params);
}

// Idempotent schema creation — safe to run on every boot.
export async function ensureSchema() {
    if (!pool) {
        console.log('[DB] No Postgres connection string provided. Using local JSON store.');
        usePostgres = false;
        return;
    }

    try {
        // Quick probe to test if Postgres is responding
        const probeClient = await Promise.race([
            pool.connect(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Postgres connection timed out (3s)')), 3000)
            ),
        ]);

        probeClient.release();

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                featured BOOLEAN NOT NULL DEFAULT false,
                slug TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
            CREATE INDEX IF NOT EXISTS idx_products_featured ON products (featured);

            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                featured BOOLEAN NOT NULL DEFAULT false,
                slug TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
            CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles (featured);

            CREATE TABLE IF NOT EXISTS testimonials (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );

            CREATE TABLE IF NOT EXISTS site_content (
                key TEXT PRIMARY KEY,
                value JSONB NOT NULL,
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
        `);

        usePostgres = true;
        console.log('[DB] Connected to PostgreSQL successfully.');
    } catch (err) {
        console.warn(`[DB] PostgreSQL not reachable (${err.message}). Using local JSON store.`);
        usePostgres = false;
    }
}
