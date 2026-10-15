"use client";

import type { UIMessage } from "ai";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type KeyboardEvent
} from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import { useArillm } from "@/components/arillm/chat-provider";
import { getFollowups } from "@/lib/arillm/followups";
import { getStarters } from "@/lib/arillm/starters";
import { cn } from "@/lib/utils";

export const PANEL_WIDTH_CLASS = "lg:w-[380px]";

const CONTACT_EMAIL = "aritrip@umd.edu";
const FALLBACK_ERROR = "Something went wrong on my end. Try again in a sec.";

const DESKTOP_QUERY = "(min-width: 1024px)";

// This panel is client-only (loaded with ssr: false), so the first render can
// read the real breakpoint instead of guessing and animating from the wrong side.
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

// Route errors arrive as JSON ({ error, limited? }) for 4xx/5xx, or as plain
// text from the stream. Show the server's friendly line when there is one.
function parseError(error: Error): { message: string; retryable: boolean } {
  try {
    const parsed: unknown = JSON.parse(error.message);
    if (parsed && typeof parsed === "object" && "error" in parsed) {
      const { error: message, limited } = parsed as { error: unknown; limited?: unknown };
      if (typeof message === "string" && message) {
        return { message, retryable: limited !== true };
      }
    }
  } catch {
    if (error.message && error.message.length < 200 && !error.message.includes("fetch")) {
      return { message: error.message, retryable: true };
    }
  }
  return { message: FALLBACK_ERROR, retryable: true };
}

function messageText(message: UIMessage): string {
  return message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
}

const markdownComponents: Components = {
  p: (props) => <p className="mb-3 last:mb-0" {...props} />,
  ul: (props) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0" {...props} />,
  ol: (props) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0" {...props} />,
  a: ({ node: _node, ...props }: ComponentPropsWithoutRef<"a"> & { node?: unknown }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline decoration-accent/70 underline-offset-[3px] hover:decoration-accent"
    />
  ),
  code: (props) => <code className="rounded bg-surface px-1 py-0.5 text-[0.85em]" {...props} />
};

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border px-3 py-1.5 text-left text-caption text-text-secondary transition-colors hover:border-accent/60 hover:text-foreground"
    >
      {label}
    </button>
  );
}

function IconButton({
  label,
  onClick,
  children
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface hover:text-foreground"
    >
      {children}
    </button>
  );
}

