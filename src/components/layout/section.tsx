import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  spacing?: "default" | "compact" | "hero";
};

export function Section({ children, className, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "default" && "py-section",
        spacing === "compact" && "py-10 md:py-14",
        spacing === "hero" && "pt-12 pb-12 md:pt-[4.5rem] md:pb-14",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
