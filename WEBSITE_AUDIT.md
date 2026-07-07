# Website Audit — Arindam Tripathi Portfolio
_Audited 2026-07-07. Stack: Next.js 15, React 19, Tailwind 3, Framer Motion, TS. Typecheck: PASS._

## 1. Positioning
- Hero headline is strong and ownable ("I design and build systems for people").
- **`siteMeta.description` is literal scaffold placeholder text** ("A modular portfolio scaffold focused on systems, storytelling, and interaction") — ships to search/social. Critical.
- Hero side panel (3 bullet card) is visually weak vs. the headline; reads as filler.
- No immediate proof point above the fold (no logos, metrics, or current status chip).

## 2. Visual design
- Token system is good: CSS vars → Tailwind mapping (`globals.css` + `tailwind.config.ts`). Fonts: Neue Regrade (display), Instrument Serif (accent italic), Epoch (body).
- Dark mode tokens fully defined (`.dark`) but **no theme toggle exists** — dead code or missing feature.
- Lens cards ("Coding / Design / …") are 5 identical flat boxes — monotonous.
- Cards use one heavy shadow token everywhere; no depth hierarchy (rest vs hover vs modal).
- Accent orange `#FF9932` used well but hover states are mostly color-only; little motion polish on cards.

## 3. Portfolio strategy
- Metrics exist and are great (−90% access time, +50% findability, 200+ users) — underused on Home.
- **Most project `thumbnail`/`coverImage` paths in `src/data/projects.ts` point to files that don't exist** (only `placeholder-*.png` exist in `public/images/projects/`). Tiles render as empty gradient boxes → biggest credibility gap.
- `/work` first paint is nearly blank below the filter row (reveal-on-scroll + masonry leaves a large empty viewport before scrolling).
- Project Archive rail has no context (year/org/one-liner missing on cards).
- Ordering is good (featured L'Oréal first). Confidential-summary handling is smart.

## 4. Copy
See WEBSITE_COPY_NOTES.md. Summary: headlines good; CTAs and section subcopy generic ("Still Curious?", "thoughtful collaboration", "Say hello"); meta description broken.

## 5. Interaction polish
- Header: solid (sticky, blur, active underline, accessible mobile menu with animated burger).
- Work filters: no visible loading/empty feedback; unclear if counts change.
- Reveal animations fine but cause blank-viewport issue on /work.
- Footer is minimal-good; could carry nav + status + email for recruiter exit path.

## 6. Technical quality
- **Only 4 files use `next/image`**; project tiles/media largely skip image optimization (partly because images are missing).
- **No per-page `metadata`** for /work, /experiments, /about, /contact, /cv (only root layout + the two [slug] pages + mobile_card).
- **No `sitemap.ts`, no `robots.ts`, no OG image** (`opengraph-image`), no canonical URLs.
- Typecheck passes. Scrollbar styling nicely themed. `suppressHydrationWarning` on html suggests planned theme switching never landed.
- Fonts: 8 OTF weights of Neue Regrade loaded — consider trimming to used weights (400/500/600) and converting to woff2.

## 7. Consistency
- Good: shared Section/Container/DisplayHeading/BodyText/Button primitives; data-driven pages (`src/data/*`).
- Minor: hardcoded header heights (`4.4rem`), raw rgba colors in scrollbar CSS, `mobile_card` route uses a separate CSS module pattern unlike everything else, route name `mobile_card` breaks kebab-case convention.

## Verification available
- `npm run typecheck` (passes), `npm run lint`, `npm run build`, `npm run dev` + Claude preview tool (works — used for this audit, desktop + mobile viewports).
