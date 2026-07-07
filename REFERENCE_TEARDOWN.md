# REFERENCE_TEARDOWN

Teardown of six reference sites for the portfolio polish. Read alongside
[DESIGN_GUARDRAILS.md](./DESIGN_GUARDRAILS.md) (taste rules) and
[CREATIVE_DIRECTION.md](./CREATIVE_DIRECTION.md) (where these lessons land).

Research method: fetched page content + documented prior knowledge of these
well-known sites. Interaction details for the JS-heavy sites (Snellenberg,
Cuberto) are partly from prior knowledge and should be re-verified live before
imitating any specific timing or easing.

---

## 1. Rauno Freiberg

**URL:** https://rauno.me/ (and https://rauno.me/craft)

**Structurally:** Personal site split into Craft (50+ pieces in a
reverse-chronological grid, February 2026 back to April 2021), Projects,
Field Notes (writing), and History of Software Design (research/essays). No
category filters on the craft grid — the diversity of the work *is* the
statement. Email contact is a copy-to-clipboard button with a "Copied"
confirmation state.

**Visually:** Typography-first minimalism. Light neutral background, near-black
text, muted gray metadata, generous whitespace between small thumbnail cards.
His design philosophy is stacked as declarative lines on the homepage: "Make it
fast. Make it beautiful. Make it consistent. … Make it soulful. Make it."

**Interactively:** Deliberately restrained. No entrance animations, no custom
cursor, no scroll theatrics. Subtle hover states on cards; the clipboard button
is the most "designed" interaction on the page. The restraint reads as
confidence because the individual craft pieces carry the motion.

**Worth borrowing:**
- The unfiltered chronological craft stream — quantity and variety over
  taxonomy — for a lab/experiments page.
- Zero entrance theatrics on index pages; content is visible on first paint.
- One tiny, perfect utility interaction (clipboard email with feedback) instead
  of many mediocre ones.

**Dangerous to copy:**
- The "Make it…" stacked-philosophy framing — it's his signature voice, and any
  variation reads as imitation.
- Full-sparse minimalism without a philosophy behind it — on a warmer, more
  personal site it would read as unfinished, not intentional.

**Safe adaptation for Arindam:** Restructure `/experiments` as a
reverse-chronological, unfiltered stream of dated entries — a running lab log
rather than a curated masonry gallery. Keep the cream/orange warmth; the borrow
is the *organizational logic*, not the aesthetic.

---

## 2. Devouring Details (Rauno Freiberg)

**URL:** https://devouringdetails.com/

**Structurally:** Not a portfolio — an interactive reference manual for
interaction design. Organized as 8 principles (inferring intent, interaction
metaphors, ergonomic interactions, simulating physics, motion choreography,
responsive interfaces, contained gestures, drawing inspiration), 12 live
prototypes (Line Minimap, Scroll Strip, Radial Timeline, Morph Surface…), and
supporting resources. Two-column reading layout with anchored navigation.

**Visually:** Clean, neutral, readable — the visual design gets out of the way
so the embedded prototypes can be the color and energy on the page.

**Interactively:** The core idea: **interactions that demonstrate rather than
decorate**. The prototypes are live React components embedded in the page — you
learn the principle by feeling it. Every microinteraction exists to teach the
thing it's attached to.

**Worth borrowing:**
- The demonstration principle: an interaction earns its place by proving a
  capability or explaining an idea, never by decorating.
- Live embedded prototypes as the highest-credibility proof a design engineer
  can offer.
- Physics/spring motion that feels ergonomic rather than showy.

**Dangerous to copy:**
- The 8-principles intellectual framework or anything resembling a competing
  "interaction manual" product.
- The insider/`behind-the-scenes` framing — it works because of Rauno's Vercel /
  Arc / cmdk track record.

**Safe adaptation for Arindam:** Embed 1–2 experiments as *live* interactive
demos on `/experiments`, starting with the 3D tilt card that already exists at
`/mobile_card` — surfaced inline as a lab exhibit instead of hidden on a
standalone route. The site starts proving "I build interactions" instead of
claiming it.

---

## 3. Tobias Ahlin

**URL:** https://tobiasahlin.com/ · https://tobiasahlin.com/projects/

