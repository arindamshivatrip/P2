import type { Metadata } from "next";
import { MessagesHero } from "@/components/messages/messages-hero";
import { MessagesWall } from "@/components/messages/messages-wall";
import { buildPageMetadata } from "@/lib/seo";
import { listNotes } from "@/lib/messages/store";

export const metadata: Metadata = buildPageMetadata({
  title: "Messages",
  description: "A shared wall of notes and doodles left by people passing through Arindam Tripathi's portfolio.",
  path: "/messages"
});

// Rebuilt at most every 30s (and right after each new note), so a busy wall
// costs one Redis read per half minute rather than one per visitor.
export const revalidate = 30;

export default async function MessagesPage() {
  const notes = await listNotes();

  return (
    <>
      <MessagesHero />
      <MessagesWall initialNotes={notes} />
    </>
  );
}
