# IMPLEMENTATION_PLAN

Execution plan for the portfolio polish. Direction options in
[CREATIVE_DIRECTION.md](./CREATIVE_DIRECTION.md); interaction spec in
[INTERACTION_SYSTEM_PLAN.md](./INTERACTION_SYSTEM_PLAN.md); reference evidence
in [REFERENCE_TEARDOWN.md](./REFERENCE_TEARDOWN.md). Taste rules in
[DESIGN_GUARDRAILS.md](./DESIGN_GUARDRAILS.md) and
[AIISM_REVIEW.md](./AIISM_REVIEW.md) override everything below.

---

## Recommended direction: B — The Living Lab

A warm editorial typographic base (oversized hero, large-type work index,
Instrument Serif ink accents) where every interaction demonstrably proves the
designer-engineer positioning: hover media previews, animated filter
re-sorting, a spring-physics signature detail, and live embedded lab demos.

**Why it fits Arindam's site:**

1. **It proves the positioning instead of claiming it.** "Designer-engineer for
   human-centered AI/XR" is best evidenced by interaction craft the visitor can
   feel — the Devouring Details lesson.
2. **It sidesteps the site's weakest asset.** Most project tiles lack real
   media. A type-and-interaction-led direction stays strong today and gets
   *better* as assets arrive; a media-led direction (Quiet Cinema) would
   amplify the gap.
3. **It builds on what exists.** Framer Motion 12, the `motion.ts`/`Reveal`
   system, the reduced-motion infrastructure, the rich `projects.ts` data
   model, and a ready-made live exhibit (`/mobile_card` tilt card). No new
   dependencies.
4. **It preserves the soul.** Cream/orange, editorial warmth, and the calm
   voice stay untouched; the boldness comes from scale and behavior, not a new
   skin.

---

## Batch 1 — Homepage / first impression

**Pages/components likely to change**
- `src/components/home/home-hero-section.tsx` — full-viewport typographic hero,
  `TextReveal`, interactive spring accent rule; remove status chip + blur blob
  (AIISM reverts); side panel → one signal line (`src/data/home.ts`).
- `src/components/home/home-lenses-section.tsx` — five cards → set prose with
  accent-underlined lens terms; removes 01/02 index numbers.
- `src/components/home/home-selected-projects-section.tsx` +
  `src/components/ui/project-card.tsx` — trim to 3 projects, remove homepage
  metrics, add inner-media pointer parallax.
- New: `src/components/ui/text-reveal.tsx`; extended: `src/lib/motion.ts`
  (spring tokens); `src/app/globals.css` (type scale variables if needed).

**Intended visible effect:** Opening the site at desktop feels like a
statement — display type at editorial scale resolving line by line, one alive
detail under the hand, and a calmer, more curated page below it.

**Desktop checks (1440px):** hero reveal plays once and settles; spring rule
disturbs and self-settles; no CLS from display type (check font loading); prose
lenses read as one designed block; three work cards with parallax capped ~4px.

**Mobile checks (375px):** hero clamps down cleanly with no horizontal
overflow; spring rule renders static; no hover-only information anywhere;
reduced-motion shows all text instantly.

**Verification commands**
```
npm run lint
npx tsc --noEmit
npm run build
```
Plus: preview server → screenshot `/` at 1440px and 375px; emulate
`prefers-reduced-motion` and re-check; console clean.

---

## Batch 2 — Work browsing / project presentation

**Pages/components likely to change**
- `src/components/work/work-grid.tsx` — card grid → large-type index rows;
  Framer Motion `layout` animation on filter changes.
- `src/components/work/work-header.tsx`, `work-filters.tsx` — filters gain
  visible result feedback; header scaled to the new index.
- `src/components/work/project-tile-{featured,standard,immersive,rail,confidential}.tsx`
  — reconciled with row/index presentation; honest status vocabulary
  (shipped / research / in progress / confidential); overlay-label reverts.
