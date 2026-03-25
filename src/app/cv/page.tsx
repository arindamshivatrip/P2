import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { cvPageContent, cvVersions } from "@/data/cv";

export default function CvPage() {
  return (
    <Section spacing="compact">
      <Container>
        <Eyebrow>{cvPageContent.eyebrow}</Eyebrow>
        <DisplayHeading as="h1" className="mt-2.5 text-5xl md:text-6xl">
          {cvPageContent.title}
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-4 max-w-3xl">
          {cvPageContent.intro}
        </BodyText>

        <div className="relative mt-8 max-w-5xl py-1 pl-4">
          <span aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-accent/45" />
          <Eyebrow>{cvPageContent.primaryLabel}</Eyebrow>
          <DisplayHeading as="h2" className="mt-2.5 text-[2.5rem] md:text-[3.15rem]">
            {cvPageContent.primaryTitle}
          </DisplayHeading>
          <BodyText tone="secondary" className="mt-3.5 max-w-2xl">
            {cvPageContent.primaryDescription}
          </BodyText>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild className="px-4 py-2.5 text-sm">
              <Link href={cvPageContent.primaryHref} download>
                {cvPageContent.primaryCta}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="px-4 py-2.5 text-sm">
              <Link href="/contact">{cvPageContent.contactCta}</Link>
            </Button>
          </div>
        </div>

        <div className="mt-11 max-w-6xl">
          <Eyebrow>{cvPageContent.secondaryLabel}</Eyebrow>
          <BodyText tone="muted" className="mt-2.5 max-w-2xl text-sm">
            {cvPageContent.secondaryIntro}
          </BodyText>

          <div className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {cvVersions.map((version) => (
              <article key={version.href} className="border-t border-border/40 pt-3.5">
                <h3 className="font-display text-[1.38rem] leading-tight tracking-tight text-foreground md:text-[1.52rem]">
                  {version.title}
                </h3>
                <BodyText tone="secondary" className="mt-1.5 max-w-[44ch] text-[0.95rem]">
                  {version.description}
                </BodyText>
                <Link
                  href={version.href}
                  download
                  className="mt-2.5 inline-flex items-center gap-1.5 font-body text-[0.68rem] uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-foreground"
                >
                  <span>{version.cta}</span>
                  <span aria-hidden="true">+</span>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 max-w-6xl border-t border-border/40 pt-4">
          <BodyText tone="muted" className="max-w-3xl text-sm">
            {cvPageContent.footerNote}
          </BodyText>
        </div>
      </Container>
    </Section>
  );
}
