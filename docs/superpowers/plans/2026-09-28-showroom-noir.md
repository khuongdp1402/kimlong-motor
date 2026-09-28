# Showroom Noir Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Kim Long Motor public site into one cohesive dark "automotive showroom" experience with scroll-driven fade in/out animation, and carry the same system to every public sub-page.

**Architecture:** Design tokens live in Tailwind v4 `@theme` (`src/index.css`). A small set of GSAP-based motion primitives (`src/components/motion/*`) is the only place animation code lives; sections compose them. Public routes run with `<html class="dark">` forced on (admin routes stay light), and Tailwind's `gray-950/900/800` are remapped to the noir scale so the existing `dark:` variants on sub-pages instantly adopt the new palette; only hero blocks and brand strings on sub-pages need hand edits.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4 (CSS-first config), Swiper 12, GSAP 3.15 (ScrollTrigger, SplitText) + `@gsap/react`, Lenis 1.3, lucide-react. Verification via a Playwright smoke script driving the system Edge browser.

**Spec:** `docs/superpowers/specs/2026-09-28-showroom-noir-design.md`

## Global Constraints

- Palette (exact): `noir-950 #0A0B0D`, `noir-900 #111317`, `graphite-800 #1A1D23`, `line rgba(255,255,255,0.08)`, `ink #F4F5F7`, `ink-muted #9AA1AC`, `accent #D91C24`, `paper #F6F5F2`.
- `accent` is only for primary CTAs, section numbers and underlines — never a large background block.
- Font: Plus Jakarta Sans. Headings sentence case; only eyebrows (11–12px, wide tracking) are uppercase. Max 3 type levels per section.
- Buttons: exactly two variants — Primary (red pill + arrow in circle) and Ghost (1px hairline border, white text).
- Every animation must render fully visible static content under `prefers-reduced-motion: reduce`.
- Initial hidden states are set by GSAP at runtime, never by CSS, so content is visible if JS/animation does not run.
- Brand name shown in UI is always "Kim Long Motor". Strings "Miền Nam Auto", "Kim Long Miền Nam", "Miền Nam Group", "Hồng Thương" must not appear in UI chrome.
- Do NOT write to the production Postgres database. CMS content (article bodies/excerpts/titles, about-page body, testimonial quotes) stays untouched in this plan.
- Every element that renders text coming from the API/CMS carries a `data-cms-content` attribute. The smoke script excludes those elements from the brand-string check (scope `chrome`). If a forbidden string still shows up: hardcoded in JSX → fix the string; comes from API data → add `data-cms-content` to the rendering element.
- Admin routes (`/admin/*`) keep their current look.
- Vietnamese UI copy.

## How to run things

Servers (two terminals, repo root):

```bash
node --env-file=.env server/index.js   # API on :4000
npm run dev                            # Vite on :5173
```

(`npm run server` currently fails because `server/index.js` evaluates `db.js` before `loadEnv()` runs — out of scope; use the command above.)

Checks used by every task:

```bash
npx eslint src/                        # expect: no errors in files you touched
npm run build                          # expect: "✓ built in"
node scripts/ui-smoke.mjs              # expect: final line "ALL CHECKS PASSED"
```

Smoke script prerequisites: both servers running; Microsoft Edge installed (Windows 11 default). It uses `channel: 'msedge'`, so no Playwright browser download is needed.

## File map

| File | Status | Responsibility |
|---|---|---|
| `scripts/ui-smoke.mjs` | create | Playwright smoke checks (forbidden strings, section visibility, console errors, overflow, reduced motion) |
| `src/index.css` | modify | noir tokens, gray remap, restore `dark` custom variant, marquee + hero keyframes; later drop dead light-theme utilities |
| `src/hooks/useRouteTheme.js` | create | force `.dark` on public routes, remove on `/admin` |
| `src/components/motion/gsap.js` | create | single place that registers GSAP plugins |
| `src/components/motion/SmoothScroll.jsx` | create | Lenis ↔ ScrollTrigger wiring, route-change scroll reset, refresh on layout change |
| `src/components/motion/Reveal.jsx` | create | bidirectional fade/translate wrapper |
| `src/components/motion/SplitHeading.jsx` | create | masked line-by-line heading reveal |
| `src/components/motion/ImageReveal.jsx` | create | clip-path + scale image reveal |
| `src/components/motion/Counter.jsx` | create | rolling number |
| `src/components/ui/SectionHeader.jsx` | create | number + eyebrow + heading + intro |
| `src/components/ui/Buttons.jsx` | create | `PrimaryButton`, `GhostButton` |
| `src/components/PageHero.jsx` | create | shared noir hero for sub-pages |
| `src/components/WhyKimLong.jsx` | create | home section 04 |
| `src/components/CustomerStories.jsx` | create | home section 05 |
| `src/main.jsx` | modify | drop ThemeProvider |
| `src/App.jsx` | modify | SmoothScroll, route theme, new home section order |
| `src/components/Navbar.jsx` | modify | remove duplicate wordmark, new anchor id |
| `src/components/HeroSlider.jsx` | modify | line reveal + slow zoom |
| `src/components/BrandIntro.jsx` | rewrite | home section 01 |
| `src/components/VehicleShowcase.jsx` | rewrite | home section 02 (GSAP pin) |
| `src/components/VehicleCatalogSection.jsx` | rewrite | home section 03 (stage cards) |
| `src/components/NewsViral.jsx` | rewrite | home section 06 |
| `src/components/QuoteFormSection.jsx` | rewrite (markup only) | cinematic CTA |
| `src/components/Footer.jsx` | rewrite | noir footer + oversized wordmark |
| `src/pages/*.jsx` (5 files) | modify | PageHero, brand strings, article body on paper |
| `src/components/{WhyChooseUs,RealVideoSection,Testimonials,AboutHongThuong,CategoryTiles,FeaturedProducts}.jsx`, `src/context/ThemeContext.jsx`, `src/hooks/useScrollAnimation.js` | delete | superseded / unused |

---

### Task 1: Smoke test harness, dependencies, tokens, theme routing, motion primitives

**Files:**
- Create: `scripts/ui-smoke.mjs`, `src/hooks/useRouteTheme.js`, `src/components/motion/gsap.js`, `src/components/motion/SmoothScroll.jsx`, `src/components/motion/Reveal.jsx`, `src/components/motion/SplitHeading.jsx`, `src/components/motion/ImageReveal.jsx`, `src/components/motion/Counter.jsx`, `src/components/ui/SectionHeader.jsx`, `src/components/ui/Buttons.jsx`
- Modify: `package.json` (deps), `src/index.css` (top of file), `src/main.jsx`, `src/App.jsx`
- Delete: `src/context/ThemeContext.jsx`

**Interfaces:**
- Produces:
  - `useRouteTheme(): void`
  - `import { gsap, ScrollTrigger, SplitText, useGSAP } from './gsap'` (path relative to `src/components/motion/`)
  - `<SmoothScroll />` (renders null)
  - `<Reveal as="div" y={24} delay={0} className>` children
  - `<SplitHeading as="h2" className>` text children (string)
  - `<ImageReveal src alt className imgClassName />`
  - `<Counter to={number} suffix="" className />`
  - `<SectionHeader number="01" eyebrow="…" title="…" intro="…" align="left|center" />`
  - `<PrimaryButton as="button|a" href onClick className>` children; `<GhostButton …same props>`
  - Tailwind utilities: `bg-noir-950`, `bg-noir-900`, `bg-graphite-800`, `bg-graphite-700`, `border-line`, `text-ink`, `text-ink-muted`, `text-accent`, `bg-accent`, `bg-accent-dark`, `bg-paper`, `animate-marquee`, `animate-ken-burns`, `animate-line-up`

- [ ] **Step 1: Write the smoke script**

Create `scripts/ui-smoke.mjs`:

```js
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
            const heading = sec.querySelector('h1, h2, h3');
            if (!heading) return { id: sec.id || `#${[...sec.parentNode.children].indexOf(sec)}`, ok: false, why: 'no heading' };
            let opacity = 1;
            for (let el = heading; el && el !== sec.parentNode; el = el.parentElement) {
                opacity *= parseFloat(getComputedStyle(el).opacity);
            }
            const box = heading.getBoundingClientRect();
            return {
                id: sec.id || `#${[...sec.parentNode.children].indexOf(sec)}`,
                ok: opacity >= 0.9 && box.height > 0,
                why: `opacity=${opacity.toFixed(2)} h=${Math.round(box.height)}`,
            };
        });
        if (result.ok) pass(`${label}: section ${result.id} heading visible`);
        else fail(`${label}: section ${result.id} heading not visible (${result.why})`);
    }
}

async function runPage(browser, { path, forbiddenScope, checkSections: doSections }, contextOptions, label) {
    const context = await browser.newContext(contextOptions);
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
} finally {
    await browser.close();
}

