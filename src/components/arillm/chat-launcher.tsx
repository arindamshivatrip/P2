"use client";

import { useArillm } from "@/components/arillm/chat-provider";
import { cn } from "@/lib/utils";

type ChatLauncherProps = {
  variant: "desktop" | "mobile";
};

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 0.5c.4 3.6 1.9 5.1 5.5 5.5-3.6.4-5.1 1.9-5.5 5.5-.4-3.6-1.9-5.1-5.5-5.5C6.1 5.6 7.6 4.1 8 .5Z" />
      <path d="M13 10c.2 1.7.9 2.4 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.1 2.3-.8 2.5-2.5Z" opacity=".6" />
    </svg>
  );
}

export function ChatLauncher({ variant }: ChatLauncherProps) {
  const { open, setOpen } = useArillm();

  if (variant === "mobile") {
    return (
      <button
        type="button"
        aria-label={open ? "Close Ask Ari chat" : "Open Ask Ari chat"}
        aria-expanded={open}
        aria-controls="arillm-panel"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex h-10 items-center gap-1.5 rounded-md border border-border/65 px-3 font-body text-sm text-foreground/90 transition-colors hover:bg-surface md:hidden",
          open && "border-accent/60 bg-surface"
        )}
      >
        <SparkIcon className="h-3.5 w-3.5 text-accent" />
        Ask Ari
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="arillm-panel"
      aria-keyshortcuts="/ Control+K Meta+K"
      title="Chat with an AI version of Ari (press /)"
      onClick={() => setOpen(!open)}
      className={cn(
        "group relative inline-flex items-center gap-1.5 pb-1 font-body text-base text-foreground/80 hover:text-foreground",
        open && "text-foreground"
      )}
    >
      <SparkIcon className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:rotate-45" />
      <span>Ask Ari</span>
      {open ? (
        <span aria-hidden="true" className="absolute -bottom-[2px] left-0 h-px w-full bg-accent" />
      ) : null}
    </button>
  );
}