- New: `src/components/work/work-row-preview.tsx` (hover preview);
  `src/lib/tile-media.ts` (designed typographic fallback preview).
- `src/data/projects.ts` — outcome-phrased one-liners for archive projects;
  status vocabulary mapping.

**Intended visible effect:** Browsing work feels expressive and engineered —
big confident title rows, a media (or designed-typographic) preview that glides
with the cursor, and filtering that visibly re-sorts instead of snapping.

**Desktop checks:** preview follows at 60fps with no jank on throttled CPU;
preview clamps inside viewport; filter re-sort animates without layout jump; no
blank first paint on `/work`; fallback previews look designed, not missing.

**Mobile checks:** rows render static thumbnail + full metadata inline; filters
usable with visible result count; tap targets ≥44px; archive rail swipes
cleanly.

**Verification commands**
```
npm run lint
npx tsc --noEmit
npm run build
```
Plus: preview server → hover several rows (media and fallback cases), click
every filter, screenshot `/work` at 1440px/375px; reduced-motion pass (preview
appears without spring); perf sanity on `/work` (no long tasks while hovering).

---

## Batch 3 — Experiments + footer/contact + final polish

**Pages/components likely to change**
- `src/components/experiments/*` — grid → reverse-chronological lab stream;
  hero/artifact/fragment tiles carry tested/learned/output lab-log metadata.
- New: `src/components/experiments/lab-exhibit.tsx` — live demo wrapper;
  first exhibit embeds the `/mobile_card` 3D tilt card inline.
- `src/components/layout/site-footer.tsx` — crafted sign-off: bigger contact
  moment, live local time + timezone, availability line matched to contact copy.
- `src/components/contact/*` — presence pass on the existing (already concrete)
  copy; email gets copy-to-clipboard with "Copied" feedback.
- Optional last: `src/components/ui/cursor-dot.tsx` (per kill criteria in the
  interaction plan).
- Debt cleanup: `UppercaseLabel` component; migrate lens hover to `hoverLift`
  (fixes the missing reduced-motion guard); font-weight trim to used weights if
  time allows.

**Intended visible effect:** Experiments read as a working lab — dated, honest,
with at least one demo you can actually touch. The footer becomes a destination
that closes every page with craft instead of trailing off.

**Desktop checks:** tilt-card exhibit runs at 60fps and never steals scroll;
footer clock ticks with correct timezone; clipboard shows feedback; cursor dot
(if kept) has zero visible lag, otherwise cut.

**Mobile checks:** exhibit is tap-to-activate from a poster state; footer
stacks cleanly; everything reachable without hover; lab stream scrolls fast.

**Verification commands**
```
npm run lint
npx tsc --noEmit
npm run build
```
Plus: preview server → interact with the exhibit (activate/deactivate), verify
footer time and clipboard, screenshot `/experiments` + footer at 1440px/375px;
**full-site reduced-motion pass** (every page); production build size diff vs.
pre-Batch-1 baseline (new interaction JS ≤ ~6KB gzipped).

---

## Biggest risks to watch

1. **Guardrail drift.** The interaction layer is one indulgence away from
   agency showreel. Every added motion answers "what is its job?" in the PR
   description; AIISM_REVIEW.md is the taste referee and wins ties.
2. **Hover-preview quality.** Janky is worse than absent (the Snellenberg
   lesson). Ship the designed typographic fallback first, media second; if the
   spring-follow can't hit 60fps on a throttled CPU, simplify to a fixed-slot
   fade.
3. **Missing project media.** No interaction system fixes a content gap. Asset
   production (real thumbnails, short capture clips) is a parallel workstream —
   the fallback previews buy time, they are not the end state.
4. **Performance/CLS.** Display-scale type + springs are the two most likely
   regressions. Transform/opacity only, font loading checked for layout shift,
   build-size diff per batch.
5. **The cursor dot.** Highest showreel risk, lowest information value. Last
   priority, one-line removable, cut on the first sign of lag or taste doubt —
   the site must stand without it.