if (failures.length) {
    console.log(`\n${failures.length} CHECK(S) FAILED`);
    process.exit(1);
}
console.log('\nALL CHECKS PASSED');
```

- [ ] **Step 2: Run the smoke script against the current site — expect FAIL**

Start both servers (see "How to run things"), then:

Run: `node scripts/ui-smoke.mjs`
Expected: exits 1. Among the failures: `/ desktop: forbidden brand strings /Miền Nam Auto/i …` (from the "Vì sao chọn" section) and `/ desktop: section news heading not visible (opacity=0.00 …)` (the NewsViral ref bug). Record the full failure list in the task report — later tasks should shrink it to zero.

- [ ] **Step 3: Install dependencies**

Run: `npm install gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.26`
Expected: `added N packages`, `package.json` lists all three under `dependencies`.

- [ ] **Step 4: Replace the top of `src/index.css` (from line 1 through the end of the `@layer base { … }` block) with:**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "lenis/dist/lenis.css";

/* `dark:` utilities follow a `.dark` class on <html> (set per route by
   src/hooks/useRouteTheme.js: public pages dark, admin light) instead of the
   OS preference. */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;

  /* Showroom Noir palette */
  --color-noir-950: #0A0B0D;
  --color-noir-900: #111317;
  --color-graphite-800: #1A1D23;
  --color-graphite-700: #252A32;
  --color-line: rgba(255, 255, 255, 0.08);
  --color-ink: #F4F5F7;
  --color-ink-muted: #9AA1AC;
  --color-accent: #D91C24;
  --color-accent-dark: #B91218;
  --color-paper: #F6F5F2;

  /* Remap the darkest Tailwind grays onto the noir scale so the existing
     `dark:bg-gray-900/800` classes on sub-pages adopt the new palette. In
     light (admin) mode these grays are only used as near-black text, where
     the shift is imperceptible. */
  --color-gray-950: #0A0B0D;
  --color-gray-900: #111317;
  --color-gray-800: #1A1D23;

  /* Legacy light tokens — still referenced until Task 12 removes them. */
  --color-brand-bg: #FAFAFC;
  --color-brand-surface: #F8FAFC;
  --color-brand-border: #E2E8F0;
  --color-brand-primary: #D91C24;
  --color-brand-primary-dark: #B91218;
  --color-brand-text: #0F172A;
  --color-brand-muted: #475569;
  --radius-brand-sm: 12px;
  --radius-brand-lg: 16px;
  --shadow-brand-soft: 0 10px 30px -10px rgba(0, 0, 0, 0.05);
  --shadow-brand-lifted: 0 20px 40px -12px rgba(0, 0, 0, 0.12);

  --animate-marquee: marquee 40s linear infinite;
  --animate-ken-burns: kenBurns 9s ease-out forwards;
  --animate-line-up: lineUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes kenBurns {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}
@keyframes lineUp {
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
}

@layer base {
  html.dark body {
    background-color: var(--color-noir-950);
    color: var(--color-ink);
  }
  ::selection {
    background: var(--color-accent);
    color: #fff;
  }
}
```

Keep everything below the old `@layer base` block (fadeIn, scroll-* classes, swiper styles, scrollbar-none) unchanged for now.

- [ ] **Step 5: Create `src/hooks/useRouteTheme.js`**

```js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Public pages use the Showroom Noir (dark) look; the admin area keeps its
// light UI. Toggles the `.dark` class Tailwind's `dark:` variant listens to.
export function useRouteTheme() {
    const { pathname } = useLocation();

    useEffect(() => {
        const isAdmin = pathname.startsWith('/admin');
        document.documentElement.classList.toggle('dark', !isAdmin);
    }, [pathname]);
}
```

- [ ] **Step 6: Remove ThemeProvider**

Replace `src/main.jsx` with:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

Delete `src/context/ThemeContext.jsx` (`git rm src/context/ThemeContext.jsx`). Verify nothing else imports it: `grep -rn ThemeContext src` → no output.

- [ ] **Step 7: Create `src/components/motion/gsap.js`**

```js
// Single place that registers GSAP plugins; every motion component imports
// gsap from here so plugins are registered exactly once.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Animations only run when the user hasn't asked for reduced motion.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 8: Create `src/components/motion/SmoothScroll.jsx`**

```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, MOTION_OK } from './gsap';

// Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in
// sync. Also resets scroll on route change and refreshes trigger positions
// when async content (API data, images) changes the page height.
const SmoothScroll = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (!window.matchMedia(MOTION_OK).matches) return undefined;

        const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
        window.__lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    useEffect(() => {
        let timeout;
        const observer = new ResizeObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => ScrollTrigger.refresh(), 150);
        });
        observer.observe(document.body);
        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default SmoothScroll;
```

- [ ] **Step 9: Create `src/components/motion/Reveal.jsx`**

```jsx
import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

// Fades + slides its children in when they enter the viewport and back out
// when they leave (both directions). Static and fully visible when the user
// prefers reduced motion. The hidden start state is applied by GSAP at
// runtime, so content is never stuck invisible if the effect doesn't run.
const Reveal = ({ as: Tag = 'div', y = 24, delay = 0, className = '', children, ...rest }) => {
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            gsap.fromTo(
                ref.current,
                { autoAlpha: 0, y },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 88%',
                        end: 'bottom 12%',
                        toggleActions: 'play reverse play reverse',
                    },
                }
            );
        });
        return () => mm.revert();
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className} {...rest}>
            {children}
        </Tag>
    );
};

export default Reveal;
```

- [ ] **Step 10: Create `src/components/motion/SplitHeading.jsx`**

```jsx
import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP, MOTION_OK } from './gsap';

// Heading whose lines slide up from behind a mask as it enters the viewport,
// and slide back down when it leaves. Re-splits on resize/font load
// (autoSplit), so wrapping stays correct at every width.
const SplitHeading = ({ as: Tag = 'h2', className = '', children }) => {
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const split = SplitText.create(ref.current, {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                onSplit: (self) =>
                    gsap.from(self.lines, {
                        yPercent: 110,
                        duration: 1,
                        stagger: 0.09,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: ref.current,
                            start: 'top 88%',
                            end: 'bottom 8%',
                            toggleActions: 'play reverse play reverse',
                        },
                    }),
            });
            return () => split.revert();
        });
        return () => mm.revert();
    }, { scope: ref });

    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
};

export default SplitHeading;
```

- [ ] **Step 11: Create `src/components/motion/ImageReveal.jsx`**

```jsx
import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

// Image that "opens" with a clip-path wipe while scaling from 1.15 to 1,
// scrubbed to scroll position.
const ImageReveal = ({ src, alt, className = '', imgClassName = '' }) => {
    const wrapRef = useRef(null);
    const imgRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapRef.current,
                    start: 'top 90%',
                    end: 'top 35%',
                    scrub: 0.6,
                },
            });
            tl.fromTo(wrapRef.current, { clipPath: 'inset(14% 10% 14% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
              .fromTo(imgRef.current, { scale: 1.15 }, { scale: 1, ease: 'none' }, 0);
        });
        return () => mm.revert();
    }, { scope: wrapRef });

    return (
        <div ref={wrapRef} className={`overflow-hidden ${className}`}>
            <img ref={imgRef} src={src} alt={alt} loading="lazy" className={`w-full h-full object-cover ${imgClassName}`} />
        </div>
    );
};

export default ImageReveal;
```

- [ ] **Step 12: Create `src/components/motion/Counter.jsx`**

```jsx
import React, { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from './gsap';

const format = (n) => Math.round(n).toLocaleString('vi-VN');

// Number that rolls up from 0 when it scrolls into view. Renders the final
// value in the markup so it is correct without animation.
const Counter = ({ to, suffix = '', className = '' }) => {
    const ref = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MOTION_OK, () => {
            const state = { value: 0 };
            gsap.to(state, {
                value: to,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => { ref.current.textContent = `${format(state.value)}${suffix}`; },
                scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
            });
        });
        return () => mm.revert();
    }, { scope: ref, dependencies: [to, suffix] });

    return (
        <span ref={ref} className={`tabular-nums ${className}`}>
            {format(to)}{suffix}
        </span>
    );
};

export default Counter;
```

- [ ] **Step 13: Create `src/components/ui/Buttons.jsx`**

```jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

// The only two button styles in the Showroom Noir system.
// Pass `as="a"` + href for links; defaults to <button type="button">.

export const PrimaryButton = ({ as: Tag = 'button', className = '', children, ...rest }) => (
    <Tag
        {...(Tag === 'button' ? { type: 'button' } : {})}
        {...rest}
        className={`group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white font-semibold pl-6 pr-1.5 py-1.5 rounded-full transition-all hover:-translate-y-0.5 cursor-pointer ${className}`}
    >
        <span className="text-sm sm:text-[15px]">{children}</span>
        <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={16} />
        </span>
    </Tag>
);

export const GhostButton = ({ as: Tag = 'button', className = '', children, ...rest }) => (
    <Tag
        {...(Tag === 'button' ? { type: 'button' } : {})}
        {...rest}
        className={`group inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-ink font-semibold px-5 py-2.5 rounded-full text-sm transition-colors cursor-pointer ${className}`}
    >
        {children}
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
    </Tag>
);
```

- [ ] **Step 14: Create `src/components/ui/SectionHeader.jsx`**

```jsx
import React from 'react';
import Reveal from '../motion/Reveal';
import SplitHeading from '../motion/SplitHeading';

// Number + eyebrow + heading + optional intro, used by every home section.
const SectionHeader = ({ number, eyebrow, title, intro, align = 'left', className = '' }) => {
    const centered = align === 'center';
    return (
        <div className={`${centered ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
            <Reveal className={`flex items-center gap-3 mb-5 ${centered ? 'justify-center' : ''}`}>
                {number && <span className="text-accent font-bold text-sm tabular-nums">{number}</span>}
                {number && <span className="w-10 h-px bg-line" />}
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">{eyebrow}</span>
            </Reveal>
            <SplitHeading className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink">
                {title}
            </SplitHeading>
            {intro && (
                <Reveal delay={0.15}>
                    <p className={`mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
                        {intro}
                    </p>
                </Reveal>
            )}
        </div>
    );
};

