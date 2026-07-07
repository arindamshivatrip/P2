# INTERACTION_SYSTEM_PLAN

A maintainable interaction system for the recommended direction
(**The Living Lab**, see [CREATIVE_DIRECTION.md](./CREATIVE_DIRECTION.md)).
Everything here builds on the existing stack — Framer Motion 12,
`src/lib/motion.ts`, `src/components/ui/reveal.tsx` — with **zero new
dependencies**. Taste rules in [DESIGN_GUARDRAILS.md](./DESIGN_GUARDRAILS.md)
apply to every item: if a motion has no job, it doesn't ship.

---

## 1. Hover previews

**Component:** `WorkRowPreview` (new, `src/components/work/work-row-preview.tsx`)

- One floating panel per work index, mounted once at grid level, driven by the
  hovered row's project.
- Framer Motion `AnimatePresence` for enter/exit (opacity + slight scale,
  ~180ms); vertical position spring-follows the cursor (`useSpring` on
  `useMotionValue`), clamped inside the viewport.
- `pointer-events: none`, `aria-hidden="true"` — purely presentational; the row
  itself carries all semantic content.
- Media source order: `project.video` (muted, plays on hover) →
  `project.thumbnail` → **designed typographic fallback**: theme-keyed gradient
  (from existing `getFallbackCoverImage()` in `src/lib/tile-media.ts`) +
  project title set in display type + status word. The fallback is designed
  first; media upgrades it later.
- Gated to `(hover: hover) and (pointer: fine)` — never mounts on touch.

## 2. Cursor behavior

**Default: none.** The site ships complete without cursor work.

**Optional (Phase 3, last priority):** `CursorDot`
(`src/components/ui/cursor-dot.tsx`)

- 12px accent dot, spring-follow with slight lag; morphs to a small labeled
  affordance ("View", "Play") over work rows and live demos via a
  `data-cursor` attribute contract.
- Built entirely on existing Framer Motion `useSpring` — no library.
- Mounted in exactly one place (root layout); deleting that one line removes
  the feature. Native cursor is never hidden (`cursor: none` is not used) — the
  dot accompanies, it doesn't replace.
- Never mounts on touch, coarse pointers, or reduced motion.
- Kill criteria: any visible lag on a throttled CPU, or if in review it reads
  as agency showreel → cut without renegotiation.

## 3. Page & section transitions

- **Section entrances:** keep the existing `Reveal` (fade-up) as the only
  scroll-entrance primitive. Tune `viewport.amount` per page so first paint is
  never blank (the `/work` regression must not recur).
- **Display headings:** new `TextReveal`
  (`src/components/ui/text-reveal.tsx`) — line-masked stagger
  (overflow-hidden line wrappers, translateY + opacity per line, ~60ms
  stagger). Used on hero and top-level page headings only, not on every
  heading.
- **Route transitions:** a single 250ms opacity fade via `src/app/template.tsx`.
  No slides, no masks, no shared-element choreography.

## 4. Card & media motion

- Standardize on the existing `hoverLift` variant + `--shadow-card-hover`
  token; delete one-off `hover:-translate-y-*` utilities as encountered.
- Inner-media pointer parallax on Selected Work tiles: max ~4px translate on a
  spring; media only, never the card layout, never text.
- All motion is `transform`/`opacity` only. Nothing animates `width`, `height`,
  `top`, or triggers layout.
- Videos: `muted playsInline preload="metadata"`, play on hover/in-view, pause
  off-screen.

## 5. Scroll behavior

- **Native scroll.** No Lenis, no scroll-jacking, no smooth-scroll library.
- No scroll-linked animation beyond what exists (about-page parallax rail
  stays, capped as-is).
- Anchor jumps use CSS `scroll-behavior: smooth` with a reduced-motion
  override.

## 6. Reduced-motion fallback

- The global CSS kill-switch in `globals.css` stays as the safety net.
- Every new primitive (`TextReveal`, `WorkRowPreview`, `MagneticCTA`,
  `CursorDot`, `LabExhibit`, hero spring rule) checks `useReducedMotion()` and
  renders its static end-state: text fully visible, preview appears without
  spring (simple fade or instant), CTAs static, cursor dot absent, demos as
  posters, accent rule static.
- Fix the known gap: lens-card hover lift currently lacks a reduced-motion
  guard (flagged in MAINTAINABILITY_REVIEW) — covered by migrating it to the
  shared `hoverLift` primitive.

## 7. Mobile fallback

- **Rule: no information exists only behind hover.** Work rows always render
  thumbnail + title + one-liner + status + year inline on touch layouts.
- Live demos render a poster with an explicit tap-to-activate affordance;
  deactivate on scroll-away.
- Cursor dot and magnetic CTAs never mount (`pointer: fine` + `hover: hover`
  media query gating at the component level, not CSS-hiding after mount).
- Tap targets ≥ 44px; the large-type index rows are natural tap targets.

## 8. Reusable components & tokens

| Piece | Location | Job |
|---|---|---|
| `TextReveal` | `src/components/ui/text-reveal.tsx` | Line-masked heading reveal |
| `WorkRowPreview` | `src/components/work/work-row-preview.tsx` | Hover media preview |
| `MagneticCTA` | `src/components/ui/magnetic-cta.tsx` | Wraps existing `Button`; 4–6px pointer attraction, desktop-only |
| `LabExhibit` | `src/components/experiments/lab-exhibit.tsx` | Live-demo wrapper: poster state, tap/hover activation, reduced-motion poster |
| `CursorDot` (optional) | `src/components/ui/cursor-dot.tsx` | Contextual cursor accompaniment |
| `UppercaseLabel` | `src/components/typography/uppercase-label.tsx` | Codifies the repeated `text-[0.68rem] uppercase tracking-[0.16em]` one-off |
| Spring tokens | `src/lib/motion.ts` | `springs.snappy`, `springs.settle`, `springs.follow` — the only three spring configs allowed |

Rule: no inline spring configs in components; all timing/easing comes from
`src/lib/motion.ts`. New interaction = new entry there first.

## 9. What NOT to animate

- Body text, paragraphs, and one-liners (opacity via `Reveal` at section level
  is the ceiling).
- Navigation beyond the existing active underline. No menu theatrics.
- Footer links, filter chips themselves (the *grid* animates on filter, the
  chips don't), form fields.
- Anything on `/cv` and `/privacy-policy` — utility pages stay instant.
- Page backgrounds — no gradient drift, no blobs (guardrail).
- Text parallax of any kind; scroll-jacked sequences; autoplaying motion above
  the fold other than the one-time hero text reveal.
- Loading states — no skeleton shimmer; content is statically rendered.

## 10. Performance budget

- 60fps or cut — the reference-site bar is absolute.
- `transform`/`opacity` only; `will-change` only on the preview panel and
  cursor dot while active.
- No new JS dependencies; new interaction code target ≤ ~6KB gzipped total.
- Verify with production build size diff and a throttled-CPU pass on `/` and
  `/work` before each batch merges.
