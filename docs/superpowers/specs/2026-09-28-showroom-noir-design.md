# Showroom Noir — Kim Long Motor site redesign

Status: approved 2026-09-28
Branch: `redesign/showroom-noir` (checkpoint `6d07dc8`)

## Goal

Replace the current mixed light/dark/red landing page with one cohesive,
premium "automotive showroom" visual language plus scroll-driven animation,
then apply the same system to the public sub-pages.

## Problems being fixed

1. Background rhythm jumps dark → white → dark → white → solid red → white …
2. Brand leftovers: "Miền Nam Auto", "Kim Long Miền Nam", "Miền Nam Group"
   (10 files + `server/data/content.json`); navbar repeats "KIM LONG" next to
   a logo that already reads "KIM LONG MOTOR".
3. Rendering bugs: showcase section leaves a large empty black area while
   scrolling; ~500px blank gap before the quote form; broken testimonial
   avatar (alt text shown); navbar links unreadable on light sub-page heroes.
4. Product cards: inconsistent photo backgrounds, 2–3 stacked badges, heavy
   uppercase red buttons.
5. Typography: nearly every heading is bold uppercase, no hierarchy.
6. Animation: fade-up on enter only; nothing scroll-linked, no fade-out.

## Design system

Tokens (Tailwind v4 `@theme` in `src/index.css`):

| Token | Value | Use |
|---|---|---|
| `noir-950` | `#0A0B0D` | primary background |
| `noir-900` | `#111317` | alternate sections, footer |
| `graphite-800` | `#1A1D23` | cards, raised surfaces |
| `line` | `rgba(255,255,255,0.08)` | 1px hairlines |
| `ink` / `ink-muted` | `#F4F5F7` / `#9AA1AC` | primary / secondary text |
| `accent` | `#D91C24` | primary CTA, section numbers, underlines only |
| `paper` | `#F6F5F2` | light reading surfaces (article body, long forms) |

- Font: Plus Jakarta Sans. Display headings 48–88px, weight 700–800,
  negative tracking, sentence case. Only small eyebrows (11–12px, wide
  letter-spacing) are uppercase. Max 3 type levels per section.
- Layout: every home section carries a number `01–06` + eyebrow + heading;
  12-column grid; 120–160px vertical rhythm on desktop.
- Buttons: exactly two variants — Primary (red pill with arrow-in-circle)
  and Ghost (1px hairline border, white text). Hover: slight lift, arrow
  slides.
- The previous light-theme tokens (`brand-*`) are retired for public pages.
  Admin pages are unchanged.

## Animation system

Dependencies: `gsap` (with ScrollTrigger) and `lenis`.

Reusable primitives in `src/components/motion/`:

- `SmoothScroll` — Lenis instance wired to ScrollTrigger; mounted once.
- `Reveal` — fade + 24px translate; plays on enter, reverses when scrolled
  past (bidirectional).
- `SplitHeading` — heading lines slide up from behind a mask, staggered.
- `ImageReveal` — clip-path wipe + scale 1.15 → 1 (scrubbed, so it doubles
  as the subtle scroll-linked depth effect; no separate Parallax primitive).
- `Counter` — rolling number on enter.

All primitives render static, fully visible content when
`prefers-reduced-motion: reduce` is set.

## Home page structure

| # | Section | Notes |
|---|---|---|
| — | Hero | Keep approved design; add line-by-line headline reveal and slow image zoom. Navbar drops the duplicate "KIM LONG" wordmark. |
| 01 | Brand introduction | Large full-width statement; 4 metrics on hairline dividers with counters (replaces white cards). |
| 02 | Real-world showcase (video) | Rebuilt with GSAP pin: video pinned left, crossfades per scene while scrolling. Fixes the empty-area bug. |
| 03 | Model range | "Stage" cards: tabs Xe Khách / Xe Tải / Xe Chuyên Dùng as underline tabs; graphite card with a uniform gradient stage behind every vehicle photo; at most one badge; spec rows on hairlines; Ghost button + arrow. |
| 04 | Why Kim Long Motor | Replaces the solid red block; 4 numbered reasons + revealed image. Absorbs the former "expert team" section (hotlines). Fixes "Miền Nam Auto". |
| 05 | Customers & handovers | Merges video channels + testimonials: horizontal marquee of handover photos + large pull quote. Fixes broken avatar. |
| 06 | News | Keep 1 large + 3 small layout, dark surface, image reveals. |
| — | Quote CTA | Cinematic block, blurred vehicle photo behind; one phone field + red button. Removes the blank gap above. |
| — | Footer | Noir; oversized brand wordmark across the bottom. |

## Other pages

- Shared `PageHero` for category, news list, about, contact: noir
  background with dimmed photo, breadcrumb, line-reveal title. Fixes navbar
  legibility.
- Category: reuse the stage card and hairline spec rows.
- Product detail: adopts the noir palette through its existing `dark:`
  classes (public routes force `.dark`; `gray-950/900/800` are remapped to
  the noir scale); only brand strings are edited.
- CMS-sourced text is marked `data-cms-content` and is not rewritten.
- News detail: header/footer in noir, article body on `paper`.
- Admin: unchanged.
- Remove all "Miền Nam Auto / Kim Long Miền Nam / Miền Nam Group" strings.

## Verification

- `eslint` + `vite build` after each step.
- Playwright (system Edge) screenshots at 1440px and 390px for every public
  page, compared before/after.
- Check `prefers-reduced-motion` renders all content statically.

## Out of scope

- Admin UI restyle.
- New backend features (email provider stays a stub).
- Hero video scrollytelling (hero stays the approved image carousel).
