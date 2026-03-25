export type ContactMethod = {
  id: string;
  primaryLine?: string;
  secondaryLine?: string;
  href: string;
  ctaLabel: string;
  external?: boolean;
};

export const contactContent = {
  eyebrow: "Contact",
  heading: "Open to thoughtful collaboration.",
  supporting:
    "I’m currently based in the U.S. and pursuing my master’s in human-computer interaction. I’m open to internships, full-time opportunities, and collaborations across human-centered systems, interaction design, and AI-enabled products.",
  primaryCta: {
    label: "Email me",
    href: "mailto:aritrip@umd.edu"
  },
  secondaryCta: {
    label: "View CV",
    href: "/cv"
  },
  methodsHeading: "Reach me directly",
  personalLine: "Email is best for conversation, with LinkedIn and GitHub for profile and work.",
  methods: [
    {
      id: "email",
      primaryLine: "aritrip@umd.edu",
      secondaryLine: "Backup: arindamtrip@gmail.com",
      href: "mailto:aritrip@umd.edu",
      ctaLabel: "Say hello"
    },
    {
      id: "linkedin",
      primaryLine: "arindamtrip",
      href: "https://www.linkedin.com/in/arindamtrip/",
      ctaLabel: "View profile",
      external: true
    },
    {
      id: "github",
      primaryLine: "arindamshivatrip",
      href: "https://github.com/arindamshivatrip",
      ctaLabel: "View profile",
      external: true
    }
  ] as ContactMethod[]
} as const;
