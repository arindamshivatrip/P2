import type { Metadata } from "next";
import { WorkCta } from "@/components/work/work-cta";
import { WorkFilters } from "@/components/work/work-filters";
import { WorkGrid } from "@/components/work/work-grid";
import { WorkHeader } from "@/components/work/work-header";

export const metadata: Metadata = {
  title: "Work — Arindam Tripathi",
  description:
    "Case studies across AI systems, interaction design, research, and XR — including work at L'Oréal Singapore and the University of Maryland."
};

type WorkPageProps = {
  searchParams?: Promise<{ focus?: string }>;
};

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = (await searchParams) ?? {};
  const focus = params.focus ?? "all";

  return (
    <>
      <WorkHeader />
      <WorkFilters activeFilter={focus} />
      <WorkGrid activeFilter={focus} section="work" />
      <WorkCta />
    </>
  );
}