export default SectionHeader;
```

- [ ] **Step 15: Wire SmoothScroll + route theme into `src/App.jsx`**

Add imports after the `SeoJsonLd` import:

```jsx
import SmoothScroll from './components/motion/SmoothScroll';
import { useRouteTheme } from './hooks/useRouteTheme';
```

Replace the `App` function with:

```jsx
function App() {
  useRouteTheme();

  return (
    <AdminAuthProvider>
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:slug" element={<ProductCategory />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
```

In `Home`, change the wrapper div className from `min-h-screen bg-brand-bg text-brand-text selection:bg-red-500 selection:text-white` to `min-h-screen bg-noir-950 text-ink`.

- [ ] **Step 16: Verify**

Run: `npx eslint src/components/motion src/components/ui src/hooks/useRouteTheme.js src/App.jsx src/main.jsx`
Expected: no errors.
Run: `npm run build`
Expected: `✓ built in`.
Run: `node scripts/ui-smoke.mjs`
Expected: still FAILS (brand strings / news visibility are fixed in later tasks), but with **no** new `console errors` failures compared to Step 2. Open http://localhost:5173/admin/login and confirm it is still light; open http://localhost:5173/news and confirm the page background is now near-black.

- [ ] **Step 17: Commit**

```bash
git add package.json package-lock.json scripts/ui-smoke.mjs src/index.css src/main.jsx src/App.jsx src/hooks/useRouteTheme.js src/components/motion src/components/ui
git rm src/context/ThemeContext.jsx
git commit -m "feat: Showroom Noir tokens, motion primitives, smooth scroll, UI smoke checks"
```

---

### Task 2: Navbar + Hero polish

**Files:**
- Modify: `src/components/Navbar.jsx`, `src/components/HeroSlider.jsx`

**Interfaces:**
- Consumes: `animate-ken-burns`, `animate-line-up` utilities (Task 1)
- Produces: the "Về Chúng Tôi" nav link scrolls to element id `ve-chung-toi` (created in Task 6)

- [ ] **Step 1: Navbar — remove the duplicate wordmark and retarget the anchor**

In `src/components/Navbar.jsx`:

1. Delete the whole `<span className={`hidden sm:block font-extrabold text-white uppercase …`}>Kim Long</span>` element inside the logo button (the logo image already reads "KIM LONG MOTOR").
2. In `navLinks`, change `{ label: 'Về Chúng Tôi', action: () => scrollTo('ve-hong-thuong') }` to `{ label: 'Về Chúng Tôi', action: () => scrollTo('ve-chung-toi') }`.
3. Change the CTA button classes `bg-red-600 hover:bg-red-700` to `bg-accent hover:bg-accent-dark`, and in the mobile dropdown `bg-red-600` to `bg-accent`.

- [ ] **Step 2: Hero — slow zoom on the active slide**

In `src/components/HeroSlider.jsx`, replace the `<img … />` inside each slide with:

```jsx
<img
    key={`img-${animKey}-${slide.id}`}
    src={slide.image}
    alt={slide.eyebrow}
    loading={idx === 0 ? 'eager' : 'lazy'}
    fetchPriority={idx === 0 ? 'high' : 'auto'}
    className={`absolute inset-0 w-full h-full object-cover object-center ${idx === activeIndex ? 'motion-safe:animate-ken-burns' : ''}`}
    style={slide.mirror ? { transform: 'scaleX(-1)' } : undefined}
/>
```

(`alt` switches from the multi-line title to the short eyebrow; the `key` restarts the zoom each time the slide becomes active.)

- [ ] **Step 3: Hero — masked line-by-line headline**

Replace the `<h1 …>{slide.title}</h1>` element with:

```jsx
<h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-white leading-[1.1] tracking-tight">
    {slide.title.split('\n').map((line, lineIdx) => (
        <span key={lineIdx} className="block overflow-hidden pb-1">
            <span
                className="block motion-safe:animate-line-up"
                style={{ animationDelay: `${0.2 + lineIdx * 0.12}s` }}
            >
                {line}
            </span>
        </span>
    ))}
</h1>
```

- [ ] **Step 4: Hero — accent colour**

In the CTA arrow circle span, change `bg-red-600` to `bg-accent`; in the progress bar, change `bg-red-500` to `bg-accent`.

- [ ] **Step 5: Verify**

Run: `npx eslint src/components/Navbar.jsx src/components/HeroSlider.jsx` → no errors.
Run: `npm run build` → `✓ built in`.
Open http://localhost:5173: the navbar shows the logo only (no second "KIM LONG"); each slide's headline lines rise from behind a mask; the background slowly zooms out; after 6s slide 2 plays the same animation again.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.jsx src/components/HeroSlider.jsx
git commit -m "feat: hero line reveal + slow zoom, drop duplicate navbar wordmark"
```

---

### Task 3: Section 01 — Brand introduction

**Files:**
- Rewrite: `src/components/BrandIntro.jsx`

**Interfaces:**
- Consumes: `Reveal`, `SplitHeading`, `Counter` (Task 1)

- [ ] **Step 1: Replace `src/components/BrandIntro.jsx` with:**

```jsx
import React from 'react';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';
import Counter from './motion/Counter';

const metrics = [
    { to: 600, suffix: '+', label: 'Hecta tổ hợp nhà máy hiện đại' },
    { to: 50000, suffix: '+', label: 'Xe/năm công suất thiết kế' },
    { text: 'Euro 5 – 6', label: 'Tiêu chuẩn khí thải công nghệ cao' },
    { text: 'Toàn quốc', label: 'Hệ thống bảo hành & trạm dịch vụ' },
];

// Section 01 — large brand statement + four metrics on hairline dividers.
const BrandIntro = () => (
    <section id="gioi-thieu-thuong-hieu" className="bg-noir-950 py-24 sm:py-36">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            <Reveal className="flex items-center gap-3 mb-8">
                <span className="text-accent font-bold text-sm tabular-nums">01</span>
                <span className="w-10 h-px bg-line" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">Kim Long Motor</span>
            </Reveal>

            <SplitHeading className="max-w-5xl text-3xl sm:text-5xl lg:text-[4.25rem] font-extrabold tracking-tight leading-[1.1] text-ink">
                Tổ hợp sản xuất ô tô hiện đại bậc nhất Việt Nam — tạo nên những chiếc xe khách, xe tải và xe chuyên dùng đạt chuẩn quốc tế.
            </SplitHeading>

            <Reveal delay={0.1}>
                <p className="mt-8 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">
                    Nhà máy tại Khu kinh tế Chân Mây – Lăng Cô (Huế) ứng dụng dây chuyền công nghệ tiên tiến, đồng hành cùng hàng chục nghìn khách hàng doanh nghiệp trên khắp cả nước.
                </p>
            </Reveal>

            <div className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 border-t border-line">
                {metrics.map((m, idx) => (
                    <Reveal
                        key={m.label}
                        delay={idx * 0.08}
                        className={`py-8 sm:py-10 pr-4 ${idx % 2 === 1 ? 'pl-4 sm:pl-8 border-l border-line' : ''} ${idx >= 2 ? 'border-t lg:border-t-0 border-line' : ''} ${idx === 2 ? 'lg:pl-8 lg:border-l' : ''}`}
                    >
                        <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">
                            {m.to !== undefined ? <Counter to={m.to} suffix={m.suffix} /> : m.text}
                        </div>
                        <div className="mt-3 text-xs sm:text-sm text-ink-muted max-w-[180px] leading-snug">{m.label}</div>
                    </Reveal>
                ))}
            </div>
        </div>
    </section>
);

export default BrandIntro;
```

- [ ] **Step 2: Verify**

Run: `npx eslint src/components/BrandIntro.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → the line `section gioi-thieu-thuong-hieu heading visible` passes on desktop, mobile and reduced-motion runs.
Visually at http://localhost:5173: statement lines rise one by one; metrics count up (600+, 50.000+); scrolling back up fades them out and in again.

- [ ] **Step 3: Commit**

```bash
git add src/components/BrandIntro.jsx
git commit -m "feat: section 01 brand statement with counters on hairlines"
```

---

### Task 4: Section 02 — Pinned video showcase

**Files:**
- Rewrite: `src/components/VehicleShowcase.jsx`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`, `useGSAP`, `MOTION_OK` (Task 1), `SectionHeader` (Task 1), `GhostButton` (Task 1)

The desktop stage pins the section and crossfades video + copy per scene as the user scrolls. Mobile and reduced-motion users get a stacked list (the stage is hidden with `motion-reduce:lg:hidden`). This replaces the sticky layout that left an empty black column.

- [ ] **Step 1: Replace `src/components/VehicleShowcase.jsx` with:**

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { Shield, Zap, Gauge, Wrench } from 'lucide-react';
import { gsap, useGSAP } from './motion/gsap';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

const scenes = [
    {
        id: 'scene-1',
        video: '/media/showcase/video_sciene1.mp4',
        poster: '/media/showcase/img_sciene1.jpg',
        eyebrow: 'Trải nghiệm thực tế',
        title: 'Chinh phục mọi cung đường',
        description: 'Kim Long 99 vận hành êm ái trên mọi cung đường cao tốc với hệ thống treo bóng hơi thế hệ mới, giảm rung lắc tối đa cho hành khách.',
        highlights: [
            { icon: Gauge, text: 'Động cơ Weichai / Yuchai Euro 5 mạnh mẽ' },
            { icon: Shield, text: 'Khung gầm monocoque chống lật chuẩn ECE R66' },
        ],
    },
    {
        id: 'scene-2',
        video: '/media/showcase/video_sciene2.mp4',
        poster: '/media/showcase/img_sciene2.jpg',
        eyebrow: 'Thiết kế sang trọng',
        title: 'Nội thất đẳng cấp Châu Âu',
        description: 'Mỗi chiếc xe khách Kim Long 99 được hoàn thiện tỉ mỉ với nội thất da cao cấp, hệ thống giải trí cá nhân và chiếu sáng LED ambient.',
        highlights: [
            { icon: Zap, text: '24–34 phòng VIP massage & giường nằm êm ái' },
            { icon: Wrench, text: 'Tùy chỉnh nội thất theo yêu cầu khách hàng' },
        ],
    },
    {
        id: 'scene-3',
        video: '/media/showcase/video_sciene3.mp4',
        poster: '/media/showcase/img_sciene3.jpg',
        eyebrow: 'Vận hành bền bỉ',
        title: 'Đồng hành cùng doanh nghiệp',
        description: 'Từ nội thành đến liên tỉnh, Kim Long 99 là lựa chọn của hơn 100 nhà xe trên cả nước nhờ chi phí vận hành tối ưu và dịch vụ hậu mãi 24/7.',
        highlights: [
            { icon: Shield, text: 'Bảo hành chính hãng 3 năm / 150.000 km' },
            { icon: Gauge, text: 'Tiết kiệm nhiên liệu hàng đầu phân khúc' },
        ],
    },
];

const scrollToCatalog = () => document.getElementById('danh-muc-xe')?.scrollIntoView({ behavior: 'smooth' });

const SceneCopy = ({ scene, index }) => (
    <>
        <div className="flex items-center gap-3 mb-4">
            <span className="text-accent font-bold text-sm tabular-nums">0{index + 1}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">{scene.eyebrow}</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-ink">{scene.title}</h3>
        <p className="mt-4 text-[15px] text-ink-muted leading-relaxed max-w-md">{scene.description}</p>
        <ul className="mt-6 border-t border-line">
            {scene.highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3 py-3.5 border-b border-line text-sm text-ink">
                    <h.icon size={17} className="text-accent shrink-0" />
                    {h.text}
                </li>
            ))}
        </ul>
    </>
);