**Structurally:** Sectional single-flow homepage: hero ("I design, tinker, &
teach.") → blog (8 featured articles) → exactly three open-source projects
(SpinKit, Moving Letters, TypeSource) → work history (GitHub, Minecraft/Mojang,
Spotify) → contact. Writing and tools are treated as first-class craft
artifacts, equal to client work.

**Visually:** Restrained, typographic, sectional. Neutral ground; the animated
open-source projects supply the color and personality.

**Interactively:** Quiet. Standard hover affordances, no custom cursor, no
transitions that call attention to themselves — notable discipline from someone
famous for animation libraries.

**Worth borrowing:**
- Ruthless curation: three projects, chosen to represent thinking, not volume.
- Outcome-phrased one-liners: "browse typefaces by how they look and feel,
  rather than by their name and attributes."
- Credentials listed plainly, without hero narratives.

**Dangerous to copy:**
- The "I design, tinker, & teach" tagline rhythm — a three-verb variation reads
  as deliberate mimicry.
- His blog + OSS portfolio mix wholesale; Arindam's equivalent artifacts are
  experiments and research, not libraries.

**Safe adaptation for Arindam:** Rewrite every archive-rail project one-liner in
outcome form ("Year · Org — what it did for whom"), and hold Selected Work on
the homepage to exactly three projects.

---

## 4. Rachel Chen

**URL:** https://www.rachelchen.tech/

**Structurally:** Minimal nav (Work, Fun, About, Resume). One-line positioning:
"I'm Rachel, a product designer who engineers." Chronological grid of 8
projects, each carrying company, role scope, and an honest outcome status —
"shipped," "handed off," "concept." Compact experience timeline
(Notion, Bloomberg, 1Password, RBC).

**Visually:** Near-monochrome, text-first, dense but breathable. The restraint
supports the engineer half of the positioning.

**Interactively:** Essentially static — links and standard hover states. The
craft lives entirely in curation and voice.

**Worth borrowing:**
- Honest status vocabulary. "Concept" next to "shipped" builds more trust than
  a wall of badges.
- Sharp one-liners that lead with the outcome: "Bringing autofill to macOS,"
  "The world's first AI poker coach."
- Dual-identity positioning stated in one sentence, then proven by the work mix.

**Dangerous to copy:**
- The minimalism without her positioning — generic minimal reads as boring.
- Status labels that aren't true; the honesty is the feature.

**Safe adaptation for Arindam:** Replace chip clutter on work tiles with a
single honest status word per project — shipped / research / in progress /
confidential — drawn from the existing `status` and `nda` fields in
`src/data/projects.ts`.

---

## 5. Dennis Snellenberg

**URL:** https://dennissnellenberg.com/

**Structurally:** Home, Work, About, Contact. Work page lists 11 projects with
service / location / year metadata plus a 66-project archive. Contact page is a
numbered progressive form (01–05). Footer shows live local time in CET.
Multilingual rotating greeting on load.

**Visually:** Large contemporary type, high contrast, premium spacing, imagery
given real estate. The scale of the type is the first impression.

**Interactively:** His signature is the **work-list hover preview** — hovering a
project row summons a large media panel that follows the cursor with smooth
spring easing. Polished page transitions, magnetic buttons, rounded-mask
section reveals. Everything is buttery; nothing stutters.

**Worth borrowing:**
- The large-type work index with hover media previews — the single best pattern
  for making browsing feel expressive without SaaS cards.
- The live local-time footer detail — a small precision signal.
- Big, confident contact/footer moment as a designed destination, not an
  afterthought.

**Dangerous to copy:**
- The multilingual greeting (affectation without an international client base).
- His exact phrasing ("No nonsense, always on the cutting edge").
- A half-polished version of the hover preview — janky is worse than absent.

**Safe adaptation for Arindam:** A hover media preview on a large-type work
index, with a **designed typographic/theme-gradient fallback** for the many
projects that currently lack real media — so the pattern degrades gracefully
instead of exposing the asset gap. Plus a live local-time line in the footer.

---

## 6. Cuberto

**URL:** https://cuberto.com/ · https://cuberto.com/projects/ ·
https://cuberto.com/blog/cuberto-mouse-follower/

**Structurally:** Agency site (Services, Projects, Company, Blog, Contacts);
20+ projects in a filterable grid; two office addresses; thought-leadership
blog.

**Visually:** Bold, saturated, media-dominant. Premium agency energy — the
opposite pole from Rauno.

**Interactively:** Signature is the open-source `mouse-follower` cursor: a
custom cursor that trails the pointer with delayed spring follow and velocity
skew, can absorb media (images/video inside the cursor), morph over targets,
and runs at 60fps on GSAP. It works as an agency credential: "we can code
anything." Hover states are theatrical; transitions are showreel-grade.

**Worth borrowing:**
- The idea that cursor behavior can carry *contextual meaning* (view / play /
  drag) rather than decoration.
- The bar it sets for smoothness: interactive flourishes are only acceptable at
  60fps.

**Dangerous to copy:**
- The mouse follower itself at full strength — agency showiness is inauthentic
  on a solo designer-engineer site, and a laggy cursor is worse than none.
- Media-in-cursor effects — they magnify weak imagery, and project media is
  currently the site's weakest asset.
- Adding GSAP or the mouse-follower library — violates the no-new-dependencies
  guardrail; Framer Motion springs can do the restrained version.

**Safe adaptation for Arindam:** At most a 12px contextual cursor dot built
with the existing Framer Motion `useSpring`, desktop-only (`pointer: fine`),
morphing to a "View"/"Play" affordance over interactive media, mounted in one
place so removing one line removes the feature. Explicitly optional and
last-priority — the site must stand without it.

---

## Shared lessons

1. **Positioning precedes design.** All six sites answer "what do you do and
   why are you different?" in one sentence before any visual choice matters.
   Arindam's is already strong: designer-engineer for human-centered AI/XR.
2. **Interactions must reinforce positioning.** Snellenberg's previews and
   Cuberto's cursor say "we sweat details and can code." For a design engineer,
   demonstrated interaction craft *is* the portfolio.
3. **Restraint is a statement only when paired with a visible philosophy.**
   Rauno and Tobias earn their sparseness; sparse-without-spine reads
   unfinished.
4. **Micro-details compound:** clipboard feedback, live timestamps, honest
   status labels. Cheap to build, disproportionate in perceived intentionality.
5. **Curation over comprehensiveness.** Three great projects beat eight mixed
   ones; an honest "concept" label beats an inflated metric.
6. **The smoothness bar is absolute.** Every reference that uses expressive
   motion ships it flawless. Anything that can't hit 60fps gets cut, not
   shipped at 45.
