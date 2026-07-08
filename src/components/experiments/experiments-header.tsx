import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { ExperimentStamp } from "@/components/experiments/experiment-stamp";
import { TextReveal } from "@/components/ui/text-reveal";

export function ExperimentsHeader() {
  return (
    <Section spacing="compact" className="pt-5 pb-2 md:pt-6 md:pb-3">
      <Container>
        <DisplayHeading
          as="h1"
          className="text-[13vw] leading-[0.95] sm:text-6xl md:text-[7.5vw] xl:text-[6.5rem]"
        >
          <TextReveal
            lines={[
              <span key="experiments">
                Experiments
                <ExperimentStamp
                  label="ongoing"
                  className="ml-4 hidden -translate-y-[0.8em] -rotate-3 align-baseline text-[0.6rem] md:inline-block"
                />
              </span>
            ]}
          />
        </DisplayHeading>
        <BodyText tone="secondary" className="mt-3 max-w-[62ch] text-[1rem] leading-[1.55]">
          The lab side of the site — prototypes, game jams, and studies built to learn
          something specific. Some shipped, some are mid-experiment.{" "}
          <span className="font-serif italic">That&apos;s the point.</span>
        </BodyText>
      </Container>
    </Section>
  );
}
