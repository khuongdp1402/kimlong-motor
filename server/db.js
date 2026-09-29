// Postgres connection + schema bootstrap. The local JSON store is a
// development convenience for running with no database at all — it is NOT a
// fallback for a configured database that happens to be unreachable. Writing
// there instead would return 201 for a lead that only exists on a serverless
// instance's scratch disk, and vanish when that instance is recycled.
import './loadEnv.js';
import pg from 'pg';
import { localQuery } from './localStore.js';

const { Pool } = pg;

const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

// A database is *expected* whenever a connection string is configured. That is
// the switch that decides whether an unreachable Postgres is a fatal error or
// simply "running without a DB".
const HAS_DB = Boolean(connectionString);

let usePostgres = false;
export let pool = null;

if (connectionString) {
    try {
        pool = new Pool({
            connectionString,
            ssl: connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : undefined,
            // Generous on purpose: a serverless cold start against a suspended
            // Neon branch routinely needs more than a couple of seconds.
            connectionTimeoutMillis: 15000,
        });

        // Prevent unhandled 'error' event from crashing the Node.js process when an idle client is disconnected
        pool.on('error', (err) => {
            console.error('[DB] Postgres pool error on idle client:', err.message);
        });
    } catch (err) {
        console.error('[DB] Failed to initialize Postgres pool:', err.message);
    }
}

export async function query(text, params = []) {
    if (!HAS_DB) return localQuery(text, params);

    // Cheap once warm, and it means a cold start that lost the initial probe
    // race still gets a working connection rather than a silent downgrade.
    await ensureSchema();

    try {
        return await pool.query(text, params);
    } catch (err) {
        // One retry: Neon drops idle connections, and a pooled client handed
        // out just as that happens fails on first use but works on the next.
        if (isTransient(err)) {
            console.warn('[DB] Transient Postgres error, retrying once:', err.message);
            return await pool.query(text, params);
        }
        throw err;
    }
}

function isTransient(err) {
    const code = err?.code || '';
    return (
        code === 'ECONNRESET' ||
        code === 'ETIMEDOUT' ||
        code === 'ECONNREFUSED' ||
        code === '57P01' || // admin_shutdown
        code === '08006' || // connection_failure
        code === '08003' || // connection_does_not_exist
        /Connection terminated|socket hang up/i.test(err?.message || '')
    );
}

// In-flight/completed bootstrap. Memoised so concurrent requests share one
// probe, but dropped on failure so the next request retries instead of the
// instance staying wedged for its whole lifetime.
let bootstrap = null;

// Idempotent schema creation — safe to run on every boot/request.
export async function ensureSchema() {
    if (usePostgres) return;
    if (!pool) {
        console.log('[DB] No Postgres connection string provided. Using local JSON store.');
        usePostgres = false;
        return;
    }
    if (!bootstrap) {
        bootstrap = bootstrapSchema().catch((err) => {
            bootstrap = null;
            throw err;
        });
    }
    return bootstrap;
}

async function bootstrapSchema() {
    const PROBE_TIMEOUT_MS = 15000;
    try {
        // Probe to check Postgres is actually answering before we rely on it.
        const probeClient = await Promise.race([
            pool.connect(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Postgres connection timed out (${PROBE_TIMEOUT_MS / 1000}s)`)), PROBE_TIMEOUT_MS)
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
        // Deliberately rethrown. A configured-but-unreachable database must
        // surface as a 5xx so the visitor is told to call instead — silently
        // writing the lead to a throwaway JSON file loses the customer.
        usePostgres = false;
        console.error(`[DB] PostgreSQL not reachable (${err.message}). Requests will fail rather than write to the throwaway local store.`);
        throw err;
    }
}
