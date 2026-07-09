import { AboutBio } from "@/components/about/about-bio";
import { PortraitPixel } from "@/components/about/portrait-pixel";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { aboutContent } from "@/data/about";

export function AboutHero() {
  return (
    <Section spacing="compact" className="pb-4 md:pb-5">
      <Container>
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(18rem,24rem)_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <Reveal>
            <PortraitPixel
              src={aboutContent.portrait.src}
              alt={aboutContent.portrait.alt}
            />
          </Reveal>

          <div className="pt-1 md:pt-2">
            <Eyebrow>About</Eyebrow>
            <DisplayHeading as="h1" className="mt-3 max-w-[20ch] text-display-md">
              <TextReveal
                lines={[
                  <span key="work">Making it work is one thing.</span>,
                  <span key="matter">
                    Making it <span className="font-serif italic text-accent">matter</span> is harder.
                  </span>
                ]}
              />
            </DisplayHeading>
            <Reveal delay={0.35}>
              <div className="mt-5 md:mt-6">
                <AboutBio />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
