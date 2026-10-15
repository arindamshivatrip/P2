"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ChatProvider, useArillm } from "@/components/arillm/chat-provider";
import { SELECTION_ROOT_ATTR, SelectionAsk } from "@/components/arillm/selection-ask";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { ProjectLink } from "@/lib/arillm/link-projects";
import { cn } from "@/lib/utils";

// The chat panel (and react-markdown) only downloads once someone opens it.
const ChatPanel = dynamic(
  () => import("@/components/arillm/chat-panel").then((mod) => mod.ChatPanel),
  { ssr: false }
);

type SiteChromeProps = {
  children: ReactNode;
  /** Project pages Ask Ari links to; built on the server from the project data. */
  projectLinks: ProjectLink[];
};

function ChromeWithChat({ children }: { children: ReactNode }) {
  const { open, hasOpened } = useArillm();

  return (
    <>
      {/* On desktop the open drawer pushes the page left instead of covering it. */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-out motion-reduce:transition-none",
          open && "lg:pr-[380px]"
        )}
      >
        <SiteHeader />
        <div className="flex-1" {...{ [SELECTION_ROOT_ATTR]: "" }}>
          {children}
        </div>
        <SiteFooter />
      </div>
      <SelectionAsk />
      {hasOpened ? <ChatPanel /> : null}
    </>
  );
}

export function SiteChrome({ children, projectLinks }: SiteChromeProps) {
  const pathname = usePathname();
  const isStandaloneRoute = pathname === "/mobile_card" || pathname === "/my_card";

  if (isStandaloneRoute) {
    return <>{children}</>;
  }

  return (
    <ChatProvider projectLinks={projectLinks}>
      <ChromeWithChat>{children}</ChromeWithChat>
    </ChatProvider>
  );
}
