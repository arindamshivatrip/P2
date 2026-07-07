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
    "I’m based in the U.S., finishing my master’s in human-computer interaction at the University of Maryland. I’m looking for 2026 internships and full-time roles in product design engineering, human-AI interaction, UX engineering, and XR prototyping — and I’m always open to research collaborations.",
  primaryCta: {
    label: "Email me",
    href: "mailto:aritrip@umd.edu"
  },
  secondaryCta: {
    label: "View CV",
    href: "/cv"
  },
  methodsHeading: "Reach me directly",
  personalLine: "Email is fastest — I usually reply within a day. LinkedIn and GitHub for profile and code.",
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
