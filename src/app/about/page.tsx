import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutPersonalStrip } from "@/components/about/about-personal-strip";
import { AboutSnapshot } from "@/components/about/about-snapshot";

export const metadata: Metadata = {
  title: "About — Arindam Tripathi",
  description:
    "Designer-engineer working across HCI, data, and interactive systems. HCI master's at the University of Maryland; previously L'Oréal Singapore and SP Digital."
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutSnapshot />
      <AboutPersonalStrip />
    </>
  );
}
