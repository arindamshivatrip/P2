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
    "I’m finishing my master’s in human-computer interaction at the University of Maryland, and I’m looking for 2026 internships and full-time roles in human-AI interaction, UX engineering, and XR. If you’re building with XR, AI, research, or product systems — or want a second set of hands on a messy problem — I’d love to hear about it.",
  primaryCta: {
    label: "Say hello",
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
