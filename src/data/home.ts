export const homeHeader = {
  wordmark: "Arindam Shiva Tripathi"
};

export const heroContent = {
  supporting:
    "I work across AI systems, interaction design, and spatial computing — building tools and experiences that stay clear under complexity and keep human judgment in the loop.",
  primaryCta: "Start a conversation",
  signal: "MS HCI at the University of Maryland · previously L'Oréal Singapore & SP Digital"
};

export type HeroTrailFragment =
  | { kind: "tile"; label: string; gradient: string; src?: string; alt?: string }
  | { kind: "word"; text: string };

// Gradient families for the trail tiles — drawn from the app's navy→orange
// identity, varied so adjacent projects never share a wash. Full literal class
// strings so Tailwind's content scan picks up the arbitrary values.
const trailGradients = {
  navyOrange: "bg-gradient-to-br from-[#0f1e47] via-[#2a2550] to-[#ff8a4c]",
  ember: "bg-gradient-to-br from-[#ff8a4c] via-[#b1472a] to-[#3a1b16]",
  plum: "bg-gradient-to-br from-[#4a2540] via-[#6b2f45] to-[#ff8a4c]",
  night: "bg-gradient-to-br from-[#0b1533] via-[#241a4a] to-[#4a2a6a]",
  dusk: "bg-gradient-to-tr from-[#12203f] via-[#5a3a5c] to-[#ff9d5c]"
} as const;

// Flow-follow trail deck: minimal project tiles (short company/category labels)
// with a few italic craft words as secondary accents. Add an optional `src` to
// a tile later to render a real crop in place of the gradient.
export const heroTrailFragments: HeroTrailFragment[] = [
  { kind: "tile", label: "L'ORÉAL", gradient: trailGradients.navyOrange },
  { kind: "word", text: "prototype" },
  { kind: "tile", label: "NIANTIC", gradient: trailGradients.night },
  { kind: "tile", label: "VR", gradient: trailGradients.ember },
  { kind: "word", text: "research" },
  { kind: "tile", label: "SHOPEE", gradient: trailGradients.plum },
  { kind: "tile", label: "DATA", gradient: trailGradients.dusk },
  { kind: "tile", label: "AR", gradient: trailGradients.navyOrange },
  { kind: "word", text: "build" },
  { kind: "tile", label: "UX", gradient: trailGradients.ember }
];

export const projectsContent = {
  title: "Selected Work"
};

export const lensesContent = {
  headingLineOne: "The work changes.",
  headingLineTwo: "The throughline doesn't."
};

export type LensStatementSegment = {
  text: string;
  accent?: boolean;
};

// One set statement instead of five cards — the accented terms are the lenses.
export const lensesStatement: LensStatementSegment[] = [
  { text: "I write " },
  { text: "code", accent: true },
  { text: " that holds up in real use, " },
  { text: "design", accent: true },
  { text: " interfaces that stay clear under complexity, keep " },
  { text: "accessibility", accent: true },
  { text: " and real human constraints at the center, prototype " },
  { text: "XR", accent: true },
  { text: " and embodied interaction, and lean on " },
  { text: "research", accent: true },
  { text: " to test what actually gets built." }
];

export const closingCtaContent = {
  heading: "Go one level deeper.",
  supporting:
    "The case studies carry the process, decisions, and outcomes — that’s the good part.",
  primaryCta: "Explore the work",
  secondaryCta: "Get in touch"
};

export const footerContent = {
  name: "Arindam Shiva Tripathi",
  description:
    "A modular portfolio exploring AI systems, interaction design, and spatial computing.",
  availability: "Open to 2026 internships & full-time roles",
  note: "Built with care and a questionable amount of iteration."
};
