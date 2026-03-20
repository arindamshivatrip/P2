import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps = ComponentPropsWithoutRef<"p">;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-body text-xs uppercase tracking-[0.16em] text-text-muted",
        className
      )}
      {...props}
    />
  );
}
