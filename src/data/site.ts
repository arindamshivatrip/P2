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
  description:
    "Arindam Tripathi — designer-engineer building human-centered AI systems, interfaces, and XR experiences. HCI master's at the University of Maryland; previously L'Oréal Singapore.",
  owner: "Ari"
};