// Desktop: pinned stage. Scroll progress drives the crossfade between scenes.
const PinnedStage = () => {
    const rootRef = useRef(null);
    const videoRefs = useRef([]);
    const [active, setActive] = useState(0);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
            const videos = gsap.utils.toArray('[data-scene-video]', rootRef.current);
            const copies = gsap.utils.toArray('[data-scene-copy]', rootRef.current);
            gsap.set(videos.slice(1), { autoAlpha: 0 });
            gsap.set(copies.slice(1), { autoAlpha: 0, y: 40 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: () => `+=${window.innerHeight * (scenes.length - 1) * 1.1}`,
                    pin: true,
                    scrub: 0.8,
                    onUpdate: (self) => setActive(Math.round(self.progress * (scenes.length - 1))),
                },
            });
            for (let i = 1; i < scenes.length; i++) {
                tl.to(copies[i - 1], { autoAlpha: 0, y: -40, duration: 0.4 })
                  .to(videos[i - 1], { autoAlpha: 0, duration: 0.5 }, '<')
                  .to(videos[i], { autoAlpha: 1, duration: 0.5 }, '<')
                  .to(copies[i], { autoAlpha: 1, y: 0, duration: 0.4 }, '<0.15')
                  .to({}, { duration: 0.6 });
            }
        });
        return () => mm.revert();
    }, { scope: rootRef });

    useEffect(() => {
        videoRefs.current.forEach((video, idx) => {
            if (!video) return;
            if (idx === active) video.play().catch(() => {});
            else video.pause();
        });
    }, [active]);

    return (
        <div ref={rootRef} className="hidden lg:block motion-reduce:lg:hidden h-screen">
            <div className="h-full max-w-[1400px] mx-auto px-10 py-24 grid grid-cols-12 gap-14 items-center">
                <div className="col-span-7 relative h-full max-h-[640px] rounded-[28px] overflow-hidden bg-graphite-800">
                    {scenes.map((scene, idx) => (
                        <video
                            key={scene.id}
                            data-scene-video
                            ref={(el) => { videoRefs.current[idx] = el; }}
                            src={scene.video}
                            poster={scene.poster}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ))}
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        {scenes.map((scene, i) => (
                            <span key={scene.id} className={`h-[3px] rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-accent' : 'w-4 bg-white/30'}`} />
                        ))}
                        <span className="ml-1 text-xs font-bold text-white/70 tabular-nums">0{active + 1} / 0{scenes.length}</span>
                    </div>
                </div>
                <div className="col-span-5 relative h-[420px]">
                    {scenes.map((scene, idx) => (
                        <div key={scene.id} data-scene-copy className="absolute inset-0 flex flex-col justify-center">
                            <SceneCopy scene={scene} index={idx} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mobile / reduced motion: stacked scenes, video plays while on screen.
const StackedScene = ({ scene, index }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        }, { threshold: 0.3 });
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-14 lg:items-center">
            <div className="lg:col-span-7 aspect-video rounded-[24px] overflow-hidden bg-graphite-800">
                <video ref={videoRef} src={scene.video} poster={scene.poster} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
            </div>
            <div className="lg:col-span-5">
                <SceneCopy scene={scene} index={index} />
            </div>
        </Reveal>
    );
};

// Section 02 — real-world showcase.
const VehicleShowcase = () => (
    <section id="trai-nghiem" className="bg-noir-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-24 sm:pt-32">
            <SectionHeader
                number="02"
                eyebrow="Khám phá Kim Long 99"
                title="Trải nghiệm thực tế từng chi tiết"
                intro="Cuộn để xem từng khoảnh khắc — video thật về dòng xe khách hàng đầu Việt Nam."
            />
        </div>

        <PinnedStage />

        <div className="lg:hidden motion-reduce:lg:block max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 py-16 space-y-16">
            {scenes.map((scene, idx) => (
                <StackedScene key={scene.id} scene={scene} index={idx} />
            ))}
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pb-24 sm:pb-32">
            <GhostButton onClick={scrollToCatalog}>Xem các dòng xe khách</GhostButton>
        </div>
    </section>
);

export default VehicleShowcase;
```

- [ ] **Step 2: Verify**

Run: `npx eslint src/components/VehicleShowcase.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `section trai-nghiem heading visible` passes in all three runs; no horizontal overflow on mobile.
Visually at 1440px: scrolling into the section pins it; the video on the left crossfades 01 → 02 → 03 in step with the copy on the right; there is **no** empty black column at any scroll position; after scene 03 the page continues normally. At 390px: three stacked cards, each video plays when on screen.

- [ ] **Step 3: Commit**

```bash
git add src/components/VehicleShowcase.jsx
git commit -m "feat: section 02 pinned video showcase with scroll crossfade"
```

---

### Task 5: Section 03 — Model range with stage cards

**Files:**
- Rewrite: `src/components/VehicleCatalogSection.jsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Reveal`, `GhostButton` (Task 1); `carsData` from `src/data/hongthuong-data.js` (fields: `id`, `category`, `shortName`, `image`, `price`, `promoTag`, `specsHighlights[{label,value}]`)
- Keeps props: `onOpenDetail(car)`, `onOpenQuote(car)`; keeps element id `danh-muc-xe`

- [ ] **Step 1: Replace `src/components/VehicleCatalogSection.jsx` with:**

```jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { carsData } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

const tabs = [
    { id: 'bus', label: 'Xe Khách', categories: ['giuong-nam', 'xe-ghe'] },
    { id: 'truck', label: 'Xe Tải', categories: ['xe-tai'] },
    { id: 'special', label: 'Xe Chuyên Dùng', categories: ['van-dien', 'dau-keo-dien'] },
];

// At most one badge per card, chosen by priority.
const badgeFor = (car) => {
    if (car.category === 'van-dien' || car.category === 'dau-keo-dien') return 'Thuần điện';
    if (car.promoTag?.includes('Sẵn')) return 'Sẵn xe';
    if (car.promoTag) return 'Ưu đãi';
    return null;
};

const StageCard = ({ car, onOpenDetail, onOpenQuote }) => {
    const badge = badgeFor(car);
    return (
        <article
            onClick={() => onOpenDetail(car)}
            className="group cursor-pointer rounded-[22px] bg-graphite-800 border border-line overflow-hidden flex flex-col transition-colors hover:border-white/20"
        >
            {/* Uniform gradient "stage" so every photo sits on the same backdrop */}
            <div className="relative p-3 bg-[radial-gradient(ellipse_at_50%_70%,#2B313B_0%,#1A1D23_70%)]">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                        src={car.image}
                        alt={car.shortName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = '/images/banners/slider-1.jpg'; }}
                    />
                </div>
                {badge && (
                    <span className="absolute top-6 left-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {badge}
                    </span>
                )}
            </div>

            <div className="px-5 pb-5 pt-3 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-ink leading-snug">{car.shortName}</h3>
                <dl className="mt-3 text-xs sm:text-[13px]">
                    {(car.specsHighlights || []).slice(0, 2).map((s) => (
                        <div key={s.label} className="flex justify-between gap-3 py-2 border-t border-line">
                            <dt className="text-ink-muted shrink-0">{s.label}</dt>
                            <dd className="text-ink text-right truncate">{s.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-ink-muted truncate">{car.price}</span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenQuote(car); }}
                        className="shrink-0 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-accent hover:text-white transition-colors cursor-pointer"
                    >
                        Báo giá <ArrowUpRight size={15} />
                    </button>
                </div>
            </div>
        </article>
    );
};

// Section 03 — model range.
const VehicleCatalogSection = ({ onOpenDetail, onOpenQuote }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const cars = useMemo(() => {
        const cats = tabs.find((t) => t.id === activeTab)?.categories || [];
        return carsData.filter((car) => cats.includes(car.category)).slice(0, 8);
    }, [activeTab]);

    return (
        <section id="danh-muc-xe" className="bg-noir-950 py-24 sm:py-36">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
                    <SectionHeader
                        number="03"
                        eyebrow="Dòng xe"
                        title="Mỗi hành trình, một cỗ máy phù hợp"
                        intro="Phân phối trực tiếp từ nhà máy — xe khách, xe tải và xe chuyên dùng thế hệ mới."
                    />
                    <div role="tablist" className="flex gap-7 border-b border-line">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative pb-3 text-sm font-semibold transition-colors cursor-pointer ${activeTab === tab.id ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                            >
                                {tab.label}
                                <span className={`absolute left-0 -bottom-px h-[2px] bg-accent transition-all duration-300 ${activeTab === tab.id ? 'w-full' : 'w-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {cars.map((car, idx) => (
                        <Reveal key={`${activeTab}-${car.id}`} delay={(idx % 4) * 0.07}>
                            <StageCard car={car} onOpenDetail={onOpenDetail} onOpenQuote={onOpenQuote} />
                        </Reveal>
                    ))}
                </div>

                <div className="mt-12">
                    <GhostButton onClick={() => navigate('/category/all')}>Xem tất cả dòng xe</GhostButton>
                </div>
            </div>
        </section>
    );
};

