# Design Guardrails for Future Edits

These rules exist to keep the site editorial, restrained, and authentic — not SaaS-template-like.

## Visual Patterns

### No decorative numbering
- Index numbers, step counts, or ordering markers are **forbidden** unless editorially justified (e.g., annotated process steps, actual footnotes).
- Rationale: Numbering on cards/tiles is the #1 SaaS-template red flag. It signals "designed to be organized" rather than *actually organized*.
- Exception: Page numbers, footnote anchors, or explicit instruction sequences (1. Read → 2. Learn → 3. Build).

### No excessive pills/chips/badges
- Status badges, achievement badges, skill badges, and tag-like elements should be **minimal and textual**.
- Hard limit: 1 badge per section. If you need more, use inline text instead.
- Avoid: rounded-full + border + px-3 py-1.5 patterns on cards/tiles.
- Rationale: Badges are attention-seeking. They feel commercial. On a portfolio, they're noise.
- Exception: Tags on projects are contextual, not decorative (keep them, they're useful).

### No fake or forced metrics
- Metrics (e.g., "200+ users") are **only for case-study detail pages** where they support narrative.
- Never use metrics on index/marketing pages (home, /work summary) as "social proof."
- Rationale: On index pages, metrics feel like startup pitch-deck language. On detail pages, they're credible evidence.
- Safe: Include outcomes in the project description as prose ("reduced access time by 90%").

### No generic SaaS cards
- Cards should **not** have:
  - Overlay labels or badges (date + category chips on images)
  - Artificial visual hierarchy (too many font sizes, colors, borders)
  - Stacked info patterns (visual + metric + tags + description all competing for attention)
- Rationale: SaaS templates overload cards with info density. Portfolio cards should be scannable, not dense.
- Safe: Title + one-liner summary + tags + one call-to-action per card.

### No gradient blobs for decoration
- Background gradient blobs, radial overlays, or accent glows are **forbidden** for aesthetic reasons.
- Rationale: They mark the site as "designed with Figma vibes." Keep the background clean.
- Exception: Subtle gradients in video overlays or dark theme depth are ok if they support usability (not just looks).

### No glassmorphism overload
- Blur, transparency, and frosted-glass effects are **acceptable only if functional**.
- Example: A nav bar with blur-backdrop is ok. A button with backdrop-blur is not.
- Rationale: Glassmorphism is overused in modern templates. Restraint = taste.
- Rule of thumb: If you remove the backdrop-blur and the interface still works, it was decorative.

### No motion unless it has a job
- Animation is **only for navigation, state change, or interaction feedback**.
- Forbidden: auto-playing animations, decorative entrance effects, wiggle/bounce on hover.
- Safe: Fade-in on scroll, slide-in navigation, button state feedback.
- Rationale: Motion on a portfolio says "I made this pretty for pretty's sake." Let the work speak.
- Accessibility: All motion must respect `prefers-reduced-motion: reduce`.

## Code Patterns

### No new dependencies without strong justification
- Before adding a package, ask: "Does this solve a problem I cannot solve with Tailwind + existing libs?"
- Rationale: The stack (Next.js, React, Tailwind, Framer Motion, Embla) is sufficient. More dependencies = more maintenance.
- Exception: If a package is industry-standard (e.g., shadcn for components) and adds real capability.

### All visual patterns must be reusable or tokenized
- If you create a style (padding, color, border, shadow) used in 2+ places, it **must** be a token, component, or `@apply` utility.
- If you add a visual element (button variant, badge style, card header), it **must** be a component.
- Rationale: One-off styles are technical debt. They make refactoring harder and inconsistency easier.
- Example: The `--shadow-card-hover` token is good. The `bg-black/35 backdrop-blur-sm` on visual labels is not (it's one-off).

### Respect accessibility and prefers-reduced-motion
- All interactive elements must be keyboard accessible (`focus-visible` rings).
- All motion must be skippable or respect `@media (prefers-reduced-motion: reduce)`.
- Color contrast must meet WCAG AA.
- Rationale: Accessibility isn't a checklist — it's part of good design.

## Copy Patterns

### Avoid marketing language
- Forbidden: "Seamlessly," "Powerful," "World-class," "Beautiful," "Innovative," "Next-generation," "Solutions."
- Rationale: You're a person, not a startup. Let your work speak.
- Safe: Active verbs, concrete nouns, honest language.

### Be specific, not vague
- Forbidden: "Always learning," "Passion for tech," "Problem solver," "Creative thinker."
- Safe: "Focused on AI systems," "2026 internships in UX engineering," "Built 5 AR experiences."
- Rationale: Specificity = credibility.

### Match copy to audience
- Recruiters want: roles, years of experience, tech stack, outcomes.
- Users want: what the work is, why it matters, what they'll learn.
- Rationale: Same portfolio, different angles — tailor the message without changing the work.

## Decision Framework

**When in doubt, ask yourself:**

1. Does this pattern appear in every SaaS landing page template I've seen? (If yes, reconsider.)
2. Does this remove friction or add visual interest? (Choose remove friction.)
3. Would Arindam have designed this if he were doing it by hand, not in Figma? (Honest answer required.)
4. Can I explain this design choice in one sentence without using words like "modern," "clean," or "minimalist"?

**The rule:** If it exists to make something look designed, it shouldn't exist. If it exists to make something work better, keep it.
