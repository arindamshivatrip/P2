import Link from "next/link";
import { HeroAccentRule } from "@/components/home/hero-accent-rule";
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
    <Section spacing="hero" className="pb-8 md:pb-10">
      <Container>
        <div className="flex flex-col justify-center md:min-h-[max(26rem,calc(100svh-16rem))]">
          <DisplayHeading className="text-[11vw] leading-[0.98] sm:text-[3.4rem] md:text-[8.8vw] xl:text-[7.75rem]">
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

          <HeroAccentRule className="mt-6 max-w-[36rem] md:mt-8" />

          <Reveal delay={0.4}>
            <BodyText tone="secondary" className="mt-6 max-w-[58ch] text-[1.05rem] md:mt-7">
              {heroContent.supporting}
            </BodyText>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button asChild>
                <Link href="/contact">{heroContent.primaryCta}</Link>
              </Button>
              <p className="font-body text-sm text-text-muted">{heroContent.signal}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
