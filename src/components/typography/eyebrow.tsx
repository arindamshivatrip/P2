import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps<T extends ElementType = "p"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

// The one uppercase-label voice: 0.68rem, 0.13em tracking, muted.
export function Eyebrow<T extends ElementType = "p">({
  as,
  className,
  ...props
}: EyebrowProps<T>) {
  const Component = (as ?? "p") as ElementType;

  return createElement(Component, {
    className: cn("font-body text-label uppercase text-text-muted", className),
    ...props
  });
}
