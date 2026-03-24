import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { HorizontalRail } from "@/components/ui/horizontal-rail";
import { aboutContent } from "@/data/about";

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
            <HorizontalRail
              id="about-personal-rail"
              railLabel="personal images"
              trackClassName="gap-3 px-3 pb-2"
              loop
            >
              {aboutContent.personalImages.map((image) => (
                <article
                  key={image.src}
                  className="group w-[16.5rem] shrink-0 snap-start rounded-[1rem] bg-surface p-2.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(38,31,24,0.11)] md:w-[17.25rem]"
                >
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[0.75rem] bg-background/70">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 72vw, (max-width: 1280px) 28vw, 17.25rem"
                      quality={93}
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>
                  <p className="mt-2 font-body text-[0.72rem] tracking-[0.04em] text-text-muted">
                    {image.label}
                  </p>
                </article>
              ))}
            </HorizontalRail>
          </div>
        </div>
      </Container>
    </Section>
  );
}
