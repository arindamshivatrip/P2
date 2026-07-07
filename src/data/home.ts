export const homeHeader = {
  wordmark: "Arindam Shiva Tripathi"
};

export const heroContent = {
  supporting:
    "I work across AI systems, interaction design, and spatial computing — building tools and experiences that stay clear under complexity and keep human judgment in the loop.",
  primaryCta: "Start a conversation",
  signal: "MS HCI at the University of Maryland · previously L'Oréal Singapore & SP Digital"
};

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
