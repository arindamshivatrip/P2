# Product Requirements Document (PRD)

## Product
Personal portfolio website for Ari.

## Purpose
Create a memorable, modular portfolio that presents Ari as a builder with strong design taste across software, AI, XR, interaction design, and human-centered systems.

## Primary Goals
- Present a clear, differentiated identity.
- Showcase selected work with strong storytelling and visual hierarchy.
- Support multiple professional lenses without fragmenting the site.
- Balance readability with playful interaction and motion.
- Build a maintainable, reusable front-end foundation.

## Non-Goals
- Not a generic SaaS-style portfolio.
- Not a purely editorial/fashion portfolio.
- Not a fully experimental 3D playground at launch.
- Not a resume-branch-specific site.

## Target Audiences
- Recruiters for software, UX engineering, HCI, AI systems, XR, and product engineering roles.
- Hiring managers evaluating taste, technical depth, and communication.
- Peers and collaborators.
- Curious visitors who want to explore Ari's work and experiments.

## Core Positioning
Ari builds thoughtful, expressive systems with technical rigor and strong visual judgment.

## Site Structure
1. Home
2. Work
3. Experiments
4. About
5. Contact
6. CV

## Core User Needs
### Recruiter / hiring manager
- Understand who Ari is within 10–20 seconds.
- See 3–5 strongest projects quickly.
- Access resume/CV easily.
- Understand technical breadth and design taste.

### Peer / collaborator
- Explore experiments and process.
- See interaction quality and systems thinking.
- Reach out quickly.

## Functional Requirements
### Home
- Hero with strong headline and supporting intro.
- Selected Work preview.
- Explore by Lens section.
- Experiments preview.
- Contact CTA.

### Work
- Project index with featured and supporting projects.
- Filtering or lens-based grouping.
- Distinct project cards with metadata.

### Project detail pages
- Problem / context
- What was built
- Key features / system details
- Outcomes / impact
- Reflection

### Experiments
- Smaller, modular explorations.
- More playful presentation than Work.
- Supports hover and motion richness.

### About
- Throughline connecting engineering, HCI, AI, XR, and accessibility.
- Short personal narrative.

### Contact
- Clean contact method(s), minimal friction.

### CV
- Embedded or integrated resume/CV page with download option.

## Experience Requirements
- Feels playful, tactile, and polished.
- Strong hover states and progressive reveal on scroll.
- Page transitions should feel like slide-ins / page-turns.
- Cursor system should support a small accent-colored dot with richer states on interactive elements.
- Motion should add cool factor without hurting readability.

## Brand Requirements
- Light and dark mode support.
- Accent color: #FF9932.
- Typography system:
  - Neue Regrade = primary display/system
  - Instrument Serif = contrast/voice
  - Epoch = body/UI

## Content Requirements
- One stable core identity across pages.
- Resume branches remain external/tailored assets; the site acts as the canonical narrative.
- Work can be read through multiple lenses:
  - Product / software engineering
  - UX / interaction
  - AI systems
  - XR / creative technology

## Accessibility Requirements
- Strong color contrast in both light and dark mode.
- Keyboard navigable interactive elements.
- Motion should respect reduced-motion preferences.
- Semantic structure and accessible labels.
- Cursor enhancements must not block basic usability.

## Success Criteria
- Homepage immediately communicates a strong point of view.
- Visitors can identify Ari's strongest work quickly.
- Site feels distinct without feeling kitschy.
- Codebase remains modular and reusable.
- New pages and experiments can be added with minimal structural rewrites.

## Risks
- Over-indexing on style over clarity.
- Too much motion degrading readability.
- Too many visual ideas breaking coherence.
- Resume-branch complexity leaking into site architecture.

## Launch Priorities
### Phase 1
- Design system
- Homepage
- Work page
- Core components
- Basic motion system

### Phase 2
- Project detail pages
- About, Contact, CV
- Experiments page

### Phase 3
- Advanced interactions
- Signature “crazy” interaction moments
- Optional richer motion / live modules / chatbot
