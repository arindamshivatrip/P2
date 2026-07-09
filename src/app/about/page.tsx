import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutPersonalStrip } from "@/components/about/about-personal-strip";
import { AboutSnapshot } from "@/components/about/about-snapshot";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Arindam Tripathi’s path from computer engineering and product systems to human-computer interaction, XR, human-AI interaction, and research-led prototyping.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutSnapshot />
      <AboutPersonalStrip />
    </>
  );
}
