import { AboutPhotoSheet } from "@/components/about/about-photo-sheet";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { aboutGalleryItems, aboutPersonal } from "@/data/about";

export function AboutPersonalStrip() {
  return (
    <Section spacing="compact" className="pt-0 pb-9 md:pb-10">
      <Container>
        <div className="border-t border-border/60 pt-4 md:pt-5">
          <Eyebrow>{aboutPersonal.eyebrow}</Eyebrow>
          <DisplayHeading as="h2">
            Outside the <span className="font-serif italic">screen</span>
          </DisplayHeading>
          <BodyText tone="secondary" className="mt-4 max-w-3xl">
            {aboutPersonal.intro}
          </BodyText>

          <div className="mt-8 md:mt-10">
            <AboutPhotoSheet items={aboutGalleryItems} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
