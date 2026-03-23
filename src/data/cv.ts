export type CvVersion = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const cvPageContent = {
  eyebrow: "RESUME / CV",
  title: "CV",
  intro:
    "A focused overview of my work across AI systems, interaction design, and engineering.",
  primaryLabel: "PRIMARY VERSION",
  primaryTitle: "Human-Centered AI Systems",
  primaryDescription:
    "The clearest snapshot of how I work across machine learning, product thinking, and interaction design.",
  primaryHref: "/files/arindam-tripathi-main-cv.pdf",
  primaryCta: "Download main CV",
  contactCta: "Contact me",
  secondaryLabel: "OTHER VERSIONS",
  secondaryIntro:
    "Role-specific versions, kept simple.",
  footerNote:
    "Need something more tailored? Reach out directly."
} as const;

export const cvVersions: CvVersion[] = [
  {
    title: "UX Engineering",
    description:
      "For UX engineer, design technologist, and interaction-heavy frontend roles.",
    href: "/files/arindam-tripathi-ux-engineering-cv.pdf",
    cta: "Download"
  },
  {
    title: "UX Research / UX Analytics",
    description:
      "For mixed-methods research, product insights, and evidence-based design roles.",
    href: "/files/arindam-tripathi-ux-research-cv.pdf",
    cta: "Download"
  },
  {
    title: "XR / Interactive Systems",
    description:
      "For XR, spatial computing, and immersive interaction roles.",
    href: "/files/arindam-tripathi-xr-interactive-systems-cv.pdf",
    cta: "Download"
  },
  {
    title: "Software / Product Engineering",
    description:
      "For software engineering and startup-oriented product roles.",
    href: "/files/arindam-tripathi-software-product-engineering-cv.pdf",
    cta: "Download"
  }
];