export function ChatPanel() {
  const {
    open,
    setOpen,
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    reset,
    ask
  } = useArillm();
  const pathname = usePathname();
  const starters = useMemo(() => getStarters(pathname), [pathname]);
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  const busy = status === "submitted" || status === "streaming";

  // Focus the input on open; hand focus back to whatever opened us on close.
  useEffect(() => {
    if (open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      stickToBottom.current = true;
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
    returnFocusTo.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  // The mobile sheet covers the page, so stop the page behind it scrolling.
  useEffect(() => {
    if (!open || isDesktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isDesktop]);

  // Follow the stream unless the visitor has scrolled up to reread.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
  };

  const resizeInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(resizeInput, [input, resizeInput]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    stickToBottom.current = true;
    void sendMessage({ text });
    setInput("");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const errorInfo = error ? parseError(error) : null;
  const lastMessage = messages.at(-1);
  const waitingForFirstToken =
    status === "submitted" || (status === "streaming" && lastMessage?.role === "user");

  // Recomputed only when a reply settles, so the chips don't reshuffle on
  // unrelated re-renders.
  const lastReplyText =
    status === "ready" && lastMessage?.role === "assistant" ? messageText(lastMessage) : "";
  const followups = useMemo(() => {
    if (!lastReplyText) return [];
    const asked = messages.filter((m) => m.role === "user").map(messageText);
    return getFollowups(lastReplyText, asked);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `messages` is read for the asked list only; the reply text is the trigger.
  }, [lastReplyText]);

  const panelMotion = reducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isDesktop
      ? { initial: { x: "100%", y: 0 }, animate: { x: 0, y: 0 }, exit: { x: "100%", y: 0 } }
      : { initial: { x: 0, y: "100%" }, animate: { x: 0, y: 0 }, exit: { x: 0, y: "100%" } };

  return (
    <AnimatePresence>
      {open ? (
        <>
          {!isDesktop ? (
            <motion.button
              key="arillm-backdrop"
              type="button"
              aria-label="Close Ask Ari chat"
              className="fixed inset-0 z-40 bg-foreground/25 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
          ) : null}
          <motion.aside
            key="arillm-panel"
            id="arillm-panel"
            aria-label="Ask Ari chat"
            {...panelMotion}
            transition={{ duration: reducedMotion ? 0.12 : 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className={cn(
              "fixed z-50 flex flex-col bg-background text-foreground",
              // Mobile: full-height bottom sheet.
              "inset-x-0 bottom-0 h-[calc(100dvh-0.75rem)] rounded-t-card border-t border-border shadow-card",
              // Desktop: right drawer; SiteChrome pads the page by the same width.
              "lg:inset-x-auto lg:right-0 lg:top-0 lg:h-dvh lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none",
              PANEL_WIDTH_CLASS
            )}
          >
            <header className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3 lg:h-[4.8rem] lg:py-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg tracking-tight">Ask Ari</h2>
                <div className="group relative">
                  <button
                    type="button"
                    aria-label="About Ask Ari"
                    aria-describedby="arillm-about"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-text-muted hover:text-foreground"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <circle cx="8" cy="8" r="6.5" />
                      <path d="M8 7.2v4M8 4.9v.2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div
                    id="arillm-about"
                    role="tooltip"
                    className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-64 rounded-button border border-border bg-background p-3 font-body text-caption text-text-secondary opacity-0 shadow-card transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                  >
                    An AI version of Ari, trained on this portfolio. It can be wrong. For the real
                    thing: <span className="text-foreground">{CONTACT_EMAIL}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length ? (
                  <IconButton label="Start a new chat" onClick={reset}>
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4M2.5 2.5V5H5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </IconButton>
                ) : null}
                <IconButton label="Close chat" onClick={() => setOpen(false)}>
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" strokeLinecap="round" />
                  </svg>
                </IconButton>
              </div>
            </header>

            <div
              ref={scrollRef}
              onScroll={onScroll}
              aria-live="polite"
              aria-busy={busy}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 font-body text-body-sm"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <p className="font-display text-display-xs leading-tight">Hey, ask me anything.</p>
                  <div className="flex flex-wrap gap-2">
                    {starters.map((starter) => (
                      <Chip key={starter} label={starter} onClick={() => ask(starter)} />
                    ))}
                  </div>
                </div>
              ) : (
                <ol className="flex flex-col gap-5">
                  {messages.map((message) => {
                    const text = messageText(message);
                    if (!text) return null;
                    return message.role === "user" ? (
                      <li key={message.id} className="flex justify-end">
                        <p className="max-w-[85%] whitespace-pre-wrap rounded-card rounded-br-sm bg-surface px-3.5 py-2 text-foreground">
                          {text}
                        </p>
                      </li>
                    ) : (
                      <li key={message.id} className="text-foreground/90">
                        <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
                      </li>
                    );
                  })}
                  {waitingForFirstToken ? (
                    <li aria-label="Ari is typing" className="flex gap-1 py-1">
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted"
                          style={{ animationDelay: `${dot * 150}ms` }}
                        />
                      ))}
                    </li>
                  ) : null}
                  {followups.length && !error ? (
                    <li aria-label="Suggested follow-ups" className="-mt-1 flex flex-wrap gap-2">
                      {followups.map((question) => (
                        <Chip
                          key={question}
                          label={question}
                          onClick={() => {
                            stickToBottom.current = true;
                            ask(question);
                          }}
                        />
                      ))}
                    </li>
                  ) : null}
                  {errorInfo ? (
                    <li className="text-foreground/90">
                      <p className="mb-2">{errorInfo.message}</p>
                      {errorInfo.retryable ? (
                        <button
                          type="button"
                          onClick={() => void regenerate()}
                          className="text-caption text-text-secondary underline decoration-accent/70 underline-offset-[3px] hover:text-foreground"
                        >
                          Try again
                        </button>
                      ) : null}
                    </li>
                  ) : null}
                </ol>
              )}
            </div>

            <form
              onSubmit={submit}
              className="border-t border-border/70 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
            >
              <div className="flex items-end gap-2 rounded-card border border-border bg-background px-3 py-2 focus-within:border-accent/70">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Ask about my work"
                  aria-label="Message Ari"
                  maxLength={1000}
                  disabled={busy}
                  className="max-h-40 flex-1 resize-none bg-transparent py-1 font-body text-body-sm text-foreground outline-none placeholder:text-text-muted disabled:opacity-60"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => void stop()}
                    aria-label="Stop reply"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-button border border-border text-foreground hover:bg-surface"
                  >
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-current" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!input.trim()}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-button bg-accent text-foreground transition-opacity hover:bg-accent/90 disabled:opacity-40"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-2 px-1 text-label-xs uppercase text-text-muted">
                AI, can be wrong · {CONTACT_EMAIL}
              </p>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
