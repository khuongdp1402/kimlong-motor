// Playwright smoke checks for the public site. Requires the API (:4000) and
// Vite (:5173) dev servers to be running. Uses the system Microsoft Edge so no
// Playwright browser download is needed.
import { chromium } from 'playwright';

const BASE = process.env.SMOKE_BASE || 'http://localhost:5173';
const FORBIDDEN = [/Miền Nam Auto/i, /Kim Long Miền Nam/i, /Miền Nam Group/i, /Hồng Thương/i, /MIỀN NAM AUTO/];

// forbiddenScope: 'all' = whole body text, 'chrome' = body text minus
// elements marked [data-cms-content] (CMS-authored copy we don't rewrite).
const PAGES = [
    { path: '/', forbiddenScope: 'chrome', checkSections: true },
    { path: '/category/all', forbiddenScope: 'all' },
    { path: '/news', forbiddenScope: 'chrome' },
    { path: '/lien-he', forbiddenScope: 'chrome' },
    { path: '/gioi-thieu', forbiddenScope: 'chrome' },
];

const failures = [];
const fail = (msg) => { failures.push(msg); console.log(`  ✗ ${msg}`); };
const pass = (msg) => console.log(`  ✓ ${msg}`);

async function scrollThrough(page) {
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 500) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
}

async function checkForbidden(page, scope, label) {
    const text = await page.evaluate((s) => {
        const clone = document.body.cloneNode(true);
        if (s === 'chrome') clone.querySelectorAll('[data-cms-content]').forEach((el) => el.remove());
        return clone.innerText;
    }, scope);
    const hits = FORBIDDEN.filter((re) => re.test(text)).map(String);
    if (hits.length) fail(`${label}: forbidden brand strings ${hits.join(', ')}`);
    else pass(`${label}: no forbidden brand strings`);
}

// Every <main> > section must have a visible heading once scrolled into view.
async function checkSections(page, label) {
    const count = await page.locator('main > section').count();
    for (let i = 0; i < count; i++) {
        const section = page.locator('main > section').nth(i);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1300);
        const result = await section.evaluate((sec) => {
            const id = sec.id || `#${[...sec.parentNode.children].indexOf(sec)}`;
            // Carousels (e.g. the fade hero) keep inactive slides' headings at
            // opacity 0, so judge the most visible heading in the section.
            const headings = [...sec.querySelectorAll('h1, h2, h3')];
            if (!headings.length) return { id, ok: false, why: 'no heading' };
            const scored = headings.map((h) => {
                let opacity = 1;
                for (let el = h; el && el !== sec.parentNode; el = el.parentElement) {
                    opacity *= parseFloat(getComputedStyle(el).opacity);
                }
                return { opacity, height: h.getBoundingClientRect().height };
            });
            const best = scored.reduce((a, b) => (b.opacity > a.opacity ? b : a));
            return {
                id,
                ok: best.opacity >= 0.9 && best.height > 0,
                why: `opacity=${best.opacity.toFixed(2)} h=${Math.round(best.height)}`,
            };
        });
        if (result.ok) pass(`${label}: section ${result.id} heading visible`);
        else fail(`${label}: section ${result.id} heading not visible (${result.why})`);
    }
}

async function runPage(browser, { path, forbiddenScope, checkSections: doSections }, contextOptions, label, theme) {
    const context = await browser.newContext(contextOptions);
    if (theme) {
        await context.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* ignore */ } }, theme);
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
        if (msg.type() === 'error' && !/Failed to load resource/i.test(msg.text())) errors.push(msg.text());
    });
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await scrollThrough(page);

    if (errors.length) fail(`${label}: console errors: ${errors.slice(0, 3).join(' | ')}`);
    else pass(`${label}: no console errors`);

    await checkForbidden(page, forbiddenScope, label);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) fail(`${label}: horizontal overflow ${overflow}px`);
    else pass(`${label}: no horizontal overflow`);

    if (doSections) await checkSections(page, label);
    await context.close();
}

const browser = await chromium.launch({ channel: 'msedge' });
try {
    for (const p of PAGES) {
        console.log(`\n${p.path} @1440`);
        await runPage(browser, p, { viewport: { width: 1440, height: 900 } }, `${p.path} desktop`);
    }
    console.log('\n/ @390 (mobile)');
    await runPage(browser, PAGES[0], { viewport: { width: 390, height: 844 }, isMobile: true }, '/ mobile');
    console.log('\n/ reduced motion');
    await runPage(browser, PAGES[0], { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, '/ reduced-motion');
    for (const p of PAGES) {
        console.log(`\n${p.path} light mode`);
        await runPage(browser, p, { viewport: { width: 1440, height: 900 } }, `${p.path} light`, 'light');
    }
} finally {
    await browser.close();
}

if (failures.length) {
    console.log(`\n${failures.length} CHECK(S) FAILED`);
    process.exit(1);
}
console.log('\nALL CHECKS PASSED');
