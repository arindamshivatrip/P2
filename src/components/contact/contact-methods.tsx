"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BodyText } from "@/components/typography/body-text";
import { DisplayHeading } from "@/components/typography/display-heading";
import { Eyebrow } from "@/components/typography/eyebrow";
import { Button } from "@/components/ui/button";
import { contactContent } from "@/data/contact";

type ContactIconProps = {
  id: string;
};

function ContactIcon({ id }: ContactIconProps) {
  if (id === "email") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M3.8 7.2a2.4 2.4 0 0 1 2.4-2.4h11.6a2.4 2.4 0 0 1 2.4 2.4v9.6a2.4 2.4 0 0 1-2.4 2.4H6.2a2.4 2.4 0 0 1-2.4-2.4V7.2Zm2.1.3L12 11.8l6.1-4.3-.9-1.2-5.2 3.7-5.2-3.7-.9 1.2Z" />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M5.6 4.8A1.8 1.8 0 0 0 3.8 6.6v10.8c0 1 .8 1.8 1.8 1.8h12.8c1 0 1.8-.8 1.8-1.8V6.6a1.8 1.8 0 0 0-1.8-1.8H5.6Zm2.1 4.1a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm1.3 8.4H6.6V10h2.4v7.3Zm8.4 0H15V13c0-1.2-.4-2-1.5-2-1.1 0-1.8.8-1.8 2.1v4.2H9.3V10h2.3v1.1c.5-.8 1.4-1.4 2.8-1.4 2 0 3 1.3 3 3.6v4Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path d="M12 3.4a8.8 8.8 0 0 0-2.8 17.2c.4.1.6-.2.6-.5v-1.4c-2.5.5-3.1-1.1-3.1-1.1-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.4 2.4 1 2.9.8.1-.7.4-1.1.8-1.4-2-.2-4.1-1-4.1-4.4 0-1 .3-1.8.8-2.4-.1-.2-.4-1.2.1-2.4 0 0 .8-.3 2.5 1a8.3 8.3 0 0 1 4.6 0c1.7-1.3 2.5-1 2.5-1 .5 1.2.2 2.2.1 2.4.5.6.8 1.4.8 2.4 0 3.4-2.1 4.2-4.1 4.4.4.3.8 1 .8 2v2.1c0 .3.2.6.6.5A8.8 8.8 0 0 0 12 3.4Z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
      <rect x="7" y="6.2" width="8.3" height="8.3" rx="1.5" opacity="0.92" />
      <rect x="4.2" y="3.5" width="8.3" height="8.3" rx="1.5" opacity="0.55" />
    </svg>
  );
}

export function ContactMethods() {
  const [copied, setCopied] = useState(false);

  const handleCopyPrimaryEmail = async () => {
    try {
      await navigator.clipboard.writeText("aritrip@umd.edu");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section spacing="compact" className="pt-0 pb-10 md:pb-12">
      <Container>
        <div className="pt-1 md:pt-2">
          <Eyebrow>Methods</Eyebrow>
          <DisplayHeading as="h2" className="mt-2 text-4xl md:text-5xl">
            {contactContent.methodsHeading}
          </DisplayHeading>
          <BodyText tone="secondary" className="mt-3 max-w-[62ch]">
            {contactContent.personalLine}
          </BodyText>

          <div className="mt-6 max-w-5xl">
            <div className="grid gap-5 md:grid-cols-3 md:gap-0">
            {contactContent.methods.map((method) => (
              <article
                key={method.id}
                className="min-w-0 px-0 py-2.5 md:px-6 md:py-3 [&:not(:first-child)]:md:border-l [&:not(:first-child)]:md:border-border/55"
              >
                <div className="inline-flex items-center justify-center text-foreground/90">
                  <ContactIcon id={method.id} />
                </div>

                <div className="mt-3 min-h-[3.35rem] min-w-0">
                  {method.id === "email" ? (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate font-body text-[1.04rem] text-foreground/95">{method.primaryLine}</p>
                      <button
                        type="button"
                        onClick={handleCopyPrimaryEmail}
                        aria-label="Copy primary email"
                        className={`-mt-px ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                          copied
                            ? "text-foreground/80"
                            : "text-text-muted/80 hover:bg-surface hover:text-foreground/75"
                        }`}
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  ) : method.primaryLine ? (
                    <p className="truncate font-body text-[1.04rem] text-foreground/95">{method.primaryLine}</p>
                  ) : null}
                  {method.id === "email" && method.secondaryLine ? (
                    <p className="mt-1 truncate font-body text-[0.72rem] tracking-[0.025em] text-text-secondary">
                      {method.secondaryLine}
                    </p>
                  ) : (
                    <p className="mt-1 truncate font-body text-[0.72rem] text-transparent" aria-hidden="true">
                      spacer
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  {method.id === "email" ? (
                    <Button asChild className="px-4 py-2.5 text-[0.86rem]">
                      <Link href={method.href}>{method.ctaLabel}</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" className="px-4 py-2.5 text-[0.86rem]">
                      <Link
                        href={method.href}
                        target={method.external ? "_blank" : undefined}
                        rel={method.external ? "noreferrer" : undefined}
                      >
                        {method.ctaLabel}
                      </Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