export default VehicleCatalogSection;
```

- [ ] **Step 2: Verify**

Run: `npx eslint src/components/VehicleCatalogSection.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `section danh-muc-xe heading visible` passes in all runs.
Visually: underline tabs switch sets (Xe Khách 6 cards, Xe Tải 2, Xe Chuyên Dùng 4); every card shows at most one badge; clicking a card opens the detail modal; "Báo giá" opens the quote modal.

- [ ] **Step 3: Commit**

```bash
git add src/components/VehicleCatalogSection.jsx
git commit -m "feat: section 03 model range with uniform stage cards"
```

---

### Task 6: Section 04 — Why Kim Long Motor (replaces red band + expert section)

**Files:**
- Create: `src/components/WhyKimLong.jsx`
- Modify: `src/App.jsx`
- Delete: `src/components/WhyChooseUs.jsx`, `src/components/AboutHongThuong.jsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Reveal`, `ImageReveal` (Task 1); `trustPillars[{title,description}]`, `businessInfo` from `src/data/hongthuong-data.js`
- Produces: element id `ve-chung-toi` (Navbar link from Task 2, Footer link in Task 9)

Uses the static `trustPillars` copy instead of the `/whyChooseUs` API block, whose stored title is "VÌ SAO CHỌN MIỀN NAM AUTO ?".

- [ ] **Step 1: Create `src/components/WhyKimLong.jsx`:**

```jsx
import React from 'react';
import { Phone, Wrench } from 'lucide-react';
import { trustPillars, businessInfo } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import ImageReveal from './motion/ImageReveal';

// Section 04 — four numbered reasons + expert-team hotlines.
const WhyKimLong = () => (
    <section id="ve-chung-toi" className="bg-noir-900 py-24 sm:py-36">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
            <div className="lg:col-span-6">
                <SectionHeader
                    number="04"
                    eyebrow="Vì sao chọn chúng tôi"
                    title="Giá gốc nhà máy, đồng hành trọn vòng đời xe"
                />

                <ol className="mt-12 border-t border-line">
                    {trustPillars.map((pillar, idx) => (
                        <Reveal as="li" key={pillar.title} delay={idx * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 py-7 border-b border-line">
                            <span className="text-accent font-bold tabular-nums pt-0.5">0{idx + 1}</span>
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-ink">{pillar.title}</h3>
                                <p className="mt-2 text-sm sm:text-[15px] text-ink-muted leading-relaxed">{pillar.description}</p>
                            </div>
                        </Reveal>
                    ))}
                </ol>

                <Reveal className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="flex items-center gap-4 p-4 rounded-2xl border border-line hover:border-white/25 transition-colors">
                        <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shrink-0"><Phone size={18} /></span>
                        <span>
                            <span className="block text-xs text-ink-muted">Tư vấn & báo giá</span>
                            <span className="block text-lg font-bold text-ink tabular-nums">{businessInfo.hotlineSales}</span>
                        </span>
                    </a>
                    <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="flex items-center gap-4 p-4 rounded-2xl border border-line hover:border-white/25 transition-colors">
                        <span className="w-11 h-11 rounded-full bg-graphite-700 text-white flex items-center justify-center shrink-0"><Wrench size={18} /></span>
                        <span>
                            <span className="block text-xs text-ink-muted">Kỹ thuật & dịch vụ 24/7</span>
                            <span className="block text-lg font-bold text-ink tabular-nums">{businessInfo.hotlineService}</span>
                        </span>
                    </a>
                </Reveal>
            </div>

            <div className="lg:col-span-6 lg:pt-24">
                <ImageReveal
                    src="/images/about/about-1-sanxuat_oto_2-1024x472.jpg"
                    alt="Dây chuyền sản xuất ô tô Kim Long Motor"
                    className="rounded-[28px] aspect-[4/5] lg:aspect-auto lg:h-[640px]"
                />
                <Reveal className="mt-5 text-sm text-ink-muted flex gap-2">
                    <span className="text-accent">—</span>
                    Showroom & kho xe: {businessInfo.address}
                </Reveal>
            </div>
        </div>
    </section>
);

export default WhyKimLong;
```

- [ ] **Step 2: Wire into `src/App.jsx`**

Replace the imports `import WhyChooseUs from './components/WhyChooseUs';` and `import AboutHongThuong from './components/AboutHongThuong';` with `import WhyKimLong from './components/WhyKimLong';`.
In `Home`'s `<main>`, delete the `{/* Why Choose Us … */}<WhyChooseUs />` block and the `{/* About Hong Thuong Section */}<AboutHongThuong />` block, and insert directly after `<VehicleCatalogSection … />`:

```jsx
        {/* 04 — Why Kim Long Motor */}
        <WhyKimLong />
```

- [ ] **Step 3: Delete the superseded components**

```bash
git rm src/components/WhyChooseUs.jsx src/components/AboutHongThuong.jsx
grep -rn "WhyChooseUs\|AboutHongThuong\|ve-hong-thuong" src
```
Expected: the grep prints only `src/components/Footer.jsx` lines referencing `ve-hong-thuong` (fixed in Task 9) — nothing else.

- [ ] **Step 4: Verify**

Run: `npx eslint src/components/WhyKimLong.jsx src/App.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `/ desktop` no longer reports `/Miền Nam Auto/i`; `section ve-chung-toi heading visible` passes. Clicking "Về Chúng Tôi" in the navbar scrolls to this section.

- [ ] **Step 5: Commit**

```bash
git add src/components/WhyKimLong.jsx src/App.jsx
git commit -m "feat: section 04 why Kim Long Motor, replacing red band and expert block"
```

---

### Task 7: Section 05 — Customers & handovers (merges video + testimonials)

**Files:**
- Create: `src/components/CustomerStories.jsx`
- Modify: `src/App.jsx`
- Delete: `src/components/RealVideoSection.jsx`, `src/components/Testimonials.jsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Reveal`, `GhostButton` (Task 1); `useApiData`, `getTestimonials` (items `{name, subtitle, avatar, score, quote}`), `getPhotoStrip` (items `{type, image, alt}`); `realVideos[{id,title,youtubeUrl,thumbnailUrl,tag}]`, `businessInfo`
- Produces: element id `khach-hang`

- [ ] **Step 1: Create `src/components/CustomerStories.jsx`:**

```jsx
import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { getTestimonials, getPhotoStrip } from '../api/client';
import { realVideos, businessInfo } from '../data/hongthuong-data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import { GhostButton } from './ui/Buttons';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase();

// Avatar with a graceful initials fallback (the CMS has some broken URLs).
const Avatar = ({ src, name }) => {
    const [broken, setBroken] = useState(!src);
    if (broken) {
        return <span className="w-11 h-11 rounded-full bg-graphite-700 text-ink text-sm font-bold flex items-center justify-center">{initials(name)}</span>;
    }
    return <img src={src} alt={name} onError={() => setBroken(true)} className="w-11 h-11 rounded-full object-cover" />;
};

