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
  title: "Arindam Tripathi - Builder, researcher, technologist",
  description: "A modular portfolio scaffold focused on systems, storytelling, and interaction.",
  owner: "Ari"
};
