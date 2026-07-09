import Link from "next/link";
import { HeroAccentRule } from "@/components/home/hero-accent-rule";
import { HeroTrail } from "@/components/home/hero-trail";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { heroContent } from "@/data/home";

export function HomeHeroSection() {
  return (
    <Section spacing="hero" className="relative pb-8 md:pb-10">
      <HeroTrail />
      <Container className="relative z-10">
        <div className="flex flex-col justify-center md:min-h-[max(26rem,calc(100svh-16rem))]">
          <DisplayHeading className="text-display-xl" data-hero-protect="headline">
            <TextReveal
              lines={[
                <span key="line-1">I&apos;m Arindam.</span>,
                <span key="line-2">
                  I <span className="font-serif italic text-accent">design</span> and{" "}
                  <span className="font-serif italic text-accent">build</span>
                </span>,
                <span key="line-3">systems for people.</span>
              ]}
            />
          </DisplayHeading>

          <div data-hero-protect="rule" className="mt-6 max-w-[36rem] md:mt-8">
            <HeroAccentRule />
          </div>

          <Reveal delay={0.4}>
            <BodyText
              tone="secondary"
              className="mt-6 max-w-[58ch] text-body-lg md:mt-7"
              data-hero-protect="paragraph"
            >
              {heroContent.supporting}
            </BodyText>
          </Reveal>

          <Reveal delay={0.5}>
            <div
              data-hero-protect="cta"
              className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <Button asChild>
                <Link href="/contact">{heroContent.primaryCta}</Link>
              </Button>
              <p className="font-body text-caption text-text-muted">{heroContent.signal}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
