import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { AboutParallaxRail } from "@/components/about/about-parallax-rail";
import { aboutContent, aboutGalleryItems } from "@/data/about";

export function AboutPersonalStrip() {
  return (
    <Section spacing="compact" className="pt-0 pb-9 md:pb-10">
      <Container>
        <div className="border-t border-border/60 pt-5 md:pt-6">
          <Eyebrow>Personal</Eyebrow>
          <DisplayHeading as="h2" className="text-4xl md:text-5xl">
            Life outside the <span className="font-serif italic">screen</span>
          </DisplayHeading>
          <BodyText tone="secondary" className="mt-4 max-w-3xl">
            {aboutContent.personal}
          </BodyText>

          <div className="mt-6 md:mt-7">
            <AboutParallaxRail
              id="about-personal-rail"
              items={aboutGalleryItems}
              railLabel="personal images"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
