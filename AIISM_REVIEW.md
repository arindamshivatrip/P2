# AI-ism and Taste Review

## Tier 1: KEEP (good changes)

- **Fixed scaffold metadata** (`src/data/site.ts`) — replaced placeholder "modular portfolio scaffold" with real description. ✓
- **Per-page metadata** (`src/app/{work,experiments,about,contact,cv}/page.tsx`) — SEO correctness. ✓
- **Fixed footer links** (`src/components/layout/site-footer.tsx`) — LinkedIn/GitHub were broken `href="#"`. Now real URLs. ✓
- **Build/typecheck/lint passing** — no technical debt introduced. ✓
- **Global `:focus-visible` treatment** (`src/app/globals.css`) — consistent, accessible. ✓
- **`--shadow-card-hover` token** — consolidated 9 hardcoded hover shadows into one token. Good DRY. ✓
- **About headline rewrite** — "Engineering taught me how. *People* taught me why." Genuine and personal, not generic. ✓
- **Work page intro** — "Case studies across AI systems..." adds context without filler. ✓
- **Contact copy specificity** — "2026 internships, full-time roles in PDE, human-AI, UXE, XR" is concrete, not vague. ✓
- **Tighter CTA copy** — "Go one level deeper" and "Get in touch" are clearer than "Still Curious?" and "Say hello." ✓

## Tier 2: REVISE (good intent, problematic execution)

### 1. Status chip on hero ("OPEN TO 2026 INTERNSHIPS & FULL-TIME ROLES")
**File:** `src/components/home/home-hero-section.tsx` (lines 18–22)

**Why it feels off:** It's a SaaS/startup badge pattern — the dot, the pill shape, the uppercase label above the headline. Screams "Framer template" or product hunt. In isolation it reads as recruitment messaging, not editorial.

**What a more restrained alternative would be:** Either:
- Cut it entirely; let the headline/supporting copy do the work.
- Or if you want to signal availability: subtle, centered line below the headline ("Seeking 2026 roles in…") in text-muted, no badge/dot/pill.

**Action:** REVERT the chip. Keep the status *only* in the footer (it's contextually correct there as a closing signal).

---

### 2. Index numbers on lens cards (01, 02, 03…)
**File:** `src/components/home/home-lenses-section.tsx` (lines 28–31)

**Why it feels off:** Decorative numbering is a UI kitsch marker. Without an explicit reason (e.g., a process with steps, or footnote-style references), it signals "designed to feel organized" rather than *being* organized. It's the #1 AI-template red flag.

**What a more restrained alternative would be:** Remove the numbers. The grid already conveys the five disciplines. The labels (Coding, Design, …) are sufficient.

**Action:** REVERT the index numbers. Keep the border-t-2 accent line — that adds quiet visual hierarchy without being decorative.

---

### 3. Metric callouts on Selected Work cards ("200+ USERS")
**File:** `src/components/home/home-selected-projects-section.tsx` (lines 62, 79, 96)
**Underlying component:** `src/components/ui/project-card.tsx` (lines 28–35)

**Why it feels off:** Large accent-colored metrics feel like startup landing-page social proof. "200+ USERS" next to a title reads as "look how validated this is" rather than "here's what I delivered." Context matters: it might work on a case-study detail page, but on the homepage Selected Work section it feels promotional.

**What a more restrained alternative would be:** Either:
- Include a *tiny* metric as body text in the summary: "…reduced access time by 90%." as part of the description.
- Or cut them from Selected Work and surface them only on the actual case-study detail pages.

**Action:** REVISE. Remove metrics from the homepage Selected Work cards. Optionally keep them on `/work/[slug]` detail pages where they support narrative.

---

### 4. Visual labels on project card overlays ("2025 · AI Systems")
**File:** `src/components/ui/project-card.tsx` (lines 68–73, 80–85)
**Usage:** `src/components/home/home-selected-projects-section.tsx` (lines 63, 80, 97)

**Why it feels off:** The semi-transparent black chip with year+category overlaid on the image looks like a design-system component from a UI kit. It reads as a label applied *after* the fact, not editorial information. The backdrop-blur and rounded-full badge are too "designed."

**What a more restrained alternative would be:** Either:
- Don't label the visual at all; let the card title and description carry context.
- Or if you want context, put it in the text (e.g., "2025" and "AI Systems" above the card title in small caps), not as an overlay.

**Action:** REVERT the visualLabel prop and its usage. The cards are stronger without it.

---

### 5. Top borders and hover lift on lens cards and side panel
**File:** `src/components/home/home-lenses-section.tsx` (line 28)
**File:** `src/components/home/home-hero-section.tsx` (line 43)

**Why it's borderline:** The border-t-2 + hover:-translate-y-0.5 pattern is subtle and defensible. It adds visual feedback and mild hierarchy. But it's part of the accumulated "designed-ness" — in isolation, it's ok; in sum with the numbers, chips, and metrics, it tips toward overdesigned.

**Verdict:** KEEP the top borders (they're subtle). REVISE the hover lift — remove the translate-y motion on lens cards. Keep it only on larger cards (project tiles) where the motion is more meaningful.

---

## Tier 3: POSTPONE (maybe later, not part of baseline)

- Fallback project visual labels (year · org) on archive rail cards — this is fine as contextual text, but the current implementation (truncation flex behavior) is fragile.
- Metric callouts in general — explore on case-study detail pages, not on marketing/index pages.
- **Pre-existing hero blur blob** (`home-hero-section.tsx:15`, `bg-accent/6 blur-3xl`) — not part of this diff, but it violates the new "no gradient blobs" guardrail. Candidate for removal in a future pass; flagged here so it isn't grandfathered in silently.

---

## Summary

**What feels AI-generated or SaaS-like:**
1. Status badge above headline (classic SaaS pattern)
2. Index numbers on cards (kitsch marker)
3. Metric callouts on homepage (startup landing-page social proof)
4. Overlay visual labels (post-hoc applied design)

**Why it matters:** These patterns are so common in AI-generated UI that they've become markers of inauthenticity. They feel like someone ran a figma template through GPT.

**Core issue:** The changes conflate "adding information" with "adding badges/chips." They're different. Add info in copy; avoid the badge pattern.
