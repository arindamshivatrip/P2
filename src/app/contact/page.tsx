import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMethods } from "@/components/contact/contact-methods";

export const metadata: Metadata = {
  title: "Contact — Arindam Tripathi",
  description:
    "Get in touch about 2026 internships, full-time roles, and research collaborations in human-centered AI, UX engineering, and XR."
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMethods />
    </>
  );
}