// Section 05 — handover photo marquee, pull quotes, and video channels.
const CustomerStories = () => {
    const { data: testimonials } = useApiData(getTestimonials, []);
    const { data: photos } = useApiData(getPhotoStrip, []);
    const quotes = (testimonials || []).slice(0, 3);
    const strip = (photos || []).filter((p) => p.type === 'image').slice(0, 8);

    return (
        <section id="khach-hang" className="bg-noir-950 py-24 sm:py-36 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <SectionHeader
                    number="05"
                    eyebrow="Khách hàng & bàn giao"
                    title="Hàng trăm nhà xe đã tin chọn Kim Long Motor"
                />
            </div>

            {strip.length > 0 && (
                <div className="mt-14 group/marquee">
                    <div className="flex w-max gap-4 motion-safe:animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:overflow-x-auto motion-reduce:px-5">
                        {[...strip, ...strip].map((p, idx) => (
                            <div key={idx} aria-hidden={idx >= strip.length} className="w-[280px] sm:w-[360px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 bg-graphite-800">
                                <img src={p.image} alt={p.alt ? p.alt.replace(/Kim Long Miền Nam/gi, 'Kim Long Motor') : 'Bàn giao xe Kim Long Motor'} loading="lazy" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                {quotes.length > 0 && (
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {quotes.map((t, idx) => (
                            <Reveal key={t.name || idx} delay={idx * 0.08} className="rounded-[22px] border border-line p-7 flex flex-col">
                                <p data-cms-content className="text-ink text-base sm:text-lg leading-relaxed">“{String(t.quote || '').replace(/^[“"]|[”"]$/g, '')}”</p>
                                <div className="mt-auto pt-7 flex items-center gap-3">
                                    <Avatar src={t.avatar} name={t.name} />
                                    <div>
                                        <div className="text-sm font-bold text-ink">{t.name}</div>
                                        <div className="text-xs text-ink-muted">{t.subtitle}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}

                <div className="mt-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <Reveal>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">Video thực tế</h3>
                        <p className="mt-2 text-sm text-ink-muted">Lái thử, bàn giao và đánh giá chi tiết trên kênh chính thức.</p>
                    </Reveal>
                    <Reveal className="flex gap-3">
                        <GhostButton as="a" href={businessInfo.youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</GhostButton>
                        <GhostButton as="a" href={businessInfo.tiktokUrl} target="_blank" rel="noopener noreferrer">TikTok</GhostButton>
                    </Reveal>
                </div>

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {realVideos.map((video, idx) => (
                        <Reveal key={video.id} delay={idx * 0.06}>
                            <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block">
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-graphite-800">
                                    <img src={video.thumbnailUrl} alt={video.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <span className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center"><Play size={16} fill="white" /></span>
                                    </span>
                                </div>
                                <p className="mt-3 text-xs sm:text-sm text-ink line-clamp-2 group-hover:text-white">{video.title}</p>
                                <p className="mt-1 text-[11px] text-ink-muted flex items-center gap-1"><Youtube size={12} /> Kim Long Motor</p>
                            </a>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CustomerStories;
```

- [ ] **Step 2: Wire into `src/App.jsx`**

Replace the imports `import RealVideoSection from './components/RealVideoSection';` and `import Testimonials from './components/Testimonials';` with `import CustomerStories from './components/CustomerStories';`.
Delete the `<RealVideoSection />` and `<Testimonials />` blocks (with their comments) from `<main>`, and insert directly after `<WhyKimLong />`:

```jsx
        {/* 05 — Customers & handovers */}
        <CustomerStories />
```

- [ ] **Step 3: Delete superseded components**

```bash
git rm src/components/RealVideoSection.jsx src/components/Testimonials.jsx
grep -rn "RealVideoSection\|components/Testimonials" src
```
Expected: no output (`AdminTestimonials` imports its own page, not this component).

- [ ] **Step 4: Verify**

Run: `npx eslint src/components/CustomerStories.jsx src/App.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `section khach-hang heading visible` passes; no horizontal overflow on mobile (the marquee is inside `overflow-hidden`).
Visually: photos scroll continuously and pause on hover; testimonial with a broken avatar shows initials instead of alt text.

- [ ] **Step 5: Commit**

```bash
git add src/components/CustomerStories.jsx src/App.jsx
git commit -m "feat: section 05 customer stories merging videos and testimonials"
```

---

### Task 8: Section 06 — News

**Files:**
- Rewrite: `src/components/NewsViral.jsx`

**Interfaces:**
- Consumes: `SectionHeader`, `Reveal`, `ImageReveal`, `GhostButton` (Task 1); `getArticles` items `{id, slug, title, image, category, date, featured, excerpt}`
- Keeps element id `news`

Wrapping content in `Reveal` components (which mount together with the data) fixes the bug where the section stayed at opacity 0.

- [ ] **Step 1: Replace `src/components/NewsViral.jsx` with:**

```jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApiData';
import { getArticles } from '../api/client';
import { getNewsCategoryLabel } from '../data/newsCategories';
import SectionHeader from './ui/SectionHeader';
import Reveal from './motion/Reveal';
import ImageReveal from './motion/ImageReveal';
import { GhostButton } from './ui/Buttons';

const formatDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Section 06 — one large featured story + three side stories.
const NewsViral = () => {
    const navigate = useNavigate();
    const { data: articles } = useApiData(getArticles, []);
    const all = articles || [];
    const featured = all.filter((a) => a.featured);
    const news = (featured.length ? featured : all)
        .slice()
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 4);

    if (!news.length) return null;
    const [main, ...rest] = news;
    const href = (a) => `/news/${a.slug || a.id}`;

    return (
        <section id="news" className="bg-noir-900 py-24 sm:py-36">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
                    <SectionHeader number="06" eyebrow="Tin tức" title="Câu chuyện từ Kim Long Motor" />
                    <GhostButton onClick={() => navigate('/news')}>Tất cả tin tức</GhostButton>
                </div>

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <Reveal className="lg:col-span-7">
                        <Link to={href(main)} className="group block">
                            <ImageReveal src={main.image} alt={main.title} className="rounded-[24px] aspect-[16/10]" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                            <div className="mt-5 flex items-center gap-3 text-xs text-ink-muted">
                                <span className="text-accent font-semibold uppercase tracking-[0.18em]">{getNewsCategoryLabel(main.category)}</span>
                                <span>{formatDate(main.date)}</span>
                            </div>
                            <h3 data-cms-content className="mt-2 text-xl sm:text-3xl font-bold tracking-tight text-ink leading-snug group-hover:text-white">{main.title}</h3>
                        </Link>
                    </Reveal>

                    <div className="lg:col-span-5 border-t border-line">
                        {rest.map((item, idx) => (
                            <Reveal key={item.id} delay={idx * 0.08}>
                                <Link to={href(item)} className="group grid grid-cols-[112px_1fr] sm:grid-cols-[140px_1fr] gap-5 py-6 border-b border-line">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-graphite-800">
                                        {item.image && <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] text-ink-muted">{formatDate(item.date)}</div>
                                        <h3 data-cms-content className="mt-1.5 text-sm sm:text-base font-semibold text-ink leading-snug line-clamp-3 group-hover:text-white">{item.title}</h3>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsViral;
```

- [ ] **Step 2: Confirm the category helper exists**

Run: `grep -n "export const getNewsCategoryLabel\|export function getNewsCategoryLabel" src/data/newsCategories.js`
Expected: one match. (It is already used by `src/pages/NewsDetailPage.jsx`.)

- [ ] **Step 3: Verify**

Run: `npx eslint src/components/NewsViral.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `section news heading visible` now **passes** (it failed in Task 1 Step 2).

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsViral.jsx
git commit -m "feat: section 06 news on noir, fixes section stuck at opacity 0"
```

---

### Task 9: Quote CTA + Footer

**Files:**
- Rewrite (markup only): `src/components/QuoteFormSection.jsx`
- Rewrite: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: `Reveal`, `SplitHeading` (Task 1); `createLead(data)` from `src/api/client.js`; `businessInfo`, `carCategories`
- Keeps element ids `bang-bao-gia` (quote) and `lien-he` (footer)

- [ ] **Step 1: Replace `src/components/QuoteFormSection.jsx` with** (submit logic is unchanged from the current file; only the markup changes):

```jsx
import React, { useState } from 'react';
import { ArrowRight, Phone, Loader2 } from 'lucide-react';
import { businessInfo } from '../data/hongthuong-data';
import { createLead } from '../api/client';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';

// Vietnamese mobile numbers: 10 digits starting with 03/05/07/08/09.
const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

// Stub: wire to a real transactional-email provider once one is configured.
async function sendConfirmationEmailStub(lead) {
    console.info('[email-stub] Would send confirmation email for lead:', lead);
}

// Cinematic one-field quote CTA.
const QuoteFormSection = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const digits = phone.replace(/\D/g, '');
        if (!VN_PHONE_REGEX.test(digits)) {
            setError('Vui lòng nhập đúng số điện thoại Việt Nam (VD: 0912345678).');
            return;
        }
        setError('');
        setStatus('submitting');
        try {
            const lead = await createLead({ phone: digits, source: 'home-1click-quote' });
            sendConfirmationEmailStub(lead).catch(() => {});
        } catch (err) {
            console.warn('Lead submission failed:', err.message);
        }
        setStatus('success');
    };

    return (
        <section id="bang-bao-gia" className="relative overflow-hidden bg-noir-950 py-28 sm:py-40">
            <img src="/images/banners/banner-xetai.jpg" alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-noir-950 via-noir-950/70 to-noir-950" />

            <div className="relative max-w-3xl mx-auto px-5 sm:px-6 text-center">
                <Reveal className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">Báo giá lăn bánh</Reveal>
                <SplitHeading className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink">
                    Nhận báo giá trong 5 phút
                </SplitHeading>
                <Reveal delay={0.1}>
                    <p className="mt-5 text-base sm:text-lg text-ink-muted">Chỉ cần số điện thoại — chuyên viên Kim Long Motor sẽ gọi lại tư vấn và gửi báo giá ngay.</p>
                </Reveal>

                <Reveal delay={0.2} className="mt-10">
                    {status === 'success' ? (
                        <div className="rounded-[24px] border border-line bg-graphite-800/80 backdrop-blur p-8">
                            <p className="text-lg font-bold text-ink">Đã nhận yêu cầu của bạn!</p>
                            <p className="mt-2 text-sm text-ink-muted">Kim Long Motor sẽ liên hệ số <strong className="text-ink">{phone}</strong> trong ít phút.</p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                                <button type="button" onClick={() => { setStatus('idle'); setPhone(''); }} className="px-5 py-2.5 rounded-full border border-white/20 text-ink text-sm font-semibold hover:border-white/50 cursor-pointer">Gửi số khác</button>
                                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold inline-flex items-center justify-center gap-2"><Phone size={15} /> {businessInfo.hotlineSales}</a>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
                            <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-[28px] sm:rounded-full border border-white/15 bg-graphite-800/80 backdrop-blur">
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    aria-label="Số điện thoại"
                                    placeholder="Nhập số điện thoại của bạn..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="flex-1 bg-transparent px-5 py-3 text-ink placeholder:text-ink-muted focus:outline-none"
                                />
                                <button type="submit" disabled={status === 'submitting'} className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-full whitespace-nowrap cursor-pointer disabled:cursor-not-allowed">
                                    {status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : <>Nhận báo giá <ArrowRight size={16} /></>}
                                </button>
                            </div>
                            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                            <p className="mt-4 text-xs text-ink-muted">Thông tin được bảo mật, tư vấn miễn phí.</p>
                        </form>
                    )}
                </Reveal>
            </div>
        </section>
    );
};

export default QuoteFormSection;
```

- [ ] **Step 2: Replace `src/components/Footer.jsx` with:**

```jsx
import React from 'react';
import { Phone, MapPin, Wrench, Youtube } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { businessInfo, carCategories } from '../data/hongthuong-data';

const SocialIconButton = ({ href, label, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-full border border-line hover:border-white/40 text-ink flex items-center justify-center transition-colors">
        {children}
    </a>
);

// Noir footer with an oversized wordmark across the bottom.
const Footer = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const scrollTo = (id) => {
        if (pathname !== '/') {
            navigate('/');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
            return;
        }
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer id="lien-he" className="bg-noir-900 text-ink border-t border-line overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-5 space-y-5">
                        <img src="/images/logo-official.png" alt="Kim Long Motor" className="h-12 w-auto" onError={(e) => { e.currentTarget.src = '/images/logo-ngang-do.png'; }} />
                        <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
                            Đại lý phân phối chính hãng xe khách giường nằm, xe ghế Universe, xe van điện GK 48EV, xe tải KIMAN9 và đầu kéo điện K9KEV.
                        </p>
                        <p className="flex items-start gap-2 text-sm text-ink-muted">
                            <MapPin size={16} className="text-accent shrink-0 mt-0.5" /> {businessInfo.address}
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-5">Dòng xe</h3>
                        <ul className="space-y-3 text-sm">
                            {carCategories.filter((c) => c.id !== 'all').map((cat) => (
                                <li key={cat.id}>
                                    <button onClick={() => scrollTo('danh-muc-xe')} className="text-ink hover:text-accent transition-colors cursor-pointer text-left">{cat.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-5">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <a href={`tel:${businessInfo.hotlineSalesRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                                    <Phone size={16} className="text-accent" />
                                    <span><span className="block text-xs text-ink-muted">Bán hàng</span><span className="text-lg font-bold tabular-nums">{businessInfo.hotlineSales}</span></span>
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${businessInfo.hotlineServiceRaw}`} className="flex items-center gap-3 hover:text-accent transition-colors">
                                    <Wrench size={16} className="text-accent" />
                                    <span><span className="block text-xs text-ink-muted">Kỹ thuật 24/7</span><span className="text-lg font-bold tabular-nums">{businessInfo.hotlineService}</span></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-ink-muted">
                    <div className="flex items-center gap-5">
                        <span>© {new Date().getFullYear()} Kim Long Motor</span>
                        <button onClick={() => scrollTo('ve-chung-toi')} className="hover:text-ink cursor-pointer">Về chúng tôi</button>
                        <button onClick={() => scrollTo('bang-bao-gia')} className="hover:text-ink cursor-pointer">Báo giá</button>
                    </div>
                    <div className="flex items-center gap-3">
                        <SocialIconButton href={businessInfo.youtubeUrl} label="YouTube"><Youtube size={16} /></SocialIconButton>
                        <SocialIconButton href={businessInfo.tiktokUrl} label="TikTok"><span className="text-sm">♪</span></SocialIconButton>
                    </div>
                </div>
            </div>

            <div aria-hidden="true" className="select-none pointer-events-none mt-10 -mb-[0.18em] text-center font-extrabold tracking-tighter leading-none text-[17vw] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)] whitespace-nowrap">
                KIM LONG MOTOR
            </div>
        </footer>
    );
};

export default Footer;
```

- [ ] **Step 3: Verify**

Run: `npx eslint src/components/QuoteFormSection.jsx src/components/Footer.jsx` → no errors. `npm run build` → `✓ built in`.
Run: `grep -rn "ve-hong-thuong" src` → no output.
Run: `node scripts/ui-smoke.mjs` → `section bang-bao-gia heading visible` passes; no horizontal overflow on mobile (the oversized wordmark is clipped by `overflow-hidden`).
Manually: submit `123` → validation message; submit `0912345678` → success panel; in admin (http://localhost:5173/admin/leads, password `kimlong2026`) a lead with source `home-1click-quote` appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/QuoteFormSection.jsx src/components/Footer.jsx
git commit -m "feat: cinematic quote CTA and noir footer with oversized wordmark"
```

---

### Task 10: Sub-pages — shared PageHero

**Files:**
- Create: `src/components/PageHero.jsx`
- Modify: `src/pages/ProductCategory.jsx`, `src/pages/NewsListPage.jsx`, `src/pages/AboutPage.jsx`, `src/pages/ContactPage.jsx`

**Interfaces:**
- Consumes: `SplitHeading`, `Reveal` (Task 1)
- Produces: `<PageHero eyebrow title description image crumbs={[{label, to?}]} />`

- [ ] **Step 1: Create `src/components/PageHero.jsx`:**

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './motion/Reveal';
import SplitHeading from './motion/SplitHeading';

// Shared noir hero for sub-pages. Always dark, so the transparent navbar that
// sits on top of it stays legible.
const PageHero = ({ eyebrow, title, description, image, crumbs = [] }) => (
    <section className="relative overflow-hidden bg-noir-950 pt-36 sm:pt-44 pb-16 sm:pb-24">
        {image && (
            <>
                <img src={image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-b from-noir-950/60 via-noir-950/70 to-noir-950" />
            </>
        )}
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
            {crumbs.length > 0 && (
                <Reveal as="nav" aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <Link to="/" className="hover:text-ink">Trang chủ</Link>
                    {crumbs.map((c) => (
                        <React.Fragment key={c.label}>
                            <span className="text-white/25">/</span>
                            {c.to ? <Link to={c.to} className="hover:text-ink">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
                        </React.Fragment>
                    ))}
                </Reveal>
            )}
            {eyebrow && (
                <Reveal className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent mb-5">{eyebrow}</Reveal>
            )}
            <SplitHeading as="h1" className="max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-ink">
                {title}
            </SplitHeading>
            {description && (
                <Reveal delay={0.1}>
                    {/* May carry CMS copy (e.g. the About intro) — excluded from brand checks. */}
                    <p data-cms-content className="mt-6 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">{description}</p>
                </Reveal>
            )}
        </div>
    </section>
);

export default PageHero;
```

- [ ] **Step 2: ProductCategory — use PageHero, drop the inline breadcrumb**

In `src/pages/ProductCategory.jsx`:
1. Add `import PageHero from '../components/PageHero';` after the `Navbar` import.
2. Replace the whole `{/* Hero */} <section className="relative h-72 md:h-96 overflow-hidden"> … </section>` block with:

```jsx
            <PageHero
                eyebrow="Sản phẩm"
                title={category ? category.name : 'Tất cả dòng xe'}
                description={category ? category.description : 'Toàn bộ dòng xe thương mại Kim Long Motor phân phối chính hãng.'}
                image={HERO_IMAGE}
                crumbs={[{ label: 'Sản phẩm', to: '/category/all' }, { label: category ? category.name : 'Tất cả' }]}
            />
```

3. Delete the `{/* Breadcrumb */} <nav className="flex mb-8 …"> … </nav>` block.
4. In the CTA banner paragraph, replace `đội ngũ tư vấn Kim Long Miền Nam` with `đội ngũ tư vấn Kim Long Motor`.
5. In the pills, replace `bg-red-600 text-white` with `bg-accent text-white`.
6. Change the page wrapper `<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">` to `<div className="min-h-screen bg-noir-950">`.
7. Replace the product card — the whole `<div key={product.id} className="group bg-white dark:bg-gray-800 rounded-xl …" onClick={…}> … </div>` inside `categoryProducts.map(...)` — with the same stage-card treatment as the home page (API products use `name`, `image`, `badges[]`, `highlights[{label,value}]`, `priceDisplay`, `slug`):

```jsx
                            <article
                                key={product.id}
                                onClick={() => navigate(`/product/${product.slug || product.id}`)}
                                className="group cursor-pointer rounded-[22px] bg-graphite-800 border border-line overflow-hidden flex flex-col transition-colors hover:border-white/20"
                            >
                                <div className="relative p-3 bg-[radial-gradient(ellipse_at_50%_70%,#2B313B_0%,#1A1D23_70%)]">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-graphite-700">
                                        {product.image && (
                                            <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        )}
                                    </div>
                                    {product.badges?.[0] && (
                                        <span className="absolute top-6 left-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            {product.badges[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="px-5 pb-5 pt-3 flex-1 flex flex-col">
                                    <h3 className="text-base font-bold text-ink leading-snug line-clamp-2">{product.name}</h3>
                                    <dl className="mt-3 text-xs sm:text-[13px]">
                                        {(product.highlights || []).slice(0, 3).map((s) => (
                                            <div key={s.label} className="flex justify-between gap-3 py-2 border-t border-line">
                                                <dt className="text-ink-muted shrink-0">{s.label}</dt>
                                                <dd className="text-ink text-right truncate">{s.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                                        <span className="text-sm text-ink-muted truncate">{product.priceDisplay || 'Liên hệ'}</span>
                                        <span className="text-sm font-semibold text-accent group-hover:translate-x-1 transition-transform">Chi tiết →</span>
                                    </div>
                                </div>
                            </article>
```

8. Change the grid wrapper `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6` to `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`, and the CTA banner `border-2 border-dashed border-red-300 dark:border-red-800 rounded-xl p-8 text-center bg-white dark:bg-gray-800 transition-colors duration-300` to `rounded-[24px] p-10 text-center border border-line bg-graphite-800`.

- [ ] **Step 3: NewsListPage — use PageHero**

In `src/pages/NewsListPage.jsx`:
1. Add `import PageHero from '../components/PageHero';` after the `Navbar` import.
2. Change `<div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">` to `<div className="min-h-screen bg-gray-50 dark:bg-gray-900">`.
3. Replace the `{/* Hero */} <section className="relative h-64 md:h-80 overflow-hidden"> … </section>` block with:

```jsx
                <PageHero
                    eyebrow="Tin tức"
                    title="Cẩm nang vận tải & tin tức Kim Long Motor"
                    description="Cập nhật tin thương hiệu, sản phẩm mới và kiến thức vận tải."
                    image={HERO_IMAGE}
                    crumbs={[{ label: 'Tin tức' }]}
                />
```

4. In the sidebar CTA paragraph (around the old line 122), replace `Kim Long Miền Nam sẽ gọi lại` with `Kim Long Motor sẽ gọi lại`.
5. In `ArticleCard` (top of the file): replace `<span>{item.author}</span>` with `<span>Kim Long Motor</span>` (CMS author values are "Miền Nam Group/Auto"); add `data-cms-content` to the `<h3 …>{item.title}</h3>` and to the `<p …>{item.excerpt}</p>`; change the category badge `bg-red-600` to `bg-accent`.

- [ ] **Step 4: AboutPage — use PageHero**

In `src/pages/AboutPage.jsx`:
1. Add `import PageHero from '../components/PageHero';` after the `Navbar` import.
2. Change `<div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">` to `<div className="min-h-screen bg-gray-50 dark:bg-gray-900">`.
3. Replace the `{/* Hero */} <section className="bg-white dark:bg-gray-800 …"> … </section>` block (old lines 91–118) with:

```jsx
                <PageHero
                    eyebrow="Về chúng tôi"
                    title="Kim Long Motor — vững bước tiên phong"
                    description={parsed.intro}
                    image={images[0]}
                    crumbs={[{ label: 'Giới thiệu' }]}
                />
```

4. Everything after the hero is rendered from `parsed.*` (CMS). Directly after the PageHero there is `{!loading && (` followed by a fragment `<>` (old line 121); change that `<>` to `<div data-cms-content>` and its matching closing `</>` (just before the `)}` that ends the `!loading` block) to `</div>`.
5. Replace these literal strings: `alt="Kim Long Miền Nam"` → `alt="Kim Long Motor"`; `alt="Trụ sở Kim Long Miền Nam"` → `alt="Trụ sở Kim Long Motor"`; `alt="Đội ngũ Kim Long Miền Nam"` → `alt="Đội ngũ Kim Long Motor"`; `alt="Nhân viên Kim Long Miền Nam"` → `alt="Nhân viên Kim Long Motor"`; `<p …>Miền Nam Auto</p>` → `<p …>Kim Long Motor</p>`; `Hồ Sơ Năng Lực Kim Long Miền Nam` → `Hồ Sơ Năng Lực Kim Long Motor`.

- [ ] **Step 5: ContactPage — use PageHero, keep the stats as a hairline row**

In `src/pages/ContactPage.jsx`:
1. Add `import PageHero from '../components/PageHero';` and `import { PrimaryButton, GhostButton } from '../components/ui/Buttons';` after the `Navbar` import.
2. Change `<div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">` to `<div className="min-h-screen bg-gray-50 dark:bg-gray-900">`.
3. Replace the `{/* Split hero */} <section className="grid grid-cols-1 lg:grid-cols-2"> … </section>` block (old lines 71–108) with:

```jsx
                <PageHero
                    eyebrow="Liên hệ"
                    title="Liên hệ ngay với Kim Long Motor"
                    description="Đội ngũ tư vấn Kim Long Motor sẵn sàng hỗ trợ bạn lựa chọn dòng xe phù hợp và mức giá tốt nhất."
                    crumbs={[{ label: 'Liên hệ' }]}
                />
                <section className="bg-noir-950 pb-16">
                    <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <PrimaryButton onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>Gửi yêu cầu</PrimaryButton>
                            <GhostButton as="a" href={`tel:${HOTLINE}`}>Hotline {HOTLINE_DISPLAY}</GhostButton>
                        </div>
                        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 border-t border-line">
                            {STATS.map((s) => (
                                <div key={s.label} className="py-8 pr-4 border-b lg:border-b-0 border-line">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-ink">{s.value}</div>
                                    <div className="mt-2 text-sm text-ink-muted">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
```

4. Replace the red band `<section className="bg-red-800 py-16">` opening tag with `<section className="bg-graphite-800 py-16 border-y border-line">`.
5. If `Phone` from lucide-react is now unused in the file, remove it from the import (eslint will flag it).

- [ ] **Step 6: Verify**

Run: `npx eslint src/components/PageHero.jsx src/pages/ProductCategory.jsx src/pages/NewsListPage.jsx src/pages/AboutPage.jsx src/pages/ContactPage.jsx` → no errors.
Run: `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs` → `/category/all`, `/news`, `/lien-he`, `/gioi-thieu` report `no forbidden brand strings` and `no console errors`.
Visually: every sub-page opens with the dark hero, navbar links are readable, breadcrumb and title reveal line by line.

- [ ] **Step 7: Commit**

```bash
git add src/components/PageHero.jsx src/pages/ProductCategory.jsx src/pages/NewsListPage.jsx src/pages/AboutPage.jsx src/pages/ContactPage.jsx
git commit -m "feat: shared noir PageHero for sub-pages, remove leftover brand strings"
```

---

### Task 11: Detail pages — news article on paper, product page brand fix

**Files:**
- Modify: `src/pages/NewsDetailPage.jsx`, `src/pages/ProductDetail.jsx`

**Interfaces:**
- Consumes: `bg-paper` token (Task 1)

- [ ] **Step 1: NewsDetailPage — article card on a light reading surface**

In `src/pages/NewsDetailPage.jsx` (main render, around old line 70):
1. Change `<div className="pt-24 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">` to `<div className="pt-28 pb-16 bg-noir-950 min-h-screen">`.
2. Change the article opening tag `<article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">` to `<article className="bg-paper text-gray-900 rounded-[24px] overflow-hidden">`.
3. Inside the `<article>` only, remove every `dark:`-prefixed class (the article must stay light even though `<html>` is `.dark`). In particular the body `<div className="prose prose-lg …">` becomes:

```jsx
                            <div
                                data-cms-content
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-accent prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
```

4. Replace `<span className="text-sm">{article.author}</span>` with `<span className="text-sm">Kim Long Motor</span>`.
5. Add `data-cms-content` to the excerpt `<div className="mb-8 p-6 …">`.
6. Change the "Quay lại danh sách tin tức" link classes `text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300` to `text-ink-muted hover:text-ink`.

- [ ] **Step 2: ProductDetail — brand string**

In `src/pages/ProductDetail.jsx`, replace `đội ngũ tư vấn Kim Long Miền Nam` with `đội ngũ tư vấn Kim Long Motor`.

- [ ] **Step 3: Verify**

Run: `npx eslint src/pages/NewsDetailPage.jsx src/pages/ProductDetail.jsx` → no errors. `npm run build` → `✓ built in`.
Open a news article from http://localhost:5173/news: dark page, light "paper" article card with dark readable text; author shows "Kim Long Motor". Open any product from http://localhost:5173/category/all: page renders in the noir palette via existing `dark:` classes, no console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/NewsDetailPage.jsx src/pages/ProductDetail.jsx
git commit -m "feat: news article on paper reading surface, product page brand fix"
```

---

### Task 12: Cleanup + full verification

**Files:**
- Delete: `src/hooks/useScrollAnimation.js`, `src/components/CategoryTiles.jsx`, `src/components/FeaturedProducts.jsx`
- Modify: `src/index.css`, `src/App.jsx` (comments only)

- [ ] **Step 1: Confirm the files are unused, then delete**

```bash
grep -rn "useScrollAnimation\|CategoryTiles\|FeaturedProducts" src --include=*.jsx --include=*.js | grep -v "^src/components/CategoryTiles.jsx\|^src/components/FeaturedProducts.jsx\|^src/hooks/useScrollAnimation.js"
```
Expected: no output. Then:

```bash
git rm src/hooks/useScrollAnimation.js src/components/CategoryTiles.jsx src/components/FeaturedProducts.jsx
```

- [ ] **Step 2: Remove dead CSS**

In `src/index.css` delete: the whole "Scroll-triggered animations (driven by useScrollAnimation hook)" block (`.scroll-fade-up` through `@keyframes scrollChildIn`), the `.hero-swiper .swiper-button-*` and `.hero-swiper .swiper-pagination*` rules (the hero uses its own controls), and the `.badge-gold` / `.badge-ev` rules.
Then check which legacy `brand-*` utilities are still used:

```bash
grep -rnoE "(bg|text|border|shadow|rounded)-brand-[a-z-]+" src --include=*.jsx | sort -u
```
For every token no longer used, delete its line from the `@theme` block (keep any still referenced, e.g. by `VehicleModal.jsx` or `QuickQuoteModal.jsx`).

- [ ] **Step 3: Tidy Home comments in `src/App.jsx`**

Make the `<main>` block read exactly:

```jsx
      <main>
        {/* Hero */}
        <HeroSlider />

        {/* 01 — Brand introduction */}
        <BrandIntro />

        {/* 02 — Real-world video showcase */}
        <VehicleShowcase />

        {/* 03 — Model range */}
        <VehicleCatalogSection
          onOpenDetail={handleOpenDetail}
          onOpenQuote={handleOpenQuote}
        />

        {/* 04 — Why Kim Long Motor */}
        <WhyKimLong />

        {/* 05 — Customers & handovers */}
        <CustomerStories />

        {/* 06 — News */}
        <NewsViral />

        {/* Quote CTA */}
        <QuoteFormSection />
      </main>
```

- [ ] **Step 4: Full verification**

Run: `npx eslint src/` → no errors in files touched by this plan (pre-existing errors in `QuickQuoteModal.jsx`, `VehicleModal.jsx`, `AdminAuthContext.jsx` may remain — report them, do not fix).
Run: `npm run build` → `✓ built in`.
Run: `node scripts/ui-smoke.mjs`
Expected: final line `ALL CHECKS PASSED`.

Then take before/after screenshots for the report (desktop 1440 and mobile 390) of `/`, `/category/all`, `/news`, one `/news/:id`, `/gioi-thieu`, `/lien-he`, and `/admin/login` (must look unchanged from before the redesign).

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "chore: remove superseded components, hooks and dead CSS"
```

---

## Open items to raise with the user (not part of this plan)

1. **CMS content in the production database** still names "Kim Long Miền Nam / Tập đoàn Đầu tư Miền Nam" in article bodies/excerpts, the about-page body, testimonial quotes and the `/whyChooseUs` / footer blocks. The UI no longer displays the section titles, but the body copy is untouched. Rewriting it changes factual company descriptions and touches the shared production DB — needs the user's explicit decision (edit via admin, or authorize a scripted update).
2. **About page "12 SHOWROOM" claim** describes the Miền Nam group's network; confirm it is accurate for Kim Long Motor before keeping it.
3. `npm run server` fails because `server/index.js` evaluates `db.js` before `loadEnv()` (ES import hoisting). Separate fix.
