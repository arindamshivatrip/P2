import Link from "next/link";
import type { ReactNode } from "react";
import { CardQr } from "@/components/mobile-card/card-qr";
import styles from "@/components/mobile-card/mobile-card-page.module.css";
import { CARD_URL, cardContact, cardFeatures, cardIdentity, type CardFeature } from "@/data/card";
import { LogoTile } from "@/components/ui/logo-tile";
import { getProjectBySlug, getWorkDetailHref } from "@/data/projects";
import { cn } from "@/lib/utils";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
      {children}
    </svg>
  );
}

const icons = {
  save: (
    <Icon>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-4A3.5 3.5 0 0 0 4 17.5V19M9.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 8v6M22 11h-6"
      />
    </Icon>
  ),
  linkedin: (
    <Icon>
      <path
        fill="currentColor"
        d="M6.94 8.5A1.44 1.44 0 1 0 6.93 5.6a1.44 1.44 0 0 0 .01 2.88ZM5.7 9.75h2.47v8.56H5.7V9.75Zm3.95 0h2.37v1.17h.03c.33-.63 1.14-1.29 2.34-1.29 2.5 0 2.96 1.64 2.96 3.77v4.9h-2.47v-4.34c0-1.04-.02-2.37-1.44-2.37-1.44 0-1.66 1.13-1.66 2.3v4.41H9.65V9.75Z"
      />
    </Icon>
  ),
  mail: (
    <Icon>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6.5h16v11H4zM4.5 7l7.5 6 7.5-6"
      />
    </Icon>
  )
};

function FeatureMedia({ feature }: { feature: CardFeature }) {
  if (feature.clip) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={feature.clip}
        poster={feature.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />
    );
  }

  const logo = getProjectBySlug(feature.slug)?.logoTile;
  if (logo) {
    return <LogoTile logo={logo} />;
  }

  return (
    <div className="absolute inset-0 flex items-end p-4" style={{ backgroundImage: feature.gradient }}>
      <span className="font-display text-2xl leading-none tracking-tight text-[#f5f4ed]">{feature.mark}</span>
    </div>
  );
}

function FeatureCard({ feature }: { feature: CardFeature }) {
  return (
    <li>
      <Link href={getWorkDetailHref(feature.slug)} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-surface shadow-card">
          <FeatureMedia feature={feature} />
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl leading-tight tracking-tight">{feature.title}</h3>
          <span aria-hidden="true" className="text-text-muted transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
        <p className="mt-0.5 font-body text-label uppercase text-text-muted">{feature.kicker}</p>
        <p className="mt-1.5 font-body text-body-sm text-text-secondary">{feature.blurb}</p>
      </Link>
    </li>
  );
}

// Always encodes the visitor page, so scanning /my_card never lands on the owner copy.
function QrBlock({ className }: { className?: string }) {
  return (
    <section aria-label="QR code for this card" className={cn("flex flex-col items-center", className)}>
      <div className="rounded-[1.25rem] bg-white p-3 shadow-card">
        <CardQr value={CARD_URL} />
      </div>
      <p className="mt-3 font-body text-label-lg uppercase text-text-muted">Scan to open this card</p>
    </section>
  );
}

type MobileCardPageProps = {
  // /my_card (owner, held up for scanning) leads with the QR; /mobile_card
  // (visitors who already tapped or scanned) leads with the profile.
  qrFirst?: boolean;
};

export function MobileCardPage({ qrFirst = false }: MobileCardPageProps) {
  return (
    <main className={cn("min-h-[100svh] bg-background text-foreground", styles.theme)}>
      <div className="mx-auto w-full max-w-[28rem] px-4 pb-[max(env(safe-area-inset-bottom),2rem)] pt-[max(env(safe-area-inset-top),1.5rem)]">
        {qrFirst ? <QrBlock /> : null}

        <header className={cn("flex items-center gap-4", qrFirst && "mt-8 border-t border-border pt-6")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardIdentity.avatar}
            alt={`Portrait of ${cardIdentity.name}`}
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-full object-cover shadow-card"
          />
          <div className="min-w-0">
            <h1 className="font-display text-[2rem] leading-[1.02] tracking-tight">{cardIdentity.name}</h1>
            <p className="mt-1.5 font-body text-body-sm text-foreground">{cardIdentity.badge}</p>
            <p className="font-body text-body-sm text-text-secondary">{cardIdentity.line}</p>
          </div>
        </header>

        <nav aria-label="Contact" className="mt-6 grid grid-cols-2 gap-2.5">
          <a
            href={cardContact.vcard}
            download="arindam-tripathi.vcf"
            className="col-span-2 flex min-h-14 items-center justify-center gap-2.5 rounded-button bg-foreground px-4 font-body text-body-lg text-background active:scale-[0.99]"
          >
            {icons.save}
            Save contact
          </a>
          <a
            href={cardContact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-button border border-border bg-surface/60 px-3 font-body text-body"
          >
            {icons.linkedin}
            LinkedIn
          </a>
          <a
            href={`mailto:${cardContact.email}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-button border border-border bg-surface/60 px-3 font-body text-body"
          >
            {icons.mail}
            Email
          </a>
        </nav>

        <section aria-labelledby="card-featured" className="mt-10">
          <h2 id="card-featured" className="font-body text-label-lg uppercase text-text-muted">
            Recent work
          </h2>
          <ul className="mt-4 space-y-8">
            {cardFeatures.map((feature) => (
              <FeatureCard key={feature.slug} feature={feature} />
            ))}
          </ul>
        </section>

        <footer className="mt-10 border-t border-border pt-6">
          <p className="font-body text-body-sm text-foreground">{cardIdentity.availability}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-body text-body-sm text-text-secondary">
            <Link href="/" className="underline decoration-border underline-offset-4 hover:text-foreground">
              Full portfolio
            </Link>
            <a
              href={cardContact.github}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={cardContact.cv}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              CV (PDF)
            </a>
          </p>

          {qrFirst ? null : <QrBlock className="mt-8" />}
        </footer>
      </div>
    </main>
  );
}
