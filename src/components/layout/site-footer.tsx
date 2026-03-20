import Link from "next/link";
import { Container } from "@/components/layout/container";
import { footerContent } from "@/data/home";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 py-12">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <p className="font-body text-sm font-medium uppercase tracking-[0.08em] text-foreground">
            Designed and coded with ♡ by Arindam
          </p>

          <div className="md:text-right">
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-2 font-body text-sm text-text-secondary md:justify-end"
            >
              <Link href="#" className="hover:text-foreground">
                LinkedIn
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="mailto:arindamtrip@gmail.com" className="hover:text-foreground">
                Email
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="#" className="hover:text-foreground">
                GitHub
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/cv" className="hover:text-foreground">
                CV
              </Link>
            </nav>
            <p className="mt-2 font-body text-xs text-text-muted">{footerContent.availability}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
