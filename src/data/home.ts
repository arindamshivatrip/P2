export type LensItem = {
  id: string;
  title: string;
  body: string;
};

export const homeHeader = {
  wordmark: "Arindam Shiva Tripathi"
};

export const heroContent = {
  supporting:
    "I work across AI systems, interaction design, and spatial computing — building tools and experiences that stay clear under complexity and keep human judgment in the loop.",
  primaryCta: "Start a conversation",
  panel: [
    "Builder, researcher, technologist",
    "HCIM @ UMD",
    "Working across AI, interaction, and XR"
  ]
};

export const projectsContent = {
  title: "Selected Work"
};

export const lensesContent = {
  label: "Section 02",
  headingLineOne: "The work changes.",
  headingLineTwo: "The throughline doesn't.",
  intro:
    "Across projects, I keep returning to the same core interests: building clearly, designing thoughtfully, and understanding how technology fits into people's lives."
};

export const lensItems: LensItem[] = [
  {
    id: "lens-1",
    title: "Coding",
    body: "Building robust systems across frontend engineering, interactive tooling, and product-focused implementation."
  },
  {
    id: "lens-2",
    title: "Design",
    body: "Shaping interfaces, flows, and visual systems with clarity, hierarchy, and interaction in mind."
  },
  {
    id: "lens-3",
    title: "Accessibility",
    body: "Designing with usability, inclusion, and real human constraints at the center of the experience."
  },
  {
    id: "lens-4",
    title: "XR",
    body: "Exploring immersive systems, spatial interfaces, and embodied interaction through AR, VR, and mixed reality work."
  },
  {
    id: "lens-5",
    title: "Research",
    body: "Using qualitative and quantitative methods to understand behavior, test ideas, and improve what gets built."
  }
];

export const closingCtaContent = {
  heading: "Still Curious?",
  supporting:
    "There’s more here in the work, the details, and the systems behind them.",
  primaryCta: "Explore the work",
  secondaryCta: "Say hello"
};

export const footerContent = {
  name: "Arindam Shiva Tripathi",
  description:
    "A modular portfolio exploring AI systems, interaction design, and spatial computing.",
  availability: "Open for collaboration",
  note: "Built with care and a questionable amount of iteration."
};
