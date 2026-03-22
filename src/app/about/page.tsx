import { AboutHero } from "@/components/about/about-hero";
import { AboutPersonalStrip } from "@/components/about/about-personal-strip";
import { AboutSnapshot } from "@/components/about/about-snapshot";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutSnapshot />
      <AboutPersonalStrip />
    </>
  );
}
