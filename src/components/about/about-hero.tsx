import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { aboutContent } from "@/data/about";

export function AboutHero() {
  return (
    <Section spacing="compact" className="pb-6 md:pb-8">
      <Container>
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[0.95rem] bg-surface/65">
            <Image
              src={aboutContent.portrait.src}
              alt={aboutContent.portrait.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 24rem"
              className="object-cover"
              priority
            />
          </div>

          <div className="pt-1 md:pt-2">
            <Eyebrow>About</Eyebrow>
            <DisplayHeading as="h1" className="mt-3 max-w-[18ch] text-5xl leading-[0.98] md:text-6xl">
              I design and build{" "}
              <span className="font-serif italic text-accent">human-centered</span> systems.
            </DisplayHeading>
            <BodyText tone="secondary" className="mt-4 max-w-3xl text-[1.02rem]">
              {aboutContent.openingIdea}
            </BodyText>
            <div className="mt-5 space-y-4 md:mt-6 md:max-w-[62ch]">
              {aboutContent.introParagraphs.map((paragraph) => (
                <BodyText key={paragraph} tone="secondary">
                  {paragraph}
                </BodyText>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
