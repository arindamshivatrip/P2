import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactMethods } from "@/components/contact/contact-methods";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Arindam Tripathi for XR, HCI, product systems, research, and prototyping conversations.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactMethods />
    </>
  );
}
