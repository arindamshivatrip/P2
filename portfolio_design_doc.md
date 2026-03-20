# Product Design Document

## Design Intent
The portfolio should feel like an editorial-system hybrid: structured and mature at rest, but playful and tactile in interaction.

It should not read as:
- a generic designer portfolio
- a startup landing page
- a chaotic experimental playground

It should read as:
- technically strong
- visually intentional
- memorable
- interaction-aware

## Design Principles
1. **Structure first**  
   Layout and hierarchy do most of the work.

2. **Playful on interaction**  
   The site becomes more expressive through hover, cursor, scroll, and transitions.

3. **Contrast with discipline**  
   Serif and sans are mixed intentionally by role, not randomly.

4. **Readable before impressive**  
   Every interaction must preserve legibility and scanning.

5. **Modular but not monotonous**  
   Grids are used, but controlled asymmetry and variation prevent template feel.

## Visual Identity
### Tone
- Modern
- Tactile
- Slightly playful
- Controlled
- Distinct but not loud

### Palette
#### Light mode
- Background: #F5F4ED
- Surface: #ECECDC
- Text: #1F1F1F
- Secondary text: #5A5A5A
- Muted text: #8A8A8A
- Accent: #FF9932

#### Dark mode
- Background: #0F1113
- Surface: #172B36
- Text: #F5F4ED
- Secondary text: #CFCFCF
- Muted text: #9CA3AF
- Accent: #FF9932

### Color Rules
- Neutrals dominate.
- Accent is sparse and meaningful.
- Accent is used for emphasis, interactive cues, highlights, and motion-linked details.
- Avoid glow-heavy or gradient-heavy usage.

## Typography System
### Neue Regrade
Role: primary display/system  
Use for:
- hero
- major page titles
- section titles
- project titles

### Instrument Serif
Role: contrast/voice  
Use for:
- emphasized words or phrases
- pull quotes
- selected editorial moments

### Epoch
Role: body/UI  
Use for:
- paragraphs
- navigation
- buttons
- labels
- metadata
- descriptions

### Typography Rules
- Serif is a contrast layer, not the default.
- Sans carries the system.
- Body copy remains stable and readable.
- Font mixing must follow clear role assignment.

## Layout System
### General
- Use a grid system as the foundation.
- Introduce controlled asymmetry.
- Mix large and small modules for hierarchy.
- Avoid identical card patterns everywhere.

### Home page
- Strong hero with asymmetry.
- Selected work with one featured item and supporting items.
- Lens section as modular system map.
- Experiments preview as lighter, more playful module set.
- Contact CTA as a strong closing beat.

### Work page
- Editorial-system structure.
- Slight variation in project module scale.
- Clear metadata and hierarchy.

### Experiments page
- More playful and exploratory than Work.
- Supports modular cards and richer hover states.
- Can tolerate slightly more visual experimentation.

## Motion System
### Overall motion intent
- Progressive reveal on scroll.
- Tactile hover feedback.
- Slide-in page transitions with page-turn feel.
- Calm at rest, more expressive on intent.

### Motion Rules
- Use a limited motion vocabulary.
- Body text motion should be restrained.
- Headlines and cards can carry stronger reveal behavior.
- No chaotic or disconnected animation styles.

### Scroll behavior
- Fade + slight translate
- Staggered entrances for grouped cards
- Content should unfold, not pop

### Page transitions
- Horizontal slide / page-turn feeling
- Should feel like moving between spreads
- Smooth and confident, not flashy

### Hover behavior
- Cursor shift or custom cursor states on interactive modules
- Information reveal on project hover
- Slight image zoom or content emphasis
- Hover should reveal meaning, not just decoration

## Cursor System
- Small accent-colored dot cursor globally
- Richer cursor states on interactive elements only
- Must not break text selection or core usability
- Should feel precise, not toy-like

## Components
### Foundation components
- Header
- Footer
- Section wrapper
- Container
- CTA button
- Labels / metadata blocks

### Page-level modules
- Hero
- Selected Work
- Lens Grid
- Experiment Cards
- Contact CTA
- Case Study sections

### Reuse principle
Every page should be composed from reusable primitives and section modules rather than one-off layouts.

## Responsive Behavior
- Maintain hierarchy on smaller screens.
- Preserve typography contrast without oversized overflow.
- Motion should remain lightweight and readable on mobile.
- Hover-dependent interactions must degrade gracefully on touch.

## Accessibility
- Respect reduced-motion settings.
- Maintain readable contrast.
- Keep focus states visible and intentional.
- Ensure motion does not hide content or meaning.

## Future Extensions
- Signature interactive section(s)
- Chatbot / AI guide
- Live system panel or “currently building” module
- More advanced experiment interactions

## Design Success Test
The design is successful if it feels:
- more personal than a template
- more playful than a static editorial portfolio
- more readable than an experimental site
- clearly built by someone technical with strong taste
