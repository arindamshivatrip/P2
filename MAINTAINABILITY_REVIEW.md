# Maintainability Review

## One-off Styles Introduced

1. **Status chip styling** (`src/components/home/home-hero-section.tsx:18–22`)
   - Inline pill shape, dot icon, custom spacing
   - Not reused anywhere
   - If kept, should be a reusable component: `<StatusBadge label={status} />`

2. **Visual label badge** (`src/components/ui/project-card.tsx:68–73, 80–85`)
   - `bg-black/35 px-2.5 py-1 backdrop-blur-sm` repeated twice
   - Hardcoded colors and padding not tokenized
   - Should be a component or shared token if reused

3. **Metric display** (`src/components/ui/project-card.tsx:31–35`)
   - `font-display text-xl font-medium text-accent` + separate label
   - Used on 3 cards on homepage
   - Pattern could be extracted to `<MetricCallout value={} label={} />`

## Repeated Class Patterns That Should Be Tokenized

**Uppercase label pattern:**
- `font-body text-[0.68rem] font-medium uppercase tracking-[0.16em]`
- Appears in: hero panel label, lens card index (partially), footer status
- Should add a utility: `@apply uppercase-label` or component wrapper

**Badge/chip pattern:**
- `rounded-full border px-3 py-1.5 font-body text-[0.7rem]`
- Used on: status chip, visual labels
- Could be: `<Badge variant="pill" size="sm">` component

## Component Cleanliness Issues

**ProjectCard component bloat:**
- Added `metric` and `visualLabel` props without clear separation of concerns
- Component now does 4 things: displays visual + title + summary + metric + tags
- Could split into: `<ProjectCard>` (layout) + `<ProjectMetric>` (optional) + `<ProjectLabel>` (optional)

**HomeHeroSection changes:**
- Panel structure changed from simple array to object with label+lines
- Works, but now requires `heroContent.panel.label` and `heroContent.panel.lines`
- Data structure is slightly more complex for minimal benefit

**HomeLensesSection:**
- Adding index numbers couples the component to map order
- If order changes, numbers become misleading
- Index should not be part of component logic

## Complexity That Isn't Worth the Visual Gain

1. **visualLabel conditional rendering (2x)** — adds 14 lines of code for an optional overlay that reads artificial
2. **Index number calculation** — `String(index + 1).padStart(2, "0")` for decorative numbering
3. **Metric prop + separate label display** — adds complexity to ProjectCard when inline text would suffice
4. **Status chip with custom dot** — `<span className="h-1.5 w-1.5 rounded-full bg-accent" />` is over-engineered

## Design System Alignment

**What's in sync:**
- Shadow token consolidation (`--shadow-card-hover`) is good DRY
- Focus-visible global rule follows system
- Per-page metadata follows Next.js patterns
- Copy updates maintain voice

**What drifts:**
- New badge/chip patterns (status, visual-label) aren't in the design tokens or component library
- Hardcoded `px-2.5 py-1 bg-black/35 backdrop-blur-sm` doesn't use system spacing or colors
- Metric display doesn't follow a consistent `@apply` or component convention
- Index numbers on cards aren't a documented pattern

## Accessibility & Reduced Motion

**Issues found:**
1. Hover motion on lens cards (`hover:-translate-y-0.5`) — no `prefers-reduced-motion` check
   - Should respect: `@media (prefers-reduced-motion: reduce) { motion: none; }`
2. Overlay labels (`visualLabel`) use `aria-hidden="true"` correctly ✓
3. Status chip with dot — accessible ✓
4. Focus rings — global rule is good ✓

**Fix needed:** Add prefers-reduced-motion media query to any motion effects (currently not present).

## Summary of Maintainability Concerns

| Issue | Severity | Fix |
|-------|----------|-----|
| One-off badge styles | Medium | Extract to component/token or revert |
| Component prop bloat (ProjectCard) | Low | Acceptable for now, refactor if more props added |
| Index numbers coupling component to logic | Medium | Remove or make data-driven |
| Missing prefers-reduced-motion | Medium | Add global rule or inline checks |
| Visual label artificial pattern | High | Revert or move to detail pages only |
| Metric complexity for homepage | Medium | Simplify or remove from index |

**Verdict:** The codebase is still clean. Changes don't break the system, but they add conventions that aren't yet documented. If revisions go forward, codify new patterns as reusable components or tokens.
