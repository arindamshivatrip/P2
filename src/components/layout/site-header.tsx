"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { homeHeader } from "@/data/home";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

type HeaderNavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function HeaderNavLink({ href, label, isActive }: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative pb-1 font-body text-base font-medium text-foreground/80 hover:text-foreground",
        isActive && "text-foreground"
      )}
    >
      <span>{label}</span>
      {isActive ? (
        <span
          aria-hidden="true"
          className="absolute -bottom-[2px] left-0 h-px w-full bg-accent"
        />
      ) : null}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <Container className="flex h-[4.4rem] items-center justify-between md:h-[4.8rem]">
        <Link
          href="/"
          className="max-w-[60%] truncate font-display text-sm tracking-tight sm:text-base md:max-w-none md:text-lg"
        >
          {homeHeader.wordmark}
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {navItems.map((item) => {
            const isHome = item.href === "/";
            const isActive = isHome ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActive}
              />
            );
          })}
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/65 text-foreground/90 transition-colors hover:bg-surface md:hidden"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="relative block h-4 w-4">
            <span
              className={cn(
                "absolute left-0 top-[3px] h-px w-4 bg-current transition-transform duration-200",
                menuOpen && "translate-y-[4px] rotate-45"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[7px] h-px w-4 bg-current transition-opacity duration-200",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-[11px] h-px w-4 bg-current transition-transform duration-200",
                menuOpen && "-translate-y-[4px] -rotate-45"
              )}
            />
          </span>
        </button>
      </Container>
      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close mobile menu"
            className="fixed inset-0 top-[4.4rem] z-20 bg-transparent md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-30 border-t border-border/60 bg-background/95 md:hidden">
            <Container>
              <nav aria-label="Mobile primary" className="flex flex-col py-3">
                {navItems.map((item) => {
                  const isHome = item.href === "/";
                  const isActive = isHome ? pathname === "/" : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block py-2.5 font-body text-[0.98rem] text-foreground/85 transition-colors hover:text-foreground",
                        isActive && "text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </Container>
          </div>
        </>
      ) : null}
    </header>
  );
}
