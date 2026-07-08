import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkCta } from "@/components/work/work-cta";
import { WorkGrid } from "@/components/work/work-grid";
import { WorkHeader } from "@/components/work/work-header";

export const metadata: Metadata = {
  title: "Work — Arindam Tripathi",
  description:
    "Case studies across AI systems, interaction design, research, and XR — including work at L'Oréal Singapore and the University of Maryland."
};

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
