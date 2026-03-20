import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  size?: "default" | "wide" | "narrow";
};

export function Container({ children, className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-container",
        size === "default" && "max-w-[96rem]",
        size === "wide" && "max-w-[104rem]",
        size === "narrow" && "max-w-4xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
