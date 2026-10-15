"use client";

import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";

const STORAGE_KEY = "arillm:v1";

type ChatContextValue = UseChatHelpers<UIMessage> & {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** True once the panel has been opened this visit, so it can lazy-load. */
  hasOpened: boolean;
  ask: (text: string) => void;
  reset: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useArillm(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useArillm must be used inside ChatProvider");
  }
  return context;
}

function readStoredMessages(): UIMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function writeStoredMessages(messages: UIMessage[]) {
  try {
    if (messages.length) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage blocked (private mode etc.): the chat still works, it just won't survive navigation.
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const pathname = usePathname();

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    if (next) setHasOpened(true);
  }, []);

  // The transport is created once, so read the current page through a ref
  // rather than closing over a stale pathname.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/chat",
        body: () => ({
          pageContext: { path: pathnameRef.current, title: document.title }
        })
      }),
    []
  );

  const chat = useChat<UIMessage>({ transport });
  const { messages, setMessages, sendMessage, status, stop } = chat;

  // Restore the conversation after mount (sessionStorage doesn't exist on the
  // server), then persist whenever a turn settles rather than on every token.
  const restored = useRef(false);
  useEffect(() => {
    const stored = readStoredMessages();
    if (stored.length) setMessages(stored);
    restored.current = true;
  }, [setMessages]);

  useEffect(() => {
    if (!restored.current) return;
    if (status === "ready" || status === "error") writeStoredMessages(messages);
  }, [messages, status]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      const isCmdK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (isSlash || isCmdK) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setOpen(true);
      void sendMessage({ text: trimmed });
    },
    [sendMessage, setOpen]
  );

  const reset = useCallback(() => {
    if (status === "submitted" || status === "streaming") void stop();
    setMessages([]);
    chat.clearError();
    writeStoredMessages([]);
  }, [chat, setMessages, status, stop]);

  const value = useMemo(
    () => ({ ...chat, open, setOpen, hasOpened, ask, reset }),
    [chat, open, setOpen, hasOpened, ask, reset]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
