import type { Metadata } from "next";
import { HomeCtaSection } from "@/components/home/home-cta-section";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HomeLensesSection } from "@/components/home/home-lenses-section";
import { HomeSelectedProjectsSection } from "@/components/home/home-selected-projects-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteMeta } from "@/data/site";
import { buildPageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: siteMeta.title,
  description: siteMeta.description,
  path: "/",
  absolute: true
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      <HomeHeroSection />
      <HomeSelectedProjectsSection />
      <HomeLensesSection />
      <HomeCtaSection />
    </>
  );
}
