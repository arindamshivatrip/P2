export type HomeProject = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visualTone: "featured" | "supportingA" | "supportingB";
  featured?: boolean;
};

export type LensItem = {
  id: string;
  title: string;
  body: string;
};

export const homeHeader = {
  wordmark: "Arindam Shiva Tripathi",
  cta: "Get in touch"
};

export const heroContent = {
  eyebrow: "Builder · Researcher · Technologist",
  headlineLineOne: "Ideating, designing, and building",
  supporting:
    "A builder and researcher working across AI systems, interaction design, and spatial computing. I design and ship products where clarity, performance, and human judgment matter.",
  primaryCta: "Start a conversation",
  secondaryCta: "View selected work",
  panel: [
    "Builder, researcher, technologist",
    "HCIM @ UMD",
    "Working across AI, interaction, and XR"
  ]
};

export const projectsContent = {
  label: "Section 01",
  title: "Selected Work"
};

export const homeProjects: HomeProject[] = [
  {
    id: "proj-1",
    title: "Applied ML Planning Studio",
    description:
      "An internal planning platform combining machine learning, forecasting, and interaction design to support decision-making across APAC markets.",
    tags: ["AI Systems", "Product", "L'Oréal"],
    visualTone: "featured",
    featured: true
  },
  {
    id: "proj-2",
    title: "ShooT_IT",
    description:
      "An augmented reality laser-tag experience combining real-time feedback, connected play, and physical interaction design.",
    tags: ["AR", "Systems", "Prototyping"],
    visualTone: "supportingA"
  },
  {
    id: "proj-3",
    title: "Phone Case Study",
    description:
      "A human-centered product case study focused on how everyday physical objects can be redesigned through research, usability thinking, and interaction insight.",
    tags: ["Research", "Product", "Interaction"],
    visualTone: "supportingB"
  }
];

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
  label: "Section 03",
  heading: "Still curious?",
  supporting:
    "There's more here — in the work, the details, and the systems behind them.",
  primaryCta: "Explore the work",
  secondaryCta: "Say hello",
  contactLine: "arindamtrip@gmail.com"
};

export const footerContent = {
  name: "Arindam Shiva Tripathi",
  description:
    "A modular portfolio exploring AI systems, interaction design, and spatial computing.",
  availability: "Open for collaboration",
  note: "Built with care and a questionable amount of iteration."
};
