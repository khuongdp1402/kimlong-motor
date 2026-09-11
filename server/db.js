// Postgres connection + schema bootstrap.
// Uses the standard `pg` driver against the POSTGRES_URL (or DATABASE_URL)
// connection string that Vercel injects when a Postgres/Neon store is
// connected to this project (via `vercel env pull` locally, or automatically
// in Vercel's runtime).
import pg from 'pg';

const { Pool } = pg;

const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
    throw new Error(
        'No Postgres connection string found. Set POSTGRES_URL (or DATABASE_URL) — ' +
        'run `vercel env pull` after connecting a Postgres store to this project.'
    );
}

export const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
});

export async function query(text, params) {
    return pool.query(text, params);
}

// Idempotent schema creation — safe to run on every boot.
export async function ensureSchema() {
    await query(`
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

        -- Singleton-ish key/value store for the rest of the site content:
        -- heroSlides, categoryTiles, whyChooseUs, serviceSteps, photoStrip,
        -- about, careers, contact, showroom, footer, homepageProductSections,
        -- newsSectionTitle, scrapedAt, source.
        CREATE TABLE IF NOT EXISTS site_content (
            key TEXT PRIMARY KEY,
            value JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    `);
}
