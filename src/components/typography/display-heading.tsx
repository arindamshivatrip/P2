import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type DisplayHeadingProps<T extends ElementType = "h1"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function DisplayHeading<T extends ElementType = "h1">({
  as,
  className,
  ...props
}: DisplayHeadingProps<T>) {
  const Component = as ?? "h1";

  return (
    <Component
      className={cn(
        "font-display text-4xl leading-tight tracking-tight md:text-6xl",
        className
      )}
      {...props}
    />
  );
}
