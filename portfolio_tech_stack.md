# Tech Stack

## Philosophy
Build locally first, modularly, and page by page. Deployment comes later.

The stack should support:
- reusable components
- strong typography and theming
- smooth motion and page transitions
- scalable page composition
- clean maintainable code

## Core Stack
### Next.js
Use as the application framework for:
- routing
- layouts
- page architecture
- font loading
- future deployment flexibility

### React
Component model used through Next.js for:
- reusable UI primitives
- section-based page composition
- interaction logic

### TypeScript
Use for:
- typed props
- predictable component contracts
- safer refactoring as the site grows

### Tailwind CSS
Use for:
- utility-first styling
- fast implementation
- consistent spacing and responsive behavior

### Framer Motion
Use for:
- progressive scroll reveal
- hover interactions
- page slide/page-turn transitions
- cursor-linked motion behaviors where appropriate

## Typography Implementation
### Google font
- Instrument Serif via Next.js Google font loader

### Local fonts
- Neue Regrade via local font files
- Epoch via local font files

Use tokenized font roles:
- display
- serif accent
- body

## Design Tokens
Use CSS variables / theme tokens for:
- light and dark mode colors
- text colors
- surface colors
- accent color
- borders
- font variables
- spacing scale

## Recommended Supporting Libraries
### clsx / tailwind-merge
For cleaner class composition in reusable components.

### Lucide React
For minimal icon needs.

### Lenis (optional, later)
For smooth scrolling if needed after the base motion system is stable.

## Initial Non-Goals / Not Included at Start
- Vercel setup
- GSAP
- Three.js / React Three Fiber
- heavy component frameworks like MUI
- CMS
- database-backed content
- complex analytics

## Architecture
### Page structure
- Home
- Work
- Experiments
- About
- Contact
- CV

### Component structure
- layout primitives
- typography primitives
- reusable UI
- page-specific sections

### Content organization
Separate content/data from layout where practical:
- projects
- experiments
- about copy
- site metadata

## Styling Rules
- Tailwind for most styling
- token-driven colors and typography
- avoid hardcoded ad hoc values inside components
- no one-off giant page-level CSS when reusable primitives will do

## Motion Rules
- centralize motion presets
- reuse reveal and transition patterns
- avoid inventing a new motion language for each section

## Local Workflow
- Build and test locally first
- Focus on design system + homepage before later pages
- Ship page-by-page, not all at once

## Project Priorities
### Phase 1
- project scaffold
- font setup
- color tokens
- typography primitives
- homepage sections
- motion foundation

### Phase 2
- work and project pages
- about/contact/cv
- experiments page

### Phase 3
- advanced interactions
- signature features
- deployment
