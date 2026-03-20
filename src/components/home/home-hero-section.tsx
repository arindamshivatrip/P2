import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { heroContent } from "@/data/home";

export function HomeHeroSection() {
  return (
    <Section spacing="hero">
      <Container>
        <div className="relative grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="absolute -left-4 top-20 -z-10 hidden h-56 w-56 rounded-full bg-accent/6 blur-3xl md:block" />
          <div className="md:col-span-8 lg:col-span-8">
            <Reveal amount={0.2}>
              <Eyebrow>{heroContent.eyebrow}</Eyebrow>
              <DisplayHeading className="mt-4 max-w-[14ch] text-5xl leading-[0.95] md:text-7xl lg:text-[5.2rem]">
                I&apos;m Arindam.
                <br />
                I <span className="font-serif italic text-accent">design</span> and{" "}
                <span className="font-serif italic text-accent">build</span>
                <br />
                systems for people.
              </DisplayHeading>
              <BodyText tone="secondary" className="mt-8 max-w-[58ch] text-[1.02rem]">
                {heroContent.supporting}
              </BodyText>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <Link href="/contact">{heroContent.primaryCta}</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-4 lg:col-span-4 md:flex md:items-center">
            <Reveal className="w-full md:translate-y-4" delay={0.08}>
              <aside className="rounded-card bg-surface p-6 shadow-card backdrop-blur-sm">
                <ul className="space-y-4">
                  {heroContent.panel.map((line) => (
                    <li
                      key={line}
                      className="font-body text-sm leading-relaxed text-text-secondary last:border-t last:border-border/80 last:pt-4"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
