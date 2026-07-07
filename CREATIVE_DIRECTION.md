# CREATIVE_DIRECTION

Three distinct creative directions for the portfolio polish. Each is bold
enough to make the site feel noticeably different while preserving the core
identity: human-centered AI/XR/HCI, designer-engineer credibility, calm
editorial warmth on the cream/orange base, personal not corporate.

All three inherit the taste rules in
[DESIGN_GUARDRAILS.md](./DESIGN_GUARDRAILS.md) and assume the reverts flagged
in [AIISM_REVIEW.md](./AIISM_REVIEW.md) (hero status chip, 01/02 index numbers,
homepage metrics, overlay labels, hero blur blob) happen first — the bold layer
lands on a clean base. Reference evidence lives in
[REFERENCE_TEARDOWN.md](./REFERENCE_TEARDOWN.md).

**Recommended: Direction B — The Living Lab.** Rationale and batches in
[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).

---

## Direction A — Warm Broadsheet

**One-sentence vibe:** A beautifully set design journal — oversized confident
typography, editorial rhythm, and calm choreographed motion doing all the
talking.

**Homepage changes**
- Full-viewport typographic hero: headline scales to ~`clamp(3rem, 9vw, 8.5rem)`
  with a line-masked staggered reveal; Instrument Serif italic on "design" and
  "build" becomes the ink accent of the whole system.
- The side panel collapses into one quiet signal line under the headline
  ("Currently: UMD HCI · Previously: L'Oréal Singapore · SP Digital").
- The five identical lens cards become a single set prose statement — one
  well-typeset paragraph where the five lenses appear as accent-underlined
  terms inline. Kills the card monotony and the numbering in one move.
- Selected Work: exactly three projects, larger media area, tighter captions.

**Work page changes**
- Replace the card grid with a large-type index list: project titles at display
  scale (~3–4rem) in rows, quiet right-aligned metadata (year · org · status).
- Hovering a row summons a floating media preview panel (typographic/gradient
  fallback where media is missing).
- Archive rail keeps its carousel form but gets outcome-phrased one-liners.

**Experiments/lab changes**
- Rauno-style compact reverse-chronological stream: dated entries, small
  visuals, no filters. The variety is the message.

**Motion/interactions**
- Masked text reveals on display headings; staggered row entrances on the work
  index; hover preview with spring follow; 250ms route fades. Nothing else.

**Desktop behavior**
- Type scale is the first impression; hover previews are the second. No cursor
  work, no magnetic elements.

**Mobile behavior**
- Hero scales down via clamp; the work index rows show a static thumbnail and
  full metadata inline (nothing hover-gated); prose lenses reflow naturally —
  this direction is inherently mobile-safe.

**Implementation complexity:** Medium. Mostly layout + typography + two motion
primitives (`TextReveal`, `WorkRowPreview`).

**Risks**
- Large type is unforgiving: long project titles and mid breakpoints
  (768–1100px) need real design attention.
- The index list lives or dies on one-liner quality — copy work is on the
  critical path.
- Without a second layer of craft, it can read "tasteful" rather than
  "memorable."

---

## Direction B — The Living Lab  ← RECOMMENDED

**One-sentence vibe:** The portfolio behaves like one of Arindam's own
prototypes — a warm editorial surface where every interaction quietly proves he
engineers interfaces rather than just claiming it.

**Homepage changes**
- Everything from Warm Broadsheet's typographic hero, plus **one bespoke
  interactive moment**: the orange accent rule under the headline is a physical
  spring — the pointer can disturb it, it settles back with damped motion.
  Subtle, self-settling, ignorable; a signature detail, not a toy.
- Lenses as set prose (from A).
- Selected Work: three projects with pointer-aware inner-media parallax
  (capped ~4px) — tiles feel alive under the hand without moving layout.

**Work page changes**
- Large-type index with hover media previews (from A), plus:
- Filtering animates via Framer Motion `layout` — the index visibly re-sorts
  instead of snapping, making the filter system feel engineered.
