import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkCta } from "@/components/work/work-cta";
import { WorkGrid } from "@/components/work/work-grid";
import { WorkHeader } from "@/components/work/work-header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Work",
  description:
    "Selected case studies across XR, data-driven product systems, UX research, and interactive engineering.",
  path: "/work"
});

export default function WorkPage() {
  return (
    <>
      <WorkHeader />
      {/* Suspense lets the client index read ?focus= while the page stays static */}
      <Suspense fallback={null}>
        <WorkGrid section="work" />
      </Suspense>
      <WorkCta />
    </>
  );
}
