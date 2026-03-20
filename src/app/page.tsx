import { HomeCtaSection } from "@/components/home/home-cta-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HomeLensesSection } from "@/components/home/home-lenses-section";
import { HomeSelectedProjectsSection } from "@/components/home/home-selected-projects-section";

export default function HomePage() {
  return (
    <>
      <HomeHeroSection />
      <HomeSelectedProjectsSection />
      <HomeLensesSection />
      <HomeCtaSection />
    </>
  );
}