- Honest status vocabulary per project: shipped / research / in progress /
  confidential (Rachel Chen's lesson), replacing chip clutter.
- Designed typographic fallback previews for media-less projects: theme-keyed
  gradient + project title set large + status word, so the preview pattern
  never exposes the asset gap.

**Experiments/lab changes**
- The centerpiece. `/experiments` becomes a lab bench:
  - Reverse-chronological dated stream (Rauno's logic).
  - Tiles carry lab-log metadata: tested / learned / output.
  - 1–2 tiles are **live embedded demos** — starting with the 3D tilt card that
    already exists at `/mobile_card`, mounted inline as an exhibit
    (Devouring Details' lesson: demonstrate, don't describe).

**Motion/interactions**
- Springs standardized in `src/lib/motion.ts`; every interaction maps to a
  demonstration purpose (the guardrail test: "what is this motion's job?").
- Optional, last-priority: a 12px desktop-only contextual cursor dot that
  morphs to View/Play over interactive media. One mount point, one-line
  removable. The site must stand without it.

**Desktop behavior**
- Hover previews on the work index; magnetic primary CTAs (4–6px attraction);
  live local-time in the footer; the hero spring detail; the lab demos running
  live.

**Mobile behavior**
- Previews become static thumbnails inside rows; live demos get a
  tap-to-activate poster state; cursor and magnetic effects never mount; the
  hero spring renders as a static rule. All information reachable without
  hover.

**Implementation complexity:** High, but cleanly stageable (editorial base
first, interaction layer second, lab exhibits third) and requires **no new
dependencies** — everything builds on Framer Motion 12 already in the repo.

**Risks**
- Guardrail tension: "no motion without a job" must be enforced per-interaction
  or this drifts into showreel. AIISM_REVIEW is the referee.
- Performance: springs + display type must stay transform/opacity-only; test on
  throttled CPU.
- The cursor dot is the highest-risk element — ship it last or not at all.

---

## Direction C — Quiet Cinema

**One-sentence vibe:** A warm, dim gallery where projects play like film
stills — full-bleed media, slow crossfades, and chaptered scroll doing the
storytelling.

**Homepage changes**
- Near-full-bleed featured project with ambient looping video under the
  headline; the cream palette shifts toward its existing (currently unused)
  dark theme after the hero, giving the site a dusk-gallery register.
- Sections become chapters with full-width transitions between them.

**Work page changes**
- Alternating full-width cinematic rows — one project per viewport, media
  scaling subtly with scroll, titles overlaid at display scale.
- Case-study pages open with full-bleed hero media and a slow settle.

**Experiments/lab changes**
- Contact-sheet aesthetic: dense grid of stills/clips, hover-to-play, dated
  like negatives.

**Motion/interactions**
- Scroll-driven media scale and crossfades; slow (400–600ms) eased transitions;
  media is the motion, UI stays still.

**Desktop behavior**
- The site reads as a screening room: media everywhere, chrome minimal.

**Mobile behavior**
- Full-bleed rows stack naturally; autoplay video replaced by poster frames
  with tap-to-play to protect data/perf; dark register must be checked for
  outdoor readability.

**Implementation complexity:** High — and gated on content, not code.

**Risks**
- **Disqualifying today:** the direction depends on strong real project media,
  and most tiles currently have none. It would amplify the site's weakest
  asset. Revisit if/when a real asset library exists.
- Ambient video is heavy: LCP and bandwidth costs need aggressive poster/lazy
  strategies.
- Dark-forward register risks losing the cream warmth that is core identity.

---

## Why B over A and C

- **A** is safe and achievable but is only half the positioning — it shows
  taste, not engineering. It survives inside B as B's editorial base.
- **C** is the most cinematic but is content-gated: without real media it makes
  the credibility gap *louder*.
- **B** turns the site itself into evidence for "designer-engineer," sidesteps
  the media gap by leading with type and interaction, and reuses what already
  exists (motion system, tilt-card demo, rich project data). It is the bold
  option that is also the honest one.
