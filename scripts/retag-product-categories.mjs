// One-off migration: move every product from the old scraped taxonomy
// (xe-khach / xe-tai / xe-van / xe-bus / xe-dien) onto the five slugs the
// landing page's category tabs actually use.
//
// Until now the tabs guessed, via a name heuristic in src/data/landingCategories.js.
// The guess was wrong in a visible way — model codes like B30/B40 made the
// electric city buses look like sleeper coaches — and left "Xe Đầu Kéo"
// permanently empty. After this runs, `category` holds the real slug and the
// heuristic can go.
//
// Dry run by default. Pass --apply to write. The previous value is kept in
// `legacyCategory` so this is reversible.
import { query, ensureSchema } from '../server/db.js';

const APPLY = process.argv.includes('--apply');

// Order matters: the first rule that matches wins.
const RULES = [
    { slug: 'giuong-nam', test: (p) => /giường nằm/i.test(p.name) },
    { slug: 'dau-keo', test: (p) => /đầu kéo/i.test(p.name) },
    { slug: 'tai', test: (p) => p.category === 'xe-tai' },
    // Cargo bodies. Both vans state their volume as "Thùng Hàng N M3"; no
    // passenger minibus does, so this separates them without guessing.
    { slug: 'van', test: (p) => /thùng hàng/i.test(p.name) },
    // Everything else carries seated passengers: the coaches, the 10-16 seat
    // minibuses, and the electric city buses.
    { slug: 'ghe-ngoi', test: () => true },
];

const LABELS = {
    'giuong-nam': 'Xe Giường Nằm',
    'ghe-ngoi': 'Xe Ghế Ngồi',
    van: 'Xe Van',
    tai: 'Xe Tải',
    'dau-keo': 'Xe Đầu Kéo',
};

function classify(product) {
    return RULES.find((r) => r.test(product)).slug;
}

async function main() {
    await ensureSchema();
    const { rows } = await query('SELECT id, data FROM products ORDER BY id');

    const plan = rows.map((row) => ({
        id: row.id,
        name: row.data.name,
        from: row.data.category || '(trống)',
        to: classify(row.data),
        alreadyDone: Boolean(row.data.legacyCategory),
    }));

    const byTarget = {};
    for (const slug of Object.keys(LABELS)) byTarget[slug] = [];
    for (const p of plan) byTarget[p.to].push(p);

    console.log(APPLY ? '=== GHI VÀO DB ===\n' : '=== DRY RUN — chưa ghi gì vào DB ===\n');
    for (const [slug, label] of Object.entries(LABELS)) {
        const items = byTarget[slug];
        console.log(`${label} (${slug}) — ${items.length} sản phẩm`);
        for (const p of items) {
            console.log(`   #${String(p.id).padStart(2)}  ${p.from.padEnd(9)} -> ${slug.padEnd(11)} ${p.name}`);
        }
        console.log('');
    }

    console.log('--- Tổng kết ---');
    for (const [slug, label] of Object.entries(LABELS)) {
        console.log(`${label.padEnd(16)} ${String(byTarget[slug].length).padStart(3)}`);
    }
    console.log(`${'TỔNG'.padEnd(16)} ${String(plan.length).padStart(3)}`);

    const rerun = plan.filter((p) => p.alreadyDone).length;
    if (rerun) console.log(`\nLưu ý: ${rerun} sản phẩm đã có legacyCategory — script này đã chạy trước đó.`);

    if (!APPLY) {
        console.log('\nChạy lại với --apply để ghi thật.');
        return;
    }

    let written = 0;
    for (const p of plan) {
        const { rows: cur } = await query('SELECT data FROM products WHERE id = $1', [p.id]);
        if (!cur.length) continue;
        const data = cur[0].data;
        // Only record the legacy value the first time, so re-running cannot
        // overwrite the original with an already-migrated slug.
        const next = {
            ...data,
            category: p.to,
            legacyCategory: data.legacyCategory ?? (data.category || ''),
        };
        await query('UPDATE products SET data = $1, updated_at = now() WHERE id = $2', [JSON.stringify(next), p.id]);
        written++;
    }
    console.log(`\nĐã cập nhật ${written} sản phẩm.`);
}

main().then(
    () => process.exit(0),
    (err) => {
        console.error('Migration thất bại:', err.message);
        process.exit(1);
    }
);
