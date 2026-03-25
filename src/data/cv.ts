export type CvVersion = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const cvPageContent = {
  eyebrow: "Resume / CV",
  title: "CV",
  intro:
    "A focused view of my work across AI systems, interaction design, and engineering.",
  primaryLabel: "Primary version",
  primaryTitle: "Human-Centered AI Systems",
  primaryDescription:
    "The version I use most often for AI systems, product thinking, and interaction design work.",
  primaryHref: "/files/arindam-tripathi-main-cv.pdf",
  primaryCta: "Download CV",
  contactCta: "Contact me",
  secondaryLabel: "Other versions",
  secondaryIntro:
    "Alternate versions for different kinds of roles.",
  footerNote:
    "Looking for a more specific version? Get in touch."
} as const;

export const cvVersions: CvVersion[] = [
  {
    title: "UX Engineering",
    description:
      "For interaction-heavy product and frontend roles.",
    href: "/files/arindam-tripathi-ux-engineering-cv.pdf",
    cta: "Download"
  },
  {
    title: "UX Research / UX Analytics",
    description:
      "For mixed-methods research and insights roles.",
    href: "/files/arindam-tripathi-ux-research-cv.pdf",
    cta: "Download"
  },
  {
    title: "XR / Interactive Systems",
    description:
      "For spatial computing and immersive interaction roles.",
    href: "/files/arindam-tripathi-xr-interactive-systems-cv.pdf",
    cta: "Download"
  },
  {
    title: "Software / Product Engineering",
    description:
      "For shipping-focused software and product roles.",
    href: "/files/arindam-tripathi-software-product-engineering-cv.pdf",
    cta: "Download"
  }
];
