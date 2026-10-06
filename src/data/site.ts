export type NavItem = {
  href: string;
  label: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/cv", label: "CV" }
];

export const siteMeta = {
  url: "https://arindamtripathi.com",
  name: "Arindam Tripathi",
  formalName: "Arindam Shiva Tripathi",
  title: "Arindam Tripathi — HCI, XR & Product Systems",
  description:
    "Portfolio of Arindam Tripathi, an HCI graduate student and builder working across XR, human-AI interaction, data-driven tools, and accessible product systems.",
  // Sitewide social-preview image, cropped to 1200x630.
  ogImage: "/images/about/capitol-og.jpg",
  ogImageAlt: "Arindam Tripathi",
  sameAs: [
    "https://www.linkedin.com/in/arindamtrip/",
    "https://github.com/arindamshivatrip"
  ],
  owner: "Ari"
};
