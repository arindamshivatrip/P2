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
  primaryTitle: "Creative Technologist / XR",
  primaryDescription:
    "The version I reach for most — XR builds, prototypes, and working demos, with the portfolio carrying the rest.",
  primaryHref: "/files/arindam-tripathi-main-cv.pdf",
  primaryCta: "Download CV (PDF)",
  contactCta: "Contact me",
  lastUpdated: "Updated September 2026 · PDF, one page",
  secondaryLabel: "Other versions",
  secondaryIntro:
    "Alternate versions for different kinds of roles.",
  footerNote:
    "Looking for a more specific version? Get in touch."
} as const;

export const cvVersions: CvVersion[] = [
  {
    title: "Applied AI",
    description:
      "For AI-product teams — production React/TypeScript and Python, with a design background.",
    href: "/files/arindam-tripathi-applied-ai-cv.pdf",
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
    title: "Software Engineering",
    description:
      "For shipping-focused software roles.",
    href: "/files/arindam-tripathi-software-product-engineering-cv.pdf",
    cta: "Download"
  },
  {
    title: "Product Management",
    description:
      "For APM roles — product decisions, stakeholder work, and metric-driven outcomes.",
    href: "/files/arindam-tripathi-product-management-cv.pdf",
    cta: "Download"
  }
];
